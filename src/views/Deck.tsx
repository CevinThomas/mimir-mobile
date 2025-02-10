import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, CheckBox } from '@rneui/themed'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { createDeckSession } from '../api/DeckSessionApi'

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import {
  createPromoteRequest,
  deleteDeck,
  favoriteDeck,
  getDeck,
  getEligibleShareUsers,
  removeSharedDeck,
  shareDeck
} from '../api/DecksApi'

export default function Deck(props: { route: { params: { deck: { name: string; id: string } } } }) {
  const navigation = useNavigation()
  const [displayShare, setDisplayShare] = useState(false)
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [deck, setDeck] = useState({})
  const [favorite, setFavorite] = useState(false)
  const [promoteRequest, setPromoteRequest] = useState({})
  const [sharedFrom, setSharedFrom] = useState({})
  const bottomSheetRef = useRef<BottomSheet>(null)

  useEffect(() => {
    fetchDeckInfo()
    fetchUsersEligibleForShare()
  }, [])

  const fetchDeckInfo = async () => {
    const response = await getDeck(props.route.params.deck.id)
    setDeck(response.deck)
    setPromoteRequest(response.promote_request)
    setFavorite(response.favorite)
    setSharedFrom(response.shared_from)
  }

  const fetchUsersEligibleForShare = async () => {
    const response = await getEligibleShareUsers(props.route.params.deck.id)
    setUsers(response)
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
      alert('Deck favorited successfully')
      fetchDeckInfo()
    } else {
      alert('Failed to favorite deck')
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
    } else {
      alert('Failed to send promote request')
    }
  }

  const handleEditPress = () => {
    navigation.navigate('CreateDeck', { deck: deck })
  }

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <Text>{props.route.params.deck.name}</Text>
        {sharedFrom && <Text>Shared from: {sharedFrom.email}</Text>}
        {promoteRequest && !deck.account_id && <Text>Promote status {promoteRequest.status}</Text>}
        <Button onPress={handleStartPress}>Start</Button>
        <Button onPress={handleFavoritePress}>Favorite</Button>
        {sharedFrom && <Button onPress={handleRemovePress}>Unshare Deck</Button>}
        {!sharedFrom && !deck.account_id && <Button onPress={handleSharePress}>Share Deck</Button>}
        {!promoteRequest && !sharedFrom && (
          <Button onPress={handlePromoteRequest}>Request to promote</Button>
        )}
        {!deck.account_id && !sharedFrom && (
          <Button onPress={handleDeletePress}>Delete Deck</Button>
        )}
        {!deck.account_id && !sharedFrom && <Button onPress={handleEditPress}>Edit Deck</Button>}

        <Text>Favorited</Text>
        <CheckBox checked={favorite} />

        {displayShare && (
          <BottomSheet
            onClose={handleClose}
            enableDynamicSizing={false}
            index={1}
            enablePanDownToClose={true}
            snapPoints={[800, 800]}
            ref={bottomSheetRef}
          >
            <BottomSheetView style={styles.contentContainer}>
              {users.map((user: any) => (
                <View key={user.id}>
                  <CheckBox
                    checked={selectedUsers.includes(user.id)}
                    onPress={() => handleShareChecked(user.id)}
                    // Use ThemeProvider to make change for all checkbox
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    checkedColor="red"
                  />
                  <Text key={user.id}>{user.email}</Text>
                </View>
              ))}
              <Button onPress={handleShare}>Share with selected users</Button>
            </BottomSheetView>
          </BottomSheet>
        )}
      </GestureHandlerRootView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center'
  }
})
