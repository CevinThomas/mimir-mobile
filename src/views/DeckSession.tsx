import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
  archiveCard,
  deleteDeckSession,
  getCardBatch,
  getDeckSession,
  resetDeckSession
} from '../api/DeckSessionApi'
import { CommonActions, useNavigation } from '@react-navigation/native'
import useDenyBackButton from '../hooks/useDenyBackButton'
import MainBackground from '../components/MainBackground'
import NormalText from '../components/Typography/NormalText'
import Choice from '../components/Choice'
import MainButton from '../components/Buttons/MainButton'

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

  useDenyBackButton()

  useEffect(() => {
    const sessionInit = async () => {
      const response = await getDeckSession(props.route.params.deck.id)
      console.log(response)

      setDeckSessionId(response.deck_session.id)
      setCards(response.cards)

      setCurrentCard(response.cards[currentCardIndex])
      setInitLoaded(true)
    }
    sessionInit()
  }, [])

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
    setCurrentCard(cards[currentCardIndex])
  }, [currentCardIndex, setInitLoaded])

  const onEndSessionPress = () => {
    navigation.dispatch(
      CommonActions.reset({ index: 1, routes: [{ name: 'Home', params: { screen: 'Decks' } }] })
    )
  }

  const displayCard = () => {
    if (!currentCard) return
    return (
      <View>
        <NormalText>{currentCard.title}</NormalText>
        <View>
          {currentCard.choices.map((choice: any) => {
            const answeredChoice = answeredChoiceId === choice.id
            return (
              <Choice
                key={choice.id}
                choice={choice}
                answeredChoice={answeredChoice}
                answeredState={answeredState}
                answerCard={() => answerCard(choice)}
              />
            )
          })}
        </View>
      </View>
    )
  }

  return (
    <MainBackground>
      <View style={styles.container}>
        <NormalText>{props.route.params.deck?.name}</NormalText>
        <View style={{ flex: 3 }}>
          {displayCard()}
          {displayExplanation()}
        </View>
        <View></View>

        <View
          style={{
            flex: 1,
            flexWrap: 'wrap',
            flexDirection: 'row'
          }}
        >
          <View style={{ flex: 2, justifyContent: 'flex-end' }}>
            <MainButton
              buttonStyling={{ paddingHorizontal: 0, borderRadius: 10 }}
              titleProps={{ numberOfLines: 0 }}
              titleStyling={{ fontSize: 12 }}
              type={'filled'}
              outline
              disabled={cards.length === 1}
              onPress={archiveCardPress}
            >
              Skip this card next time
            </MainButton>
          </View>
          {answeredState === 1 && (
            <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 5 }}>
              <MainButton
                buttonStyling={{ paddingHorizontal: 0, borderRadius: 10 }}
                titleProps={{ numberOfLines: 0 }}
                titleStyling={{ fontSize: 12 }}
                type={'filled'}
                onPress={nextCard}
              >
                Next
              </MainButton>
            </View>
          )}
        </View>
      </View>
    </MainBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  }
})
