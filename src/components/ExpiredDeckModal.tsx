import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import NormalText from './Typography/NormalText'
import { Dialog } from '@rneui/base'
import ClearButton from './Buttons/ClearButton'
import { copyDeck, deleteDeckSession } from '../api/DeckSessionApi'

type ExpiredDeckModalProps = {
  deckSessions: any[]
  refreshCallback?: () => void
  onAction: () => void
}

export default function ExpiredDeckModal({
  deckSessions,
  refreshCallback,
  onAction
}: ExpiredDeckModalProps) {
  const [dialogVisible, setDialogVisible] = useState(true)
  const [expiredDeckSessions, setExpiredDeckSessions] = useState(deckSessions)
  const [currentDeckSession, setCurrentDeckSession] = useState(expiredDeckSessions[0])

  useEffect(() => {
    if (expiredDeckSessions.length > 0) {
      setCurrentDeckSession(expiredDeckSessions[0])
    } else {
      setDialogVisible(false)
    }
  }, [expiredDeckSessions])

  useEffect(() => {
    setExpiredDeckSessions(deckSessions)
  }, [deckSessions])

  async function handleCopyDeck() {
    await copyDeck(currentDeckSession.id)
    onAction()
    refresh()
  }

  async function handleDeleteSession() {
    await deleteDeckSession(currentDeckSession.id)
    onAction()
    refresh()
  }

  function refresh() {
    if (refreshCallback) {
      refreshCallback()
    }
  }

  return (
    <Dialog isVisible={dialogVisible}>
      <View>
        <NormalText>
          This deck {currentDeckSession.deck.name} has been deleted. Do you want to copy the deck to
          your private decks? If not, you will lose your current deck session with this deck
        </NormalText>
      </View>

      <View>
        <ClearButton onPress={() => handleCopyDeck()}>Copy deck</ClearButton>
        <ClearButton onPress={() => handleDeleteSession()}>Delete session</ClearButton>
      </View>
    </Dialog>
  )
}

const styles = StyleSheet.create({})
