import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { getAccountDecks, getDecks, getSharedDecks } from '../api/DecksApi'
import { deleteDeckSession, getDeckSessions } from '../api/DeckSessionApi'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useUserContext } from '../context/UserContext'
import MainBackground from '../components/MainBackground'
import DeckListItem from '../components/DeckListItem'
import NormalText from '../components/Typography/NormalText'
import InvisibleButton from '../components/Buttons/InvisibleButton'
import FilledButton from '../components/Buttons/FilledButton'
import DeleteButtonAnimated from '../components/DeleteButtonAnimated'
import { Tab } from '@rneui/themed'
import ClickButton from '../components/Buttons/ClickButton'

export default function Decks() {
  const navigation = useNavigation()
  const { state: userState, dispatch: userDispatch } = useUserContext()
  const [decks, setDecks] = useState([])
  const [accountDecks, setAccountDecks] = useState([])
  const [ongoingDecks, setOngoingDecks] = useState([])
  const [sharedWithMeDecks, setSharedDecks] = useState([])
  const [selectedDeckSettings, setSelectedDeckSettings] = useState<'private' | 'account'>('private')
  const [index, setIndex] = useState(0)
  const loopDecks = (decks: any[]) => {
    return (
      <ScrollView>
        {decks.slice(0, 5).map((deck) => {
          return <DeckListItem key={deck.id} deck={deck} />
        })}
      </ScrollView>
    )
  }

  const setDeckSettings = (settings: 'private' | 'account') => {
    setSelectedDeckSettings(settings)
  }

  const deleteSession = async (deckSessionId: number) => {
    await deleteDeckSession(deckSessionId)
    fetchOnGoingDecks()
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

  useEffect(() => {
    if (index === 0) {
      setDeckSettings('private')
    } else {
      setDeckSettings('account')
    }
  }, [index])

  useFocusEffect(
    React.useCallback(() => {
      refresh()
    }, [])
  )

  const decksToShow = () => {
    return accountDecks.some((deck) => {
      if (deck.decks.length > 0) {
        return true
      }
    })
  }

  return (
    <MainBackground noSpace>
      <View style={[styles.mainContainer]}>
        <View style={styles.settingsContainer}>
          <View style={{ flex: 1 }}>
            <Tab
              indicatorStyle={{ backgroundColor: '#444B56' }}
              value={index}
              onChange={setIndex}
              dense
            >
              <Tab.Item
                titleStyle={{ fontSize: 16, color: 'white' }}
                onPress={() => {
                  setIndex(0)
                }}
              >
                Private decks
              </Tab.Item>
              <Tab.Item
                titleStyle={{ fontSize: 16, color: 'white' }}
                onPress={() => {
                  setIndex(1)
                }}
              >
                {userState.account?.name}
              </Tab.Item>
            </Tab>
          </View>
        </View>

        {selectedDeckSettings === 'private' ? (
          <View style={styles.privateSettingContainer}>
            {ongoingDecks.length > 0 && (
              <View style={styles.onGoingContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <NormalText style={{ fontWeight: 'bold', fontSize: 18 }}>Ongoing</NormalText>
                  <InvisibleButton
                    onPress={() => navigation.navigate('ViewAllDecks', { method: 'ongoingDecks' })}
                  >
                    view all
                  </InvisibleButton>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
                  {ongoingDecks.slice(0, 2).map((deck, index) => {
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

            {decks.length === 0 && sharedWithMeDecks.length === 0 && ongoingDecks.length === 0 && (
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
            {!decksToShow() ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <NormalText style={{ fontSize: 18 }}>No decks available</NormalText>
              </View>
            ) : (
              <View style={styles.accountDecks}>
                {accountDecks.map((deck) => {
                  if (deck.decks.length === 0) return
                  //TODO: MAKE THIS INTO A COMPONENT SAME INSIDE VIEW ALL DECKS. Call it RenderAccountDecks or
                  // something, or Render decks with categories
                  return (
                    <View>
                      <View style={{ marginBottom: 10 }}>
                        <NormalText style={{ fontWeight: 'bold', fontSize: 18 }}>
                          {deck.folder.name}
                        </NormalText>
                      </View>
                      {deck.decks.map((deck) => {
                        return (
                          <View key={deck.id} style={{ height: 60 }}>
                            <ClickButton onPress={() => navigation.navigate('Deck', { deck })}>
                              {deck.name}
                            </ClickButton>
                          </View>
                        )
                      })}
                    </View>
                  )
                })}

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <InvisibleButton
                    onPress={() => navigation.navigate('ViewAllDecks', { method: 'accountDecks' })}
                  >
                    View all
                  </InvisibleButton>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </MainBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainContainer: {
    flex: 1
  },
  settingsContainer: {
    flex: 1
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
