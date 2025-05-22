import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, View, Platform } from 'react-native'
import {
  answerCardApi,
  archiveCard,
  getCardBatch,
  getDeckSession,
  getDeckSessionPercentage,
  resetDeckSession
} from '../api/DeckSessionApi'
import { CommonActions, useNavigation } from '@react-navigation/native'
import useDenyBackButton from '../hooks/useDenyBackButton'
import useErrorSnackbar from '../hooks/useErrorSnackbar'
import MainBackground from '../components/MainBackground'
import NormalText from '../components/Typography/NormalText'
import Choice from '../components/Choice'
import OutlineButton from '../components/Buttons/OutlineButton'
import FilledButton from '../components/Buttons/FilledButton'
import Svg, { Path } from 'react-native-svg'
import { Button } from '@rneui/base'

export default function DeckSession(props: {
  route: { params: { deck: { name: string; id: string } } }
}) {
  const [cards, setCards] = useState([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [currentCard, setCurrentCard] = useState()
  const [initLoaded, setInitLoaded] = useState(false)
  const [answeredState, setAnsweredState] = useState(2)
  const [answeredChoiceId, setAnsweredId] = useState()
  const [deckSessionId, setDeckSessionId] = useState<number>()
  const [refreshing, setRefreshing] = useState(false)
  const [percentage, setPercentage] = useState('0%')

  const navigation = useNavigation()
  const { showError, errorSnackbar } = useErrorSnackbar()

  useDenyBackButton()

  const fetchPercentage = async (sessionId) => {
    try {
      const response = await getDeckSessionPercentage(sessionId)
      if (response && response.percentage) {
        setPercentage(response.percentage + '%')
      }
    } catch (error) {
      showError(error.message || 'Failed to fetch percentage')
    }
  }

  useEffect(() => {
    const sessionInit = async () => {
      try {
        const response = await getDeckSession(props.route.params.id)

        setDeckSessionId(response.deck_session.id)
        setCards(response.cards)

        setCurrentCard(response.cards[currentCardIndex])
        setInitLoaded(true)

        // Fetch percentage after session is initialized
        await fetchPercentage(response.deck_session.id)
      } catch (error) {
        showError(error.message || 'Failed to initialize deck session')
      }
    }
    sessionInit()
  }, [])

  const answerCard = (choice: any) => {
    try {
      answerCardApi(deckSessionId, currentCard.id, choice.id)

      setAnsweredId(choice.id)
      if (choice.correct) {
        setAnsweredState(0)
        setTimeout(async () => {
          try {
            if (currentCardIndex === cards.length - 1) {
              await fetchNextCardBatch()
              setCurrentCardIndex(0)
              setAnsweredState(2)
              // Fetch updated percentage after moving to next card batch
              await fetchPercentage(deckSessionId)
              return
            }
            setAnsweredState(2)
            setCurrentCardIndex(currentCardIndex + 1)
            // Fetch updated percentage after moving to next card
            await fetchPercentage(deckSessionId)
          } catch (error) {
            showError(error.message || 'Failed to process answer')
          }
        }, 1000)
      } else {
        setAnsweredState(1)
        // Fetch updated percentage after answering incorrectly
        fetchPercentage(deckSessionId)
      }
    } catch (error) {
      showError(error.message || 'Failed to submit answer')
    }
  }

  const nextCard = async () => {
    try {
      if (currentCardIndex === cards.length - 1) {
        await fetchNextCardBatch()
        setCurrentCardIndex(0)
        setAnsweredState(2)
        // Fetch updated percentage after moving to next card batch
        await fetchPercentage(deckSessionId)
        return
      }
      setAnsweredState(2)
      setCurrentCardIndex(currentCardIndex + 1)
      // Fetch updated percentage after moving to next card
      await fetchPercentage(deckSessionId)
    } catch (error) {
      showError()
    }
  }

  const displayExplanation = () => {
    if (answeredState === 1) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <NormalText>{currentCard.explanation}</NormalText>
        </View>
      )
    }
  }

  const archiveCardPress = async () => {
    try {
      const response = await archiveCard(deckSessionId, currentCard.id)
      if (currentCardIndex === cards.length - 1) {
        await fetchNextCardBatch()
        // Fetch updated percentage after fetching next card batch
        await fetchPercentage(deckSessionId)
        return
      }
      setCards(cards.filter((card: any) => card.id !== currentCard.id))
      setCurrentCard(cards[currentCardIndex + 1])
      // Fetch updated percentage after archiving card
      await fetchPercentage(deckSessionId)
    } catch (error) {
      showError()
    }
  }

  const fetchNextCardBatch = async () => {
    try {
      const response = await getCardBatch(deckSessionId)
      setCards(response.cards)
      setCurrentCard(response.cards[0])
      setCurrentCardIndex(0)
      // Fetch updated percentage after fetching next card batch
      await fetchPercentage(deckSessionId)
    } catch (error) {
      showError()
    }
  }

  const resetSession = async () => {
    try {
      await resetDeckSession(deckSessionId)
      await fetchNextCardBatch()
      // Fetch updated percentage after resetting session
      await fetchPercentage(deckSessionId)
    } catch (error) {
      showError()
    }
  }

  useEffect(() => {
    if (!initLoaded) return
    setCurrentCard(cards[currentCardIndex])
  }, [currentCardIndex, setInitLoaded])

  const displayCard = () => {
    if (!currentCard) return
    return (
      <View>
        <View style={{ marginBottom: 10 }}>
          <NormalText fontSize={32}>{currentCard.title}</NormalText>
        </View>
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

  const BackIcon = ({ ...props }) => {
    return (
      <Svg
        width={9}
        height={15}
        viewBox="0 0 9 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <Path
          d="M7.083 14.583L0 7.5 7.083.417l1.258 1.257L2.515 7.5l5.826 5.826-1.258 1.257z"
          fill="#FAF9F6"
        />
      </Svg>
    )
  }

  const handleBackPress = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home', params: { screen: 'Decks' } }]
      })
    )
  }

  return (
    <MainBackground>
      <View
        style={{
          position: 'absolute',
          top: Platform.OS === 'android' ? 30 : 70,
          left: 5,
          right: 0,
          zIndex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          paddingRight: 20
        }}
      >
        <View style={{ width: '10%' }}>
          <Button onPress={handleBackPress} buttonStyle={{ backgroundColor: 'transparent' }}>
            <BackIcon />
          </Button>
        </View>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: 'green',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <NormalText>{percentage}</NormalText>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={resetSession} />}
      >
        <View style={styles.container}>
          <View style={{ flex: 3 }}>
            {displayCard()}
            {displayExplanation()}
          </View>

          <View
            style={{
              flex: 1,
              flexWrap: 'wrap',
              flexDirection: 'row'
            }}
          >
            <View style={{ flex: 2, justifyContent: 'flex-end' }}>
              <OutlineButton
                disabled={cards.length === 1 || answeredState === 1 || answeredState === 0}
                onPress={archiveCardPress}
              >
                Skip this card next time
              </OutlineButton>
            </View>
            {answeredState === 1 && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  paddingHorizontal: 5
                }}
              >
                <FilledButton fontSize={14} onPress={nextCard}>
                  Next
                </FilledButton>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      {errorSnackbar()}
    </MainBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10
  }
})
