import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native'
import { getAccountDecks, getDecks, getSharedDecks } from '../api/DecksApi'
import { deleteDeckSession, getDeckSessions } from '../api/DeckSessionApi'
import { useNavigation } from '@react-navigation/native'
import { useUserContext } from '../context/UserContext'
import MainBackground from '../components/MainBackground'
import DeckListItem from '../components/DeckListItem'
import NormalText from '../components/Typography/NormalText'
import TabSelectButton from '../components/Buttons/TabSelectButton'
import InvisibleButton from '../components/Buttons/InvisibleButton'
import FilledButton from '../components/Buttons/FilledButton'
import DeleteButtonAnimated from '../components/DeleteButtonAnimated'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

export default function Decks() {
  const navigation = useNavigation()
  const { state: userState, dispatch: userDispatch } = useUserContext()
  const [decks, setDecks] = useState([])
  const [accountDecks, setAccountDecks] = useState([])
  const [ongoingDecks, setOngoingDecks] = useState([])
  const [sharedWithMeDecks, setSharedDecks] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [selectedDeckSettings, setSelectedDeckSettings] = useState<'private' | 'account'>('private')
  const loopDecks = (decks: any[]) => {
    return decks.map((deck) => {
      return <DeckListItem key={deck.id} deck={deck} />
    })
  }

  const animationWidth = useSharedValue(1)
  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1)
  }
  const animationStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${animationWidth.value}%`, config)
    }
  })

  const setDeckSettings = (settings: 'private' | 'account') => {
    setSelectedDeckSettings(settings)
  }

  const deleteSession = async (deckSessionId: number) => {
    await deleteDeckSession(deckSessionId)
    fetchOnGoingDecks()
  }

  const fetchDecks = async () => {
    const decks = await getDecks()
    const firstFiveDecks = decks.slice(0, 5)
    setDecks(firstFiveDecks)
  }

  const fetchOnGoingDecks = async () => {
    const decks = await getDeckSessions()
    const firstTwoDecks = decks.slice(0, 2)
    setOngoingDecks(firstTwoDecks)
  }

  const fetchSharedDecks = async () => {
    const decks = await getSharedDecks()
    const firstFiveDecks = decks.slice(0, 5)
    setSharedDecks(firstFiveDecks)
  }

  const fetchAccountDecks = async () => {
    const decks = await getAccountDecks()
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
    <MainBackground>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <View style={[styles.mainContainer]}>
          <View style={styles.settingsContainer}>
            <View style={{ flex: 1 }}>
              <TabSelectButton
                onPress={() => setDeckSettings('private')}
                selected={selectedDeckSettings === 'private'}
              >
                Private
              </TabSelectButton>
            </View>
            <View style={{ flex: 1 }}>
              <TabSelectButton
                onPress={() => setDeckSettings('account')}
                selected={selectedDeckSettings === 'account'}
              >
                {userState.account?.name}
              </TabSelectButton>
            </View>
          </View>

          {selectedDeckSettings === 'private' ? (
            <View style={styles.privateSettingContainer}>
              {ongoingDecks.length > 0 && (
                <View style={styles.onGoingContainer}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <NormalText style={{ fontWeight: 'bold', fontSize: 18 }}>Ongoing</NormalText>
                    <InvisibleButton
                      onPress={() =>
                        navigation.navigate('ViewAllDecks', { method: 'ongoingDecks' })
                      }
                    >
                      view all
                    </InvisibleButton>
                  </View>

                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
                    {ongoingDecks.map((deck, index) => {
                      return (
                        <View
                          key={deck.deck.id}
                          style={[
                            {
                              flex: 1
                            }
                          ]}
                        >
                          <DeleteButtonAnimated
                            onPress={() => navigation.navigate('DeckSession', { deck })}
                            onDelete={() => {
                              deleteSession(deck.id)
                            }}
                          >
                            {deck.deck.name}
                          </DeleteButtonAnimated>
                        </View>
                      )
                    })}
                  </View>
                </View>
              )}

              {decks.length > 0 && (
                <View style={styles.myDecksContainer}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <NormalText style={{ fontWeight: 'bold', fontSize: 18 }}>My decks</NormalText>
                    <InvisibleButton
                      onPress={() => navigation.navigate('ViewAllDecks', { method: 'myDecks' })}
                    >
                      view all
                    </InvisibleButton>
                  </View>

                  {loopDecks(decks)}
                </View>
              )}

              <Animated.View style={animationStyle} />

              {sharedWithMeDecks.length > 0 && (
                <View style={styles.sharedDecksContainer}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <NormalText style={{ fontWeight: 'bold', fontSize: 18 }}>
                      Shared with me
                    </NormalText>
                    <InvisibleButton
                      onPress={() => navigation.navigate('ViewAllDecks', { method: 'sharedDecks' })}
                    >
                      view all
                    </InvisibleButton>
                  </View>

                  {loopDecks(sharedWithMeDecks)}
                </View>
              )}

              {decks.length === 0 &&
                sharedWithMeDecks.length === 0 &&
                ongoingDecks.length === 0 && (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <NormalText style={{ fontSize: 18 }}>No decks available</NormalText>
                  </View>
                )}

              <View style={styles.createDeckContainer}>
                <FilledButton onPress={() => navigation.navigate('CreateDeck')}>
                  Create new deck
                </FilledButton>
              </View>
            </View>
          ) : (
            <View style={styles.accountSettingContainer}>
              {accountDecks.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <NormalText style={{ fontSize: 18 }}>No decks available</NormalText>
                </View>
              ) : (
                <View style={styles.accountDecks}>
                  <NormalText style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>
                    Account decks
                  </NormalText>
                  {loopDecks(accountDecks)}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </MainBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainContainer: {
    flex: 1,
    width: '100%'
  },
  settingsContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  onGoingContainer: {
    flex: 2
  },
  privateSettingContainer: {
    flex: 8
  },
  myDecksContainer: {
    flex: 7
  },
  sharedDecksContainer: {
    flex: 3
  },
  accountSettingContainer: {
    flex: 8
  },
  createDeckContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },

  accountDecks: {
    flex: 8
  },

  text: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  scrollView: {
    flex: 1,
    padding: 10,

    alignItems: 'center',
    justifyContent: 'center'
  }
})
