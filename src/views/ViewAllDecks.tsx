import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { getAccountDecks, getDecks, getSharedDecks } from '../api/DecksApi'
import { getDeckSessions } from '../api/DeckSessionApi'
import { useNavigation } from '@react-navigation/native'
import NormalText from '../components/Typography/NormalText'
import MainBackground from '../components/MainBackground'
import DeckListItem from '../components/DeckListItem'
import ClickButton from '../components/Buttons/ClickButton'
import Header from '../components/Header'

export default function ViewAllDecks(props: { route: { params: { method: string } } }) {
  const [decks, setDecks] = useState([])
  const navigation = useNavigation()
  useEffect(() => {
    fetchInit()
  }, [])

  const fetchInit = async () => {
    if (props.route.params.method === 'myDecks') {
      return await fetchDecks()
    }
    if (props.route.params.method === 'ongoingDecks') {
      return await fetchOnGoingDecks()
    }
    if (props.route.params.method === 'sharedDecks') {
      return await fetchSharedDecks()
    }
    if (props.route.params.method === 'accountDecks') {
      return await fetchAccountDecks()
    }
  }

  const fetchAccountDecks = async () => {
    const decks = await getAccountDecks()
    setDecks(decks)
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
              <View style={{ height: 60 }} key={deck.id}>
                <ClickButton onPress={() => navigation.navigate('DeckSession', { deck })}>
                  {deck.deck.name}
                </ClickButton>
              </View>
            )
          })}
        </View>
      )
    }

    if (props.route.params.method === 'accountDecks') {
      return (
        <View>
          {decks.map((deck) => {
            if (deck.decks.length === 0) return
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
        </View>
      )
    }

    return (
      <View>
        <View style={{ marginBottom: 20 }}>
          <NormalText style={{ fontWeight: 'bold', fontSize: 24 }}>
            {props.route.params.method === 'myDecks'
              ? 'My' + ' decks'
              : props.route.params.method === 'accountDecks'
                ? 'Account decks'
                : 'Shared' + ' decks'}
          </NormalText>
        </View>
        {decks.map((deck) => {
          return (
            <View key={deck.id}>
              <DeckListItem deck={deck} />
            </View>
          )
        })}
      </View>
    )
  }
  return (
    <MainBackground>
      <Header />
      {loopDecks(decks)}
    </MainBackground>
  )
}
