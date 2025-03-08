import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { createDeckSession } from '../api/DeckSessionApi'
import MainButton from '../components/Buttons/MainButton'

import { getColorProperty } from '../helpers'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import {
  createPromoteRequest,
  deleteDeck,
  favoriteDeck,
  getDeck,
  getEligibleShareUsers,
  removeFeaturedDeck,
  removeSharedDeck,
  shareDeck
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

export default function Deck(props: { route: { params: { deck: { name: string; id: string } } } }) {
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
  const bottomSheetRef = useRef<BottomSheet>(null)

  useEffect(() => {
    fetchDeckInfo()
    fetchUsersEligibleForShare()
  }, [])

  const fetchDeckInfo = async () => {
    const response = await getDeck(props.route.params.deck.id)

    if (response.status === 404) {
      alert('Deck not found')
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
  }

  const fetchUsersEligibleForShare = async () => {
    const response = await getEligibleShareUsers(props.route.params.deck.id)
    setUsers(response)
  }

  const onCompleteFeaturedDeckPress = async () => {
    const response = await removeFeaturedDeck(props.route.params.deck.id)
    if (response.status === 200 || response.status === 204) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home', params: { screen: 'Decks' } }]
        })
      )
    } else {
      alert('Failed to complete featured deck')
    }
  }

  const handleDeletePress = async () => {
    const response = await deleteDeck(props.route.params.deck.id)
    if (response.status === 200 || response.status === 204) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home', params: { screen: 'Decks' } }]
        })
      )
    } else {
      alert('Failed to delete deck')
    }
  }

  const handleRemovePress = async () => {
    const response = await removeSharedDeck(props.route.params.deck.id)
    if (response.status === 200 || response.status === 204) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home', params: { screen: 'Decks' } }]
        })
      )
    } else {
      alert('Failed to unshare deck')
    }
  }

  const handleStartPress = async () => {
    const response = await createDeckSession(props.route.params.deck.id)
    navigation.navigate('DeckSession', { deck: response.deck_session })
  }

  const handleFavoritePress = async () => {
    const response = await favoriteDeck(props.route.params.deck.id)
    if (response.status === 200 || response.status === 204) {
      fetchDeckInfo()
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
    const response = await shareDeck(props.route.params.deck.id, selectedUsers)
    if (response.status === 200 || response.status === 204) {
      alert('Deck shared successfully')
    } else {
      alert('Failed to share deck')
    }

    bottomSheetRef.current?.close()
    setDisplayShare(false)
    fetchUsersEligibleForShare()
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
    const response = await createPromoteRequest(props.route.params.deck.id)
    if (response.status === 200 || response.status === 204) {
      alert('Promote request sent')
      fetchDeckInfo()
    } else {
      alert('Failed to send promote request')
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
              {favorite ? (
                <Ionicons onPress={handleFavoritePress} name="star" size={24} color="white" />
              ) : (
                <Ionicons
                  onPress={handleFavoritePress}
                  name={'star-outline'}
                  size={24}
                  color={'white'}
                />
              )}
            </View>

            {deck.account?.id && (
              <NormalText style={{ marginBottom: 10 }}>Created by {deck.account.name}</NormalText>
            )}
            {sharedFrom && <NormalText>Shared from: {sharedFrom.email}</NormalText>}
            {promoteRequest && !deck.account?.id && (
              <NormalText>Promote status {promoteRequest.status}</NormalText>
            )}
            {deck.description && <NormalText>{deck.description}</NormalText>}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            {!sharedFrom && !deck.account?.id && isOwnerOfDeck && (
              <InvisibleButton onPress={handleSharePress}>Share</InvisibleButton>
            )}

            {sharedFrom && (
              <InvisibleButton onPress={handleRemovePress}>Unshare Deck</InvisibleButton>
            )}

            {!promoteRequest && !sharedFrom && !deck.account?.id && isOwnerOfDeck && (
              <InvisibleButton onPress={handlePromoteRequest}>Request promote</InvisibleButton>
            )}
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
          {isOwnerOfDeck && (
            <View style={{ marginBottom: 15 }}>
              <ClearButton onPress={handleEditPress}>Edit Deck</ClearButton>
            </View>
          )}
          {isFeaturedForUser && (
            <View style={{ marginBottom: 15 }}>
              <ClearButton onPress={onCompleteFeaturedDeckPress}>
                Complete featured deck
              </ClearButton>
            </View>
          )}
          <FilledButton onPress={handleStartPress}>Start deck</FilledButton>
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
                  <MainButton onPress={handleShare}>Share with selected users</MainButton>
                </View>
              ) : (
                <Text>You have no one to share with :(</Text>
              )}
            </BottomSheetView>
          </BottomSheet>
        )}
      </View>
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
