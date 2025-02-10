import React, { useEffect, useState } from 'react'
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button } from '@rneui/themed'
import { myDecks, ongoingDecks } from '../deckData'
import DeckList from '../components/DeckList'
import { getAccountDecks, getDecks, getSharedDecks } from '../api/DecksApi'
import { getDeckSessions } from '../api/DeckSessionApi'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function Decks() {
  const navigation = useNavigation()
  const [decks, setDecks] = useState([])
  const [accountDecks, setAccountDecks] = useState([])
  const [ongoingDecks, setOngoingDecks] = useState([])
  const [sharedWithMeDecks, setSharedDecks] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [selectedDeckSettings, setSelectedDeckSettings] = useState<'private' | 'account'>('private')
  const loopDecks = (decks: any[]) => {
    return decks.map((deck) => {
      return <DeckList key={deck.id} deck={deck} />
    })
  }

  const setDeckSettings = (settings: 'private' | 'account') => {
    setSelectedDeckSettings(settings)
  }

  const fetchDecks = async () => {
    const decks = await getDecks()
    setDecks(decks)
  }

  const fetchOnGoingDecks = async () => {
    const decks = await getDeckSessions()
    setOngoingDecks(decks)
  }

  const fetchSharedDecks = async () => {
    const decks = await getSharedDecks()
    setSharedDecks(decks)
  }

  const fetchAccountDecks = async () => {
    const decks = await getAccountDecks()
    console.log(decks)
    setAccountDecks(decks)
  }

  const refresh = () => {
    fetchDecks()
    fetchOnGoingDecks()
    fetchSharedDecks()
    fetchAccountDecks()
  }

  useEffect(() => {
    fetchDecks()
    fetchOnGoingDecks()
    fetchSharedDecks()
    fetchAccountDecks()
  }, [])

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          currentContainerStyle={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        >
          <View style={styles.container}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Button onPress={() => setDeckSettings('private')}>Private Decks</Button>
              <Button onPress={() => setDeckSettings('account')}>Maia Decks</Button>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>Ongoing</Text>
                <Button
                  onPress={() => navigation.navigate('ViewAllDecks', { method: 'ongoingDecks' })}
                >
                  View all
                </Button>
              </View>

              {ongoingDecks.map((deck) => {
                return (
                  <Button
                    key={deck.id}
                    onPress={() => navigation.navigate('DeckSession', { deck: deck })}
                  >
                    {deck.id}
                  </Button>
                )
              })}
            </View>

            {selectedDeckSettings === 'private' ? (
              <View>
                <View style={{ flex: 2 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>My decks</Text>
                    <Button
                      onPress={() => navigation.navigate('ViewAllDecks', { method: 'myDecks' })}
                    >
                      View all
                    </Button>
                  </View>

                  {loopDecks(decks)}
                </View>
                <View style={{ flex: 2 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>Shared with me</Text>
                    <Button
                      onPress={() => navigation.navigate('ViewAllDecks', { method: 'sharedDecks' })}
                    >
                      View all
                    </Button>
                  </View>

                  {loopDecks(sharedWithMeDecks)}
                </View>
                <View style={{ flex: 1 }}>
                  <Button onPress={() => navigation.navigate('CreateDeck')}>Create deck</Button>
                </View>
              </View>
            ) : (
              <View>
                <View style={{ flex: 2 }}>
                  <Text>Account decks</Text>
                  {loopDecks(accountDecks)}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
