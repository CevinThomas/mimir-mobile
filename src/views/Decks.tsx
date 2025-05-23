import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View, RefreshControl, TouchableOpacity } from 'react-native'
import { getDecks, getSharedDecks, getFavoriteDecks } from '../api/DecksApi'
import { deleteDeckSession, getDeckSessions } from '../api/DeckSessionApi'
import useErrorSnackbar from '../hooks/useErrorSnackbar'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import MainBackground from '../components/MainBackground'
import DeckListItemSwipe from '../components/DeckListItemSwipe'
import NormalText from '../components/Typography/NormalText'
import FilledButton from '../components/Buttons/FilledButton'
import { useStoreContext } from '../context/StoreContext'
import ExpiredDeckModal from '../components/ExpiredDeckModal'
import DeckListItemSkeleton from '../components/Skeletons/DeckListItemSkeleton'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function Decks() {
  const navigation = useNavigation()
  const { state } = useStoreContext()
  const [decks, setDecks] = useState([])
  const [ongoingDecks, setOngoingDecks] = useState([])
  const [completedDecks, setCompletedDecks] = useState([])
  const [expiredDeckSessions, setExpiredDeckSessions] = useState([])
  const [sharedWithMeDecks, setSharedDecks] = useState([])
  const [favoriteDecks, setFavoriteDecks] = useState([])
  const [selectedExpiredDeck, setSelectedExpiredDeck] = useState(null)
  const [isLoadingDecks, setIsLoadingDecks] = useState(true)
  const [isLoadingOngoingDecks, setIsLoadingOngoingDecks] = useState(true)
  const [isLoadingSharedDecks, setIsLoadingSharedDecks] = useState(true)
  const [isLoadingFavoriteDecks, setIsLoadingFavoriteDecks] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
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
    setIsLoadingDecks(true)
    const startTime = Date.now()
    try {
      const decks = await getDecks()
      setDecks(decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch decks')
    } finally {
      setIsLoadingDecks(false)
    }
  }

  const fetchOnGoingDecks = async () => {
    setIsLoadingOngoingDecks(true)
    const startTime = Date.now()
    try {
      const decks = await getDeckSessions()
      if (decks.expired_decks.length > 0) {
        setExpiredDeckSessions(decks.expired_decks)
      }
      setOngoingDecks(decks.ongoing)
      if (decks.completed) {
        setCompletedDecks(decks.completed)
      }
    } catch (error) {
      showError(error.message || 'Failed to fetch ongoing decks')
    } finally {
      setIsLoadingOngoingDecks(false)
    }
  }

  const fetchSharedDecks = async () => {
    setIsLoadingSharedDecks(true)
    const startTime = Date.now()
    try {
      const decks = await getSharedDecks()
      setSharedDecks(decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch shared decks')
    } finally {
      setIsLoadingSharedDecks(false)
    }
  }

  const fetchFavoriteDecks = async () => {
    setIsLoadingFavoriteDecks(true)
    try {
      const decks = await getFavoriteDecks()
      setFavoriteDecks(decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch favorite decks')
    } finally {
      setIsLoadingFavoriteDecks(false)
    }
  }

  const refresh = () => {
    fetchDecks()
    fetchOnGoingDecks()
    fetchSharedDecks()
    fetchFavoriteDecks()
  }

  const onRefresh = () => {
    setRefreshing(true)
    Promise.all([
      fetchDecks(),
      fetchOnGoingDecks(),
      fetchSharedDecks(),
      fetchFavoriteDecks()
    ]).finally(() => {
      setRefreshing(false)
    })
  }

  // Helper function to render skeleton loaders
  const renderSkeletons = (count) => {
    return Array(count)
      .fill(0)
      .map((_, index) => <DeckListItemSkeleton key={`skeleton-${index}`} />)
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <MainBackground noSpace>
      <View style={styles.mainContainer}>
        <View style={styles.privateSettingContainer}>
          <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            {/* Ongoing Decks Section */}
            {isLoadingOngoingDecks && ongoingDecks.length !== 0 ? (
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
                  {renderSkeletons(ongoingDecks.length)}
                </View>
              </View>
            ) : (
              ongoingDecks.length > 0 && (
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
              )
            )}

            {/* Favorites Section */}
            {isLoadingFavoriteDecks && favoriteDecks.length !== 0 ? (
              <View style={styles.onGoingContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10
                  }}
                >
                  <NormalText style={{ fontWeight: 'bold', fontSize: 18 }}>Favorites</NormalText>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
                  {renderSkeletons(favoriteDecks.length)}
                </View>
              </View>
            ) : (
              favoriteDecks.length > 0 && (
                <View style={styles.onGoingContainer}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 10
                    }}
                  >
                    <NormalText style={{ fontWeight: 'bold', fontSize: 18 }}>Favorites</NormalText>
                  </View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
                    {loopDecks(favoriteDecks, false)}
                  </View>
                </View>
              )
            )}

            {/* My Decks Section */}
            {isLoadingDecks && decks.length !== 0 ? (
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
                <View style={styles.myDecksContainer}>{renderSkeletons(decks.length)}</View>
              </View>
            ) : (
              decks.length > 0 && (
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
              )
            )}

            {/* Shared Decks Section */}
            {isLoadingSharedDecks && sharedWithMeDecks.length !== 0 ? (
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
                {renderSkeletons(sharedWithMeDecks.length)}
              </View>
            ) : (
              sharedWithMeDecks.length > 0 && (
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
              )
            )}

            {/* Completed Decks Section */}
            {isLoadingOngoingDecks && completedDecks.length !== 0 ? (
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
                  {renderSkeletons(completedDecks.length)}
                </View>
              </View>
            ) : (
              completedDecks.length > 0 && (
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
              )
            )}

            {/* No Decks Available Message */}
            {!isLoadingDecks &&
              !isLoadingSharedDecks &&
              !isLoadingOngoingDecks &&
              !isLoadingFavoriteDecks &&
              decks.length === 0 &&
              sharedWithMeDecks.length === 0 &&
              ongoingDecks.length === 0 &&
              favoriteDecks.length === 0 &&
              completedDecks.length === 0 && (
                <View style={styles.noDecksContainer}>
                  <NormalText style={styles.noDecksTitle}>No decks available</NormalText>
                  <NormalText style={styles.noDecksMessage}>
                    Create your first deck to start learning! Flashcards are a great way to memorize information and improve your knowledge.
                  </NormalText>
                  <TouchableOpacity 
                    style={styles.floatingButton}
                    onPress={() => navigation.navigate('CreateDeck')}
                  >
                    <Ionicons name="add" size={30} color="white" />
                  </TouchableOpacity>
                </View>
              )}
          </ScrollView>

          {(decks.length > 0 ||
            sharedWithMeDecks.length > 0 ||
            ongoingDecks.length > 0 ||
            favoriteDecks.length > 0 ||
            completedDecks.length > 0) && (
            <TouchableOpacity 
              style={styles.floatingButton}
              onPress={() => navigation.navigate('CreateDeck')}
            >
              <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
          )}
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
  },
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    right: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  noDecksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    height: 300,
    marginTop: 50
  },
  noDecksTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  noDecksMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20
  }
})
