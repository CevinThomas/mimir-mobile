import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import NormalText from './Typography/NormalText'
import { Dialog } from '@rneui/base'
import ClearButton from './Buttons/ClearButton'
import { copyDeck, deleteDeckSession } from '../api/DeckSessionApi'

type ExpiredDeckModalProps = {
  deckSession: null | {}
  refreshCallback?: () => void
  onAction: () => void
}

export default function ExpiredDeckModal({
  deckSession,
  refreshCallback,
  onAction
}: ExpiredDeckModalProps) {
  const [dialogVisible, setDialogVisible] = useState(true)
  console.log(deckSession)

  async function handleCopyDeck() {
    await copyDeck(deckSession.id)
    onAction()
    refresh()
  }

  async function handleDeleteSession() {
    await deleteDeckSession(deckSession.id)
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
          This deck {deckSession.deck.name} has been deleted. Do you want to copy the deck to your
          private decks? If not, you will lose your current deck session with this deck
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
