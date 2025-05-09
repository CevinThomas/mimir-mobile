import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import NormalText from './Typography/NormalText'
import { Dialog } from '@rneui/base'
import ClearButton from './Buttons/ClearButton'
import { copyDeck, deleteDeckSession } from '../api/DeckSessionApi'
import useErrorSnackbar from '../hooks/useErrorSnackbar'

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
  const { showError, errorSnackbar } = useErrorSnackbar()

  async function handleCopyDeck() {
    try {
      await copyDeck(deckSession.id)
      onAction()
      refresh()
    } catch (error) {
      showError('Failed to copy deck')
    }
  }

  async function handleDeleteSession() {
    try {
      await deleteDeckSession(deckSession.id)
      onAction()
      refresh()
    } catch (error) {
      showError('Failed to delete session')
    }
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
      {errorSnackbar()}
    </Dialog>
  )
}

const styles = StyleSheet.create({})
