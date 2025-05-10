import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import {
  checkedAccountDecks,
  getAccountDecks,
  getDecks,
  getFeaturedDecks,
  getNewDecks,
  getSharedDecks
} from '../api/DecksApi'
import DeckListItemSkeleton from '../components/Skeletons/DeckListItemSkeleton'
import DeckWithFolderSkeleton from '../components/Skeletons/DeckWithFolderSkeleton'
import { deleteDeckSession, getDeckSessions } from '../api/DeckSessionApi'
import useErrorSnackbar from '../hooks/useErrorSnackbar'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import MainBackground from '../components/MainBackground'
import DeckListItemSwipe from '../components/DeckListItemSwipe'
import NormalText from '../components/Typography/NormalText'
import FilledButton from '../components/Buttons/FilledButton'
import { Tab } from '@rneui/themed'
import DeckWithFolder from '../components/Decks/DeckWithFolder'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useStoreContext } from '../context/StoreContext'
import ExpiredDeckModal from '../components/ExpiredDeckModal'

export default function Decks() {
  const navigation = useNavigation()
  const { state } = useStoreContext()
  const [decks, setDecks] = useState([])
  const [accountDecks, setAccountDecks] = useState([])
  const [ongoingDecks, setOngoingDecks] = useState([])
  const [expiredDeckSessions, setExpiredDeckSessions] = useState([])
  const [sharedWithMeDecks, setSharedDecks] = useState([])
  const [newDecks, setNewDecks] = useState([])
  const [featuredDecks, setFeaturedDecks] = useState([])
  const [selectedDeckSettings, setSelectedDeckSettings] = useState<'private' | 'account'>('private')
  const [index, setIndex] = useState(0)
  const [hideFolders, setHideFolders] = useState(false)
  const [newDecksSinceLastTime, setNewDecksSinceLastTime] = useState(false)
  const [selectedExpiredDeck, setSelectedExpiredDeck] = useState(null)

  // Loading states
  const [loadingDecks, setLoadingDecks] = useState(false)
  const [loadingOngoingDecks, setLoadingOngoingDecks] = useState(false)
  const [loadingSharedDecks, setLoadingSharedDecks] = useState(false)
  const [loadingAccountDecks, setLoadingAccountDecks] = useState(false)
  const [loadingNewDecks, setLoadingNewDecks] = useState(false)
  const [loadingFeaturedDecks, setLoadingFeaturedDecks] = useState(false)
  const { showError, errorSnackbar } = useErrorSnackbar()

  const loopDecks = (decks: any[], ongoingDeck: boolean) => (
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

  const setDeckSettings = async (settings: 'private' | 'account') => {
    // Set the selected deck settings immediately to show the correct tab
    setSelectedDeckSettings(settings)

    if (settings === 'account') {
      // Set loading states to true before fetching data
      setLoadingNewDecks(true)
      setLoadingFeaturedDecks(true)
      setLoadingAccountDecks(true)

      try {
        await checkedAccountDecks()
        fetchNewAccountDecks()
        fetchFeaturedDecks()
        fetchAccountDecks()
        setNewDecksSinceLastTime(false)
      } catch (error) {
        showError(error.message || 'Failed to check account decks')
        // Reset loading states in case of error
        setLoadingNewDecks(false)
        setLoadingFeaturedDecks(false)
        setLoadingAccountDecks(false)
      }
    }

    if (settings === 'private') {
      // Set loading states to true before fetching data
      setLoadingDecks(true)
      setLoadingOngoingDecks(true)
      setLoadingSharedDecks(true)

      fetchDecks()
      fetchOnGoingDecks()
      fetchSharedDecks()
    }
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
    setLoadingDecks(true)
    try {
      const decks = await getDecks()
      setDecks(decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch decks')
    } finally {
      setLoadingDecks(false)
    }
  }

  const fetchOnGoingDecks = async () => {
    setLoadingOngoingDecks(true)
    try {
      const decks = await getDeckSessions()
      if (decks.expired_decks.length > 0) {
        setExpiredDeckSessions(decks.expired_decks)
      }
      setOngoingDecks(decks.ongoing)
    } catch (error) {
      showError(error.message || 'Failed to fetch ongoing decks')
    } finally {
      setLoadingOngoingDecks(false)
    }
  }

  const fetchSharedDecks = async () => {
    setLoadingSharedDecks(true)
    try {
      const decks = await getSharedDecks()
      setSharedDecks(decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch shared decks')
    } finally {
      setLoadingSharedDecks(false)
    }
  }

  const fetchAccountDecks = async () => {
    setLoadingAccountDecks(true)
    try {
      const decks = await getAccountDecks()
      setAccountDecks(decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch account decks')
    } finally {
      setLoadingAccountDecks(false)
    }
  }

  const fetchNewAccountDecks = async () => {
    setLoadingNewDecks(true)
    try {
      const response = await getNewDecks()
      setNewDecksSinceLastTime(response.newly_added_since_last_time)
      setNewDecks(response.decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch new account decks')
    } finally {
      setLoadingNewDecks(false)
    }
  }

  const fetchFeaturedDecks = async () => {
    setLoadingFeaturedDecks(true)
    try {
      const decks = await getFeaturedDecks()
      setFeaturedDecks(decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch featured decks')
    } finally {
      setLoadingFeaturedDecks(false)
    }
  }

  const refresh = () => {
    fetchDecks()
    fetchOnGoingDecks()
    fetchSharedDecks()
    fetchAccountDecks()
    fetchNewAccountDecks()
    fetchFeaturedDecks()
  }

  useEffect(() => {
    setDeckSettings(index === 0 ? 'private' : 'account')
  }, [index])

  useFocusEffect(
    React.useCallback(() => {
      refresh()
    }, [])
  )

  useEffect(() => {
    const accountDecksFolders = accountDecks.map((folder) => folder.folder.name)
    const newAccountDecksFolders = newDecks.map((deck) => deck.folder.name)

    const categories = accountDecksFolders.concat(newAccountDecksFolders)
    const uniqueCategories = [...new Set(categories)]

    if (uniqueCategories.length === 1) {
      if (uniqueCategories[0] === 'Uncategorized') {
        setHideFolders(true)
      } else {
        setHideFolders(false)
      }
      return
    }

    setHideFolders(false)
  }, [newDecks, accountDecks])

  const accountDecksToShow = () => accountDecks.some((deck) => deck.decks.length > 0)
  const newDecksToShow = () => newDecks.length > 0
  const featuredDecksToShow = () => featuredDecks.length > 0

  return (
    <MainBackground noSpace>
      <View style={styles.mainContainer}>
        <View style={styles.settingsContainer}>
          <View style={{ flex: 1 }}>
            <Tab
              indicatorStyle={{ backgroundColor: '#444B56' }}
              value={index}
              onChange={setIndex}
              dense
            >
              <Tab.Item titleStyle={{ fontSize: 16, color: 'white' }} onPress={() => setIndex(0)}>
                Private
              </Tab.Item>
              <Tab.Item
                titleStyle={{ fontSize: 16, color: 'white' }}
                iconRight
                icon={
                  newDecks.length > 0 && newDecksSinceLastTime ? (
                    <Ionicons name="notifications" size={14} color="red" />
                  ) : null
                }
                onPress={() => setIndex(1)}
              >
                {state.account?.name}
              </Tab.Item>
            </Tab>
          </View>
        </View>

        {selectedDeckSettings === 'private' ? (
          <View style={styles.privateSettingContainer}>
            <ScrollView>
              {/* Ongoing Decks Section */}
              {loadingOngoingDecks ? (
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
                    {Array.from({ length: 2 }).map((_, index) => (
                      <DeckListItemSkeleton key={index} />
                    ))}
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

              {/* My Decks Section */}
              {loadingDecks ? (
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
                  <View style={styles.myDecksContainer}>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <DeckListItemSkeleton key={index} />
                    ))}
                  </View>
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

              {/* Shared With Me Section */}
              {loadingSharedDecks ? (
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
                  {Array.from({ length: 2 }).map((_, index) => (
                    <DeckListItemSkeleton key={index} />
                  ))}
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

              {/* No Decks Available Message */}
              {!loadingDecks && 
                !loadingOngoingDecks && 
                !loadingSharedDecks && 
                decks.length === 0 &&
                sharedWithMeDecks.length === 0 &&
                ongoingDecks.length === 0 && (
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
        ) : (
          <View style={styles.accountSettingContainer}>
            {!loadingFeaturedDecks && 
             !loadingNewDecks && 
             !loadingAccountDecks && 
             !accountDecksToShow() && 
             !newDecksToShow() && 
             !featuredDecksToShow() ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <NormalText style={{ fontSize: 18 }}>No decks available</NormalText>
              </View>
            ) : (
              <View style={styles.accountDecks}>
                <ScrollView>
                  {/* Featured Decks Section */}
                  {loadingFeaturedDecks ? (
                    <View style={{ marginBottom: 40 }}>
                      <NormalText style={{ fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>
                        Featured decks
                      </NormalText>
                      {Array.from({ length: 2 }).map((_, index) => (
                        <DeckListItemSkeleton key={index} />
                      ))}
                    </View>
                  ) : (
                    featuredDecks.length > 0 && (
                      <View style={{ marginBottom: 40 }}>
                        <NormalText style={{ fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>
                          Featured decks
                        </NormalText>
                        {featuredDecks.map((deck) => (
                          <DeckListItemSwipe key={deck.id} deck={deck} isFeatured={true} />
                        ))}
                      </View>
                    )
                  )}

                  {/* New Decks Section */}
                  {loadingNewDecks ? (
                    <View style={{ marginBottom: 30 }}>
                      <DeckWithFolderSkeleton numberOfDecks={2} hideFolder={hideFolders} />
                    </View>
                  ) : (
                    newDecks.length > 0 && (
                      <View style={{ marginBottom: 30 }}>
                        {newDecks.map((deck) => {
                          return (
                            <View style={{ marginBottom: 40 }} key={deck.folder.id}>
                              <DeckWithFolder
                                deck={deck}
                                hideFolder={hideFolders}
                                onViewedPress={() => refresh()}
                                isNew={true}
                              />
                            </View>
                          )
                        })}
                      </View>
                    )
                  )}

                  {/* Account Decks Section */}
                  {loadingAccountDecks ? (
                    <DeckWithFolderSkeleton numberOfDecks={3} hideFolder={hideFolders} />
                  ) : (
                    accountDecks.map((folder) => {
                      return (
                        folder.decks.length > 0 && (
                          <View style={{ marginBottom: 40 }} key={folder.folder.id}>
                            <DeckWithFolder deck={folder} hideFolder={hideFolders} />
                          </View>
                        )
                      )
                    })
                  )}
                </ScrollView>
              </View>
            )}
          </View>
        )}
      </View>
      {errorSnackbar()}
    </MainBackground>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  settingsContainer: {
    flex: 1
  },
  onGoingContainer: {
    flex: 2,
    marginBottom: 20
  },
  privateSettingContainer: {
    flex: 8
  },
  myDecksContainer: {
    marginBottom: 10
  },
  accountSettingContainer: {
    flex: 8
  },
  createDeckContainer: {
    justifyContent: 'flex-end',
    marginVertical: 5
  },
  accountDecks: {
    flex: 8
  }
})
