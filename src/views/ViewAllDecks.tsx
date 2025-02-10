import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { getDecks, getSharedDecks } from '../api/DecksApi'
import { getDeckSessions } from '../api/DeckSessionApi'
import DeckList from '../components/DeckList'

export default function ViewAllDecks(props: { route: { params: { method: string } } }) {
  const [decks, setDecks] = useState([])
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
    return decks.map((deck) => {
      return <DeckList key={deck.id} deck={deck} />
    })
  }
  return (
    <View style={{ flex: 1 }}>
      <Text>View All Decks {props.route.params.method}</Text>
      {loopDecks(decks)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  }
})
