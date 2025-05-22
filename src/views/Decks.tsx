import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import {
  getDecks,
  getSharedDecks
} from '../api/DecksApi'
import { deleteDeckSession, getDeckSessions } from '../api/DeckSessionApi'
import useErrorSnackbar from '../hooks/useErrorSnackbar'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import MainBackground from '../components/MainBackground'
import DeckListItemSwipe from '../components/DeckListItemSwipe'
import NormalText from '../components/Typography/NormalText'
import FilledButton from '../components/Buttons/FilledButton'
import { useStoreContext } from '../context/StoreContext'
import ExpiredDeckModal from '../components/ExpiredDeckModal'

export default function Decks() {
  const navigation = useNavigation()
  const { state } = useStoreContext()
  const [decks, setDecks] = useState([])
  const [ongoingDecks, setOngoingDecks] = useState([])
  const [completedDecks, setCompletedDecks] = useState([])
  const [expiredDeckSessions, setExpiredDeckSessions] = useState([])
  const [sharedWithMeDecks, setSharedDecks] = useState([])
  const [selectedExpiredDeck, setSelectedExpiredDeck] = useState(null)
  const { showError, errorSnackbar } = useErrorSnackbar()

  const loopDecks = (decks: any[], ongoingDeck: boolean, completed: boolean = false) => (
    <ScrollView>
      {decks.map((deck) => {
        let deckHasExpired = false
        if (ongoingDeck) {
          deckHasExpired = expiredDeckSessions.some((expiredDeck) => expiredDeck.id === deck.id)
        }
        return (
          <View key={deck.id}>
            {deckHasExpired && (
              <NormalText
                onPress={() => setSelectedExpiredDeck(deck)}
                style={{ fontSize: 18, marginBottom: 10 }}
              >
                This deck has expired
              </NormalText>
            )}
            <DeckListItemSwipe
              deck={deck}
              ongoingDeck={ongoingDeck}
              completed={completed}
              onDelete={ongoingDeck ? deleteSession : undefined}
            />
          </View>
        )
      })}
    </ScrollView>
  )

  const hideExpiredDeckModal = () => {
    setSelectedExpiredDeck(null)
  }


  const deleteSession = async (deckSessionId: number) => {
    try {
      await deleteDeckSession(deckSessionId)
      fetchOnGoingDecks()
    } catch (error) {
      showError(error.message || 'Failed to delete session')
    }
  }

  const fetchDecks = async () => {
    try {
      const decks = await getDecks()
      setDecks(decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch decks')
    }
  }

  const fetchOnGoingDecks = async () => {
    try {
      const decks = await getDeckSessions()
      if (decks.expired_decks.length > 0) {
        setExpiredDeckSessions(decks.expired_decks)
      }
      console.log(decks.ongoing)
      setOngoingDecks(decks.ongoing)
      if (decks.completed) {
        console.log(decks.completed)
        setCompletedDecks(decks.completed)
      }
    } catch (error) {
      showError(error.message || 'Failed to fetch ongoing decks')
    }
  }

  const fetchSharedDecks = async () => {
    try {
      const decks = await getSharedDecks()
      setSharedDecks(decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch shared decks')
    }
  }


  const refresh = () => {
    fetchDecks()
    fetchOnGoingDecks()
    fetchSharedDecks()
  }

  useFocusEffect(
    React.useCallback(() => {
      refresh()
    }, [])
  )

  return (
    <MainBackground noSpace>
      <View style={styles.mainContainer}>
        <View style={styles.privateSettingContainer}>
          <ScrollView>
            {ongoingDecks.length > 0 && (
              <View style={styles.onGoingContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10
                  }}
                >
                  <NormalText style={{ fontWeight: 'bold', fontSize: 18 }}>Ongoing</NormalText>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
                  {selectedExpiredDeck && (
                    <ExpiredDeckModal
                      refreshCallback={refresh}
                      deckSession={selectedExpiredDeck}
                      onAction={hideExpiredDeckModal}
                    />
                  )}
                  {loopDecks(ongoingDecks, true)}
                </View>
              </View>
            )}

            {decks.length > 0 && (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10
                  }}
                >
                  <NormalText style={{ fontWeight: 'bold', fontSize: 18 }}>My decks</NormalText>
                </View>
                <View style={styles.myDecksContainer}>{loopDecks(decks, false)}</View>
              </View>
            )}

            {sharedWithMeDecks.length > 0 && (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10
                  }}
                >
                  <NormalText style={{ fontWeight: 'bold', fontSize: 18 }}>
                    Shared with me
                  </NormalText>
                </View>
                {loopDecks(sharedWithMeDecks, false)}
              </View>
            )}

            {completedDecks.length > 0 && (
              <View style={styles.onGoingContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10
                  }}
                >
                  <NormalText style={{ fontWeight: 'bold', fontSize: 18 }}>Completed</NormalText>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
                  {loopDecks(completedDecks, false, true)}
                </View>
              </View>
            )}

            {decks.length === 0 &&
              sharedWithMeDecks.length === 0 &&
              ongoingDecks.length === 0 &&
              completedDecks.length === 0 && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <NormalText style={{ fontSize: 18 }}>No decks available</NormalText>
                </View>
              )}
          </ScrollView>

          <View style={styles.createDeckContainer}>
            <FilledButton onPress={() => navigation.navigate('CreateDeck')}>
              Create new deck
            </FilledButton>
          </View>
        </View>
      </View>
      {errorSnackbar()}
    </MainBackground>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  onGoingContainer: {
    flex: 2,
    marginBottom: 20
  },
  privateSettingContainer: {
    flex: 1
  },
  myDecksContainer: {
    marginBottom: 10
  },
  createDeckContainer: {
    justifyContent: 'flex-end',
    marginVertical: 5
  }
})
