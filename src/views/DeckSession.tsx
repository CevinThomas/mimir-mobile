import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {
  archiveCard,
  deleteDeckSession,
  getCardBatch,
  getDeckSession,
  resetDeckSession
} from '../api/DeckSessionApi'
import { Button } from '@rneui/themed'
import { useNavigation, CommonActions } from '@react-navigation/native'

export default function DeckSession(props: {
  route: { params: { deck: { name: string; id: string } } }
}) {
  const [cards, setCards] = useState([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [currentCard, setCurrentCard] = useState()
  const [initLoaded, setInitLoaded] = useState(false)
  const [answeredState, setAnsweredState] = useState(2)
  const [answeredChoiceId, setAnsweredId] = useState()
  const [deckSessionId, setDeckSessionId] = useState()

  const navigation = useNavigation()

  useEffect(() => {
    const sessionInit = async () => {
      const response = await getDeckSession(props.route.params.deck.id)
      setDeckSessionId(response.deck_session.id)
      setCards(response.cards)

      setCurrentCard(response.cards[currentCardIndex])
      setInitLoaded(true)
    }
    sessionInit()
  }, [])

  const displayCard = () => {
    if (!currentCard) return
    return (
      <View>
        <Text>{currentCard.name}</Text>
        <View>
          {currentCard.choices.map((choice: any) => {
            const answeredChoice = answeredChoiceId === choice.id
            return (
              <Button
                key={choice.id}
                disabled={(answeredState === 1 || answeredState === 0) && !answeredChoice}
                color={
                  answeredState === 0 && answeredChoice
                    ? 'green'
                    : answeredState === 1 && answeredChoice
                      ? 'red'
                      : 'primary'
                }
                onPress={() => answerCard(choice)}
              >
                <Text>{choice.name}</Text>
              </Button>
            )
          })}
        </View>
      </View>
    )
  }

  const answerCard = (choice: any) => {
    setAnsweredId(choice.id)
    if (choice.correct) {
      setAnsweredState(0)
      setTimeout(async () => {
        if (currentCardIndex === cards.length - 1) {
          await fetchNextCardBatch()
          setCurrentCardIndex(0)
          setAnsweredState(2)
          return
        }
        setCurrentCardIndex(currentCardIndex + 1)
        setAnsweredState(2)
      }, 1000)
    } else {
      setAnsweredState(1)
    }
  }

  const nextCard = async () => {
    if (currentCardIndex === cards.length - 1) {
      await fetchNextCardBatch()
      setCurrentCardIndex(0)
      setAnsweredState(2)
      return
    }
    setAnsweredState(2)
    setCurrentCardIndex(currentCardIndex + 1)
  }

  const displayExplanation = () => {
    if (answeredState === 1) {
      return (
        <View>
          <Text>{currentCard.explanation}</Text>
        </View>
      )
    }
  }

  const archiveCardPress = async () => {
    const response = await archiveCard(deckSessionId, currentCard.id)
    if (currentCardIndex === cards.length - 1) {
      await fetchNextCardBatch()
      return
    }
    setCards(cards.filter((card: any) => card.id !== currentCard.id))
    setCurrentCard(cards[currentCardIndex + 1])
  }

  const fetchNextCardBatch = async () => {
    const response = await getCardBatch(deckSessionId)
    console.log(response.cards)
    setCards(response.cards)
    setCurrentCard(response.cards[0])
    setCurrentCardIndex(0)
  }

  const resetSession = async () => {
    await resetDeckSession(deckSessionId)
    fetchNextCardBatch()
  }

  const deleteSession = async () => {
    await deleteDeckSession(deckSessionId)
    navigation.dispatch(
      CommonActions.reset({ index: 1, routes: [{ name: 'Home', params: { screen: 'Decks' } }] })
    )
  }

  useEffect(() => {
    if (!initLoaded) return
    console.log('Setting current card', currentCardIndex, cards)
    setCurrentCard(cards[currentCardIndex])
  }, [currentCardIndex, setInitLoaded])

  return (
    <View style={styles.container}>
      {displayCard()}
      {answeredState === 1 && <Button onPress={nextCard}>Next</Button>}
      {displayExplanation()}
      <Button disabled={cards.length === 1} onPress={archiveCardPress}>
        Archive Card
      </Button>
      <Button onPress={resetSession}>Reset Session</Button>
      <Button onPress={deleteSession}>Delete Session</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  correct: {
    backgroundColor: 'green'
  },
  incorrect: {
    backgroundColor: 'red'
  }
})
