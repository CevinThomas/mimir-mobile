import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
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

export default function Account() {
  const [accountDecks, setAccountDecks] = useState([])
  const [newDecks, setNewDecks] = useState([])
  const [featuredDecks, setFeaturedDecks] = useState([])
  const [hideFolders, setHideFolders] = useState(false)
  const [newDecksSinceLastTime, setNewDecksSinceLastTime] = useState(false)
  const { showError, errorSnackbar } = useErrorSnackbar()

  const fetchAccountDecks = async () => {
    try {
      const decks = await getAccountDecks()
      setAccountDecks(decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch account decks')
    }
  }

  const fetchNewAccountDecks = async () => {
    try {
      const response = await getNewDecks()
      setNewDecksSinceLastTime(response.newly_added_since_last_time)
      setNewDecks(response.decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch new account decks')
    }
  }

  const fetchFeaturedDecks = async () => {
    try {
      const decks = await getFeaturedDecks()
      setFeaturedDecks(decks)
    } catch (error) {
      showError(error.message || 'Failed to fetch featured decks')
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
        <View style={styles.accountSettingContainer}>
          {!accountDecksToShow() && !newDecksToShow() && !featuredDecksToShow() ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <NormalText style={{ fontSize: 18 }}>No decks available</NormalText>
            </View>
          ) : (
            <View style={styles.accountDecks}>
              <ScrollView>
                {featuredDecks.length > 0 && (
                  <View style={{ marginBottom: 40 }}>
                    <NormalText style={{ fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>
                      Featured decks
                    </NormalText>
                    {featuredDecks.map((deck) => (
                      <DeckListItemSwipe key={deck.id} deck={deck} isFeatured={true} />
                    ))}
                  </View>
                )}
                {newDecks.length > 0 && (
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
                )}
                {accountDecks.map((folder) => {
                  return (
                    folder.decks.length > 0 && (
                      <View style={{ marginBottom: 40 }} key={folder.folder.id}>
                        <DeckWithFolder deck={folder} hideFolder={hideFolders} />
                      </View>
                    )
                  )
                })}
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