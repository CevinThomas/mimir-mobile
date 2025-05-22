import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { completeDeckSession, createDeckSession } from '../api/DeckSessionApi'
import useErrorSnackbar from '../hooks/useErrorSnackbar'

import { getColorProperty } from '../helpers'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import {
  createPromoteRequest,
  favoriteDeck,
  getDeck,
  getEligibleShareUsers,
  removeFeaturedDeck,
  removeSharedDeck,
  shareDeck,
  viewedAccountDecks
} from '../api/DecksApi'
import { useTheme } from '../context/ThemeContext'
import NormalText from '../components/Typography/NormalText'
import InvisibleButton from '../components/Buttons/InvisibleButton'
import Ionicons from '@expo/vector-icons/Ionicons'
import CheckboxClickItem from '../components/CheckboxClickItem'
import DeckBackground from '../svgs/DeckBackground'
import FilledButton from '../components/Buttons/FilledButton'
import ClearButton from '../components/Buttons/ClearButton'
import Header from '../components/Header'
import { useStoreContext } from '../context/StoreContext'

export default function Deck(props: {
  route: {
    params: {
      deck: { name: string; id: string }
      ongoingDeck: boolean
      completed?: boolean
      isNew?: boolean
      onViewedPress?: () => void
    }
  }
}) {
  const { state } = useStoreContext()
  const { theme } = useTheme()
  const navigation = useNavigation()
  const [displayShare, setDisplayShare] = useState(false)
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [deck, setDeck] = useState({})
  const [isOwnerOfDeck, setIsOwnerOfDeck] = useState(false)

  const [favorite, setFavorite] = useState(false)
  const [promoteRequest, setPromoteRequest] = useState({})
  const [isFeaturedForUser, setIsFeaturedForUser] = useState(false)
  const [sharedFrom, setSharedFrom] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const { showError, errorSnackbar } = useErrorSnackbar()

  useEffect(() => {
    setIsCompleted(props.route.params.completed || false)
    fetchDeckInfo()
    fetchUsersEligibleForShare()
  }, [])

  useEffect(() => {
    if (props.route.params.isNew) {
      viewedAccountDecks(props.route.params.deck.id)
    }
  }, [])

  const fetchDeckInfo = async () => {
    try {
      const response = await getDeck(props.route.params.deck.id)

      if (response.status === 404) {
        showError('Deck not found')
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home', params: { screen: 'Decks' } }]
          })
        )
      } else {
        if (response.data.deck.user === state.user.id) {
          setIsOwnerOfDeck(true)
        }
        setDeck(response.data.deck)
        setPromoteRequest(response.data.promote_request)
        setFavorite(response.data.favorite)
        setIsFeaturedForUser(response.data.featured_for_user)
        setSharedFrom(response.data.shared_from)
      }
    } catch (error) {
      showError()
    }
  }

  const fetchUsersEligibleForShare = async () => {
    try {
      const response = await getEligibleShareUsers(props.route.params.deck.id)
      setUsers(response)
    } catch (error) {
      showError()
    }
  }

  const onCompleteFeaturedDeckPress = async () => {
    try {
      const response = await removeFeaturedDeck(props.route.params.deck.id)
      if (response.status === 200 || response.status === 204) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home', params: { screen: 'Decks' } }]
          })
        )
      } else {
        showError('Failed to complete featured deck')
      }
    } catch (error) {
      showError()
    }
  }

  const handleRemovePress = async () => {
    try {
      const response = await removeSharedDeck(props.route.params.deck.id)
      if (response.status === 200 || response.status === 204) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home', params: { screen: 'Decks' } }]
          })
        )
      } else {
        showError('Failed to unshare deck')
      }
    } catch (error) {
      showError()
    }
  }

  const handleStartPress = async () => {
    if (props.route.params.ongoingDeck) {
      return navigation.navigate('DeckSession', { id: props.route.params.deck.deckSessionId })
    }

    try {
      const response = await createDeckSession(props.route.params.deck.id)
      navigation.navigate('DeckSession', { id: response.deck_session.id })
    } catch (error) {
      showError()
    }
  }

  const handleCompleteDeckSession = async () => {
    try {
      await completeDeckSession(props.route.params.deck.deckSessionId)
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home', params: { screen: 'Decks' } }]
        })
      )
    } catch (error) {
      showError(error.message || 'Failed to complete deck session')
    }
  }

  const handleFavoritePress = async () => {
    try {
      const response = await favoriteDeck(props.route.params.deck.id)
      if (response.status === 200 || response.status === 204) {
        fetchDeckInfo()
      } else {
        showError('Failed to favorite deck')
      }
    } catch (error) {
      showError()
    }
  }

  const handleSharePress = () => {
    if (displayShare) {
      bottomSheetRef.current?.close()
      setDisplayShare(false)
      return
    }
    setDisplayShare(true)
  }

  const handleShare = async () => {
    try {
      const response = await shareDeck(props.route.params.deck.id, selectedUsers)
      if (response.status === 200 || response.status === 204) {
        // Success message could be shown here if needed
        bottomSheetRef.current?.close()
        setDisplayShare(false)
        fetchUsersEligibleForShare()
      } else {
        showError('Failed to share deck')
      }
    } catch (error) {
      showError()
    }
  }

  const handleClose = () => {
    setDisplayShare(false)
  }

  const handleShareChecked = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
      return
    }
    setSelectedUsers([...selectedUsers, userId])
  }

  const handlePromoteRequest = async () => {
    try {
      const response = await createPromoteRequest(props.route.params.deck.id)
      if (response.status === 200 || response.status === 204) {
        // Success message could be shown here if needed
        fetchDeckInfo()
      } else {
        showError('Failed to send promote request')
      }
    } catch (error) {
      showError()
    }
  }

  const handleEditPress = () => {
    navigation.navigate('CreateDeck', { deck: deck })
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Header />
      <View style={styles.banner}>
        <DeckBackground />
      </View>
      <View style={[styles.info, { backgroundColor: getColorProperty(theme, 'background') }]}>
        {deck.notice && (
          <View style={{ backgroundColor: 'orange', borderRadius: 10, padding: 10 }}>
            <NormalText>{deck.notice}</NormalText>
          </View>
        )}
        <View style={{ flex: 5 }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                marginTop: 20
              }}
            >
              <NormalText style={{ fontWeight: 'bold', fontSize: 24 }}>
                {props.route.params.deck.name}
              </NormalText>
              {!isCompleted &&
                (favorite ? (
                  <Ionicons onPress={handleFavoritePress} name="star" size={24} color="white" />
                ) : (
                  <Ionicons
                    onPress={handleFavoritePress}
                    name={'star-outline'}
                    size={24}
                    color={'white'}
                  />
                ))}
            </View>

            {deck.deck_type === 'account_deck' && (
              <NormalText style={{ marginBottom: 10 }}>Created by {deck.account.name}</NormalText>
            )}
            {sharedFrom && <NormalText>Shared from: {sharedFrom.email}</NormalText>}
            {promoteRequest && !deck.account?.id && (
              <NormalText>Promote status {promoteRequest.status}</NormalText>
            )}
            {deck.description && <NormalText>{deck.description}</NormalText>}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            {!isCompleted && !sharedFrom && deck.deck_type === 'private_deck' && isOwnerOfDeck && (
              <InvisibleButton onPress={handleSharePress}>Share</InvisibleButton>
            )}

            {!isCompleted && sharedFrom && (
              <InvisibleButton onPress={handleRemovePress}>Unshare Deck</InvisibleButton>
            )}

            {!isCompleted &&
              !promoteRequest &&
              !sharedFrom &&
              deck.deck_type === 'private_deck' &&
              isOwnerOfDeck && (
                <InvisibleButton onPress={handlePromoteRequest}>Request promote</InvisibleButton>
              )}
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
          {isOwnerOfDeck && !isCompleted && (
            <View style={{ marginBottom: 15 }}>
              <ClearButton onPress={handleEditPress}>Edit Deck</ClearButton>
            </View>
          )}
          {isFeaturedForUser && !isCompleted && (
            <View style={{ marginBottom: 15 }}>
              <ClearButton onPress={onCompleteFeaturedDeckPress}>
                Complete featured deck
              </ClearButton>
            </View>
          )}
          {props.route.params.ongoingDeck && !isCompleted && (
            <ClearButton onPress={handleCompleteDeckSession}>Complete deck session</ClearButton>
          )}
          {!isCompleted && (
            <FilledButton onPress={handleStartPress}>
              {props.route.params.ongoingDeck ? 'Continue deck session' : 'Start deck'}
            </FilledButton>
          )}
        </View>

        {displayShare && (
          <BottomSheet
            onClose={handleClose}
            enableDynamicSizing={false}
            index={1}
            enablePanDownToClose={true}
            snapPoints={[800, 800]}
            ref={bottomSheetRef}
            backgroundStyle={{ backgroundColor: getColorProperty(theme, 'background') }}
          >
            <BottomSheetView style={[styles.contentContainer]}>
              <NormalText style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 20 }}>
                Share this deck
              </NormalText>
              <View style={{ flex: 4, width: '100%' }}>
                <ScrollView style={{ flex: 1 }}>
                  {users.map((user: any) => (
                    <View style={{ marginBottom: 10 }} key={user.id}>
                      <CheckboxClickItem
                        onPress={() => handleShareChecked(user.id)}
                        title={user.email}
                        key={user.id}
                        checked={selectedUsers.includes(user.id)}
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>

              {users.length > 0 ? (
                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
                  <FilledButton onPress={handleShare}>Share with selected users</FilledButton>
                </View>
              ) : (
                <Text>You have no one to share with :(</Text>
              )}
            </BottomSheetView>
          </BottomSheet>
        )}
      </View>
      {errorSnackbar()}
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'flex-start'
  },
  container: {
    flex: 1
  },
  banner: {
    flex: 4
  },
  info: {
    flex: 9,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    zIndex: 1
  }
})
