import React, { useEffect, useState, useRef } from 'react'
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native'
import {
  checkedAccountDecks,
  getAccountDecks,
  getFeaturedDecks,
  getNewDecks
} from '../api/DecksApi'
import useErrorSnackbar from '../hooks/useErrorSnackbar'
import MainBackground from '../components/MainBackground'
import DeckListItemSwipe from '../components/DeckListItemSwipe'
import NormalText from '../components/Typography/NormalText'
import DeckWithFolder from '../components/Decks/DeckWithFolder'
import DeckListItemSkeleton from '../components/Skeletons/DeckListItemSkeleton'
import LottieView from 'lottie-react-native'

export default function Account() {
  const [accountDecks, setAccountDecks] = useState([])
  const [newDecks, setNewDecks] = useState([])
  const [featuredDecks, setFeaturedDecks] = useState([])
  const [hideFolders, setHideFolders] = useState(false)
  const [newDecksSinceLastTime, setNewDecksSinceLastTime] = useState(false)
  const [isLoadingAccountDecks, setIsLoadingAccountDecks] = useState(true)
  const [isLoadingNewDecks, setIsLoadingNewDecks] = useState(true)
  const [isLoadingFeaturedDecks, setIsLoadingFeaturedDecks] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [forceShowLoading, setForceShowLoading] = useState(false)
  const { showError, errorSnackbar } = useErrorSnackbar()
  const animation = useRef<LottieView>(null)

  const fetchAccountDecks = async () => {
    setIsLoadingAccountDecks(true)
    setForceShowLoading(true)
    const startTime = Date.now()
    try {
      const decks = await getAccountDecks()
      setAccountDecks(decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch account decks')
    } finally {
      // Ensure loading state is shown for at least 1 second
      const elapsedTime = Date.now() - startTime
      if (elapsedTime < 1000) {
        setTimeout(() => {
          setIsLoadingAccountDecks(false)
        }, 1000 - elapsedTime)
      } else {
        setIsLoadingAccountDecks(false)
      }

      // Ensure the loading component is shown for at least 1 second
      setTimeout(
        () => {
          setForceShowLoading(false)
        },
        Math.max(1000, elapsedTime)
      )
    }
  }

  const fetchNewAccountDecks = async () => {
    setIsLoadingNewDecks(true)
    setForceShowLoading(true)
    const startTime = Date.now()
    try {
      const response = await getNewDecks()
      setNewDecksSinceLastTime(response.newly_added_since_last_time)
      setNewDecks(response.decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch new account decks')
    } finally {
      // Ensure loading state is shown for at least 1 second
      const elapsedTime = Date.now() - startTime
      if (elapsedTime < 1000) {
        setTimeout(() => {
          setIsLoadingNewDecks(false)
        }, 1000 - elapsedTime)
      } else {
        setIsLoadingNewDecks(false)
      }

      // Ensure the loading component is shown for at least 1 second
      setTimeout(
        () => {
          setForceShowLoading(false)
        },
        Math.max(1000, elapsedTime)
      )
    }
  }

  const fetchFeaturedDecks = async () => {
    setIsLoadingFeaturedDecks(true)
    setForceShowLoading(true)
    const startTime = Date.now()
    try {
      const decks = await getFeaturedDecks()
      setFeaturedDecks(decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch featured decks')
    } finally {
      // Ensure loading state is shown for at least 1 second
      const elapsedTime = Date.now() - startTime
      if (elapsedTime < 1000) {
        setTimeout(() => {
          setIsLoadingFeaturedDecks(false)
        }, 1000 - elapsedTime)
      } else {
        setIsLoadingFeaturedDecks(false)
      }

      // Ensure the loading component is shown for at least 1 second
      setTimeout(
        () => {
          setForceShowLoading(false)
        },
        Math.max(1000, elapsedTime)
      )
    }
  }

  const refresh = async () => {
    try {
      await checkedAccountDecks()
      fetchNewAccountDecks()
      fetchFeaturedDecks()
      fetchAccountDecks()
      setNewDecksSinceLastTime(false)
    } catch (error) {
      showError(error.message || 'Failed to check account decks')
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await checkedAccountDecks()
      await Promise.all([fetchNewAccountDecks(), fetchFeaturedDecks(), fetchAccountDecks()])
      setNewDecksSinceLastTime(false)
    } catch (error) {
      showError(error.message || 'Failed to refresh decks')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

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

  // Check if any decks are loading
  const isLoading = () =>
    isLoadingAccountDecks ||
    isLoadingNewDecks ||
    isLoadingFeaturedDecks ||
    forceShowLoading ||
    refreshing

  const { height: screenHeight } = Dimensions.get('window')

  return (
    <MainBackground noSpace>
      <View style={styles.mainContainer}>
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {isLoading() ? (
            <View style={[styles.loadingContainer, { height: screenHeight }]}>
              <LottieView
                autoPlay
                ref={animation}
                style={{
                  width: 200,
                  height: 200,
                  backgroundColor: 'transparent'
                }}
                source={require('../../assets/lottie/loading.json')}
              />
            </View>
          ) : !accountDecksToShow() && !newDecksToShow() && !featuredDecksToShow() ? (
            <View style={styles.noDecksContainer}>
              <NormalText style={styles.noDecksTitle}>
                Your organisation has no decks yet
              </NormalText>
              <NormalText style={styles.noDecksMessage}>
                Flashcards are a great way to memorize information and improve your knowledge.
              </NormalText>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {/* Featured Decks Section */}
              {featuredDecks.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                  <NormalText style={{ fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>
                    Featured decks
                  </NormalText>
                  {featuredDecks.map((deck) => (
                    <DeckListItemSwipe key={deck.id} deck={deck} isFeatured={true} />
                  ))}
                </View>
              )}

              {/* New Decks Section */}
              {newDecks.length > 0 &&
                newDecks.map((deck) => (
                  <View style={{ marginBottom: 20 }} key={deck.folder.id}>
                    <DeckWithFolder
                      deck={deck}
                      hideFolder={hideFolders}
                      onViewedPress={() => refresh()}
                      isNew={true}
                    />
                  </View>
                ))}

              {/* Account Decks Section */}
              {accountDecks.length > 0 &&
                accountDecks.map(
                  (folder) =>
                    folder.decks.length > 0 && (
                      <View style={{ marginBottom: 20 }} key={folder.folder.id}>
                        <DeckWithFolder deck={folder} hideFolder={hideFolders} />
                      </View>
                    )
                )}
            </View>
          )}
        </ScrollView>
      </View>

      {errorSnackbar()}
    </MainBackground>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  accountSettingContainer: {
    flex: 1
  },
  accountDecks: {
    flex: 1
  },
  loadingContainer: {
    position: 'absolute',
    top: -50,
    left: 0,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
