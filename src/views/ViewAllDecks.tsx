import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { getDecks, getSharedDecks } from '../api/DecksApi'
import { getDeckSessions } from '../api/DeckSessionApi'
import { useNavigation } from '@react-navigation/native'
import NormalText from '../components/Typography/NormalText'
import MainBackground from '../components/MainBackground'
import DeckListItem from '../components/DeckListItem'
import ClickButton from '../components/Buttons/ClickButton'

export default function ViewAllDecks(props: { route: { params: { method: string } } }) {
  const [decks, setDecks] = useState([])
  const navigation = useNavigation()
  useEffect(() => {
    fetchInit()
  }, [])

  const fetchInit = async () => {
    if (props.route.params.method === 'myDecks') {
      await fetchDecks()
    } else if (props.route.params.method === 'ongoingDecks') {
      await fetchOnGoingDecks()
    } else if (props.route.params.method === 'sharedDecks') {
      await fetchSharedDecks()
    }
  }

  const fetchDecks = async () => {
    const decks = await getDecks()
    setDecks(decks)
  }

  const fetchOnGoingDecks = async () => {
    const decks = await getDeckSessions()
    setDecks(decks)
  }

  const fetchSharedDecks = async () => {
    const decks = await getSharedDecks()
    setDecks(decks)
  }

  const loopDecks = (decks: any[]) => {
    if (props.route.params.method === 'ongoingDecks') {
      return (
        <View style={{ padding: 10 }}>
          <View style={{ marginBottom: 20 }}>
            <NormalText style={{ fontWeight: 'bold', fontSize: 24 }}>Ongoing Decks</NormalText>
          </View>
          {decks.map((deck) => {
            return (
              <View style={{ height: 60 }} key={deck.deck.id}>
                <ClickButton onPress={() => navigation.navigate('DeckSession', { deck })}>
                  {deck.deck.name}
                </ClickButton>
              </View>
            )
          })}
        </View>
      )
    }

    return (
      <View style={{ padding: 10 }}>
        <View style={{ marginBottom: 20 }}>
          <NormalText style={{ fontWeight: 'bold', fontSize: 24 }}>
            {props.route.params.method === 'myDecks' ? 'My' + ' decks' : 'Shared decks'}
          </NormalText>
        </View>
        {decks.map((deck) => {
          return (
            <View key={deck.folder.id}>
              <DeckListItem deck={deck} />
            </View>
          )
        })}
      </View>
    )
  }
  return <MainBackground>{loopDecks(decks)}</MainBackground>
}
