import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native'
import {
  checkedAccountDecks,
  getAccountDecks,
  getFeaturedDecks,
  getNewDecks
} from '../api/DecksApi'
import useErrorSnackbar from '../hooks/useErrorSnackbar'
import { useFocusEffect } from '@react-navigation/native'
import MainBackground from '../components/MainBackground'
import DeckListItemSwipe from '../components/DeckListItemSwipe'
import NormalText from '../components/Typography/NormalText'
import DeckWithFolder from '../components/Decks/DeckWithFolder'
import DeckListItemSkeleton from '../components/Skeletons/DeckListItemSkeleton'

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
  const { showError, errorSnackbar } = useErrorSnackbar()

  const fetchAccountDecks = async () => {
    setIsLoadingAccountDecks(true)
    const startTime = Date.now();
    try {
      const decks = await getAccountDecks()
      setAccountDecks(decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch account decks')
    } finally {
      // Ensure loading state is shown for at least 1 second
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 1000) {
        setTimeout(() => {
          setIsLoadingAccountDecks(false)
        }, 1000 - elapsedTime);
      } else {
        setIsLoadingAccountDecks(false)
      }
    }
  }

  const fetchNewAccountDecks = async () => {
    setIsLoadingNewDecks(true)
    const startTime = Date.now();
    try {
      const response = await getNewDecks()
      setNewDecksSinceLastTime(response.newly_added_since_last_time)
      setNewDecks(response.decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch new account decks')
    } finally {
      // Ensure loading state is shown for at least 1 second
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 1000) {
        setTimeout(() => {
          setIsLoadingNewDecks(false)
        }, 1000 - elapsedTime);
      } else {
        setIsLoadingNewDecks(false)
      }
    }
  }

  const fetchFeaturedDecks = async () => {
    setIsLoadingFeaturedDecks(true)
    const startTime = Date.now();
    try {
      const decks = await getFeaturedDecks()
      setFeaturedDecks(decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch featured decks')
    } finally {
      // Ensure loading state is shown for at least 1 second
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 1000) {
        setTimeout(() => {
          setIsLoadingFeaturedDecks(false)
        }, 1000 - elapsedTime);
      } else {
        setIsLoadingFeaturedDecks(false)
      }
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
      await Promise.all([
        fetchNewAccountDecks(),
        fetchFeaturedDecks(),
        fetchAccountDecks()
      ])
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

  // Helper function to render skeleton loaders
  const renderSkeletons = (count = 1) => {
    // Ensure at least 1 skeleton is shown
    const skeletonCount = Math.max(1, count);
    return Array(skeletonCount)
      .fill(0)
      .map((_, index) => <DeckListItemSkeleton key={`skeleton-${index}`} />)
  }

  return (
    <MainBackground noSpace>
      <View style={styles.mainContainer}>
        <View style={styles.accountSettingContainer}>
          {!accountDecksToShow() && !newDecksToShow() && !featuredDecksToShow() && 
           !isLoadingAccountDecks && !isLoadingNewDecks && !isLoadingFeaturedDecks ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <NormalText style={{ fontSize: 18 }}>No decks available</NormalText>
            </View>
          ) : (
            <View style={styles.accountDecks}>
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }>
                {/* Featured Decks Section */}
                {(isLoadingFeaturedDecks || featuredDecks.length > 0) && (
                  <View style={{ marginBottom: 40 }}>
                    <NormalText style={{ fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>
                      Featured decks
                    </NormalText>
                    {isLoadingFeaturedDecks ? (
                      renderSkeletons(featuredDecks.length)
                    ) : (
                      featuredDecks.map((deck) => (
                        <DeckListItemSwipe key={deck.id} deck={deck} isFeatured={true} />
                      ))
                    )}
                  </View>
                )}

                {/* New Decks Section */}
                {(isLoadingNewDecks || newDecks.length > 0) && (
                  <View style={{ marginBottom: 30 }}>
                    {isLoadingNewDecks ? (
                      renderSkeletons(newDecks.length)
                    ) : (
                      newDecks.map((deck) => (
                        <View style={{ marginBottom: 40 }} key={deck.folder.id}>
                          <DeckWithFolder
                            deck={deck}
                            hideFolder={hideFolders}
                            onViewedPress={() => refresh()}
                            isNew={true}
                          />
                        </View>
                      ))
                    )}
                  </View>
                )}

                {/* Account Decks Section */}
                {isLoadingAccountDecks ? (
                  renderSkeletons(accountDecks.reduce((total, folder) => total + folder.decks.length, 0))
                ) : (
                  accountDecks.map((folder) => (
                    folder.decks.length > 0 && (
                      <View style={{ marginBottom: 40 }} key={folder.folder.id}>
                        <DeckWithFolder deck={folder} hideFolder={hideFolders} />
                      </View>
                    )
                  ))
                )}
              </ScrollView>
            </View>
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
  accountSettingContainer: {
    flex: 1
  },
  accountDecks: {
    flex: 1
  }
})
