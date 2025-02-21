import React, { useEffect, useState } from 'react'
import { BackHandler, View } from 'react-native'
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import { useCreateDeckContext } from '../context/CreateDeckContext'
import { createDeck, updateDeck } from '../api/DecksApi'
import MainBackground from '../components/MainBackground'
import CustomTextInput from '../components/Forms/Input'
import NormalText from '../components/Typography/NormalText'
import ClickButton from '../components/Buttons/ClickButton'
import SideActionButton from '../components/Buttons/SideActionButton'
import ClearButton from '../components/Buttons/ClearButton'
import Dropdown from '../components/Dropdown'
import { getFolders } from '../api/FoldersApi'

export default function CreateDeck(props: {
  route: { params: { deck: { name: string; id: string } } }
}) {
  const [folders, setFolders] = useState([])
  const [selectedFolder, setSelectedFolder] = useState(null)
  useEffect(() => {
    if (props.route.params?.deck) {
      dispatch({
        type: 'SET_DECK',
        response: {
          name: props.route.params.deck.name,
          description: props.route.params.deck.description,
          id: props.route.params.deck.id,
          cards: props.route.params.deck.cards,
          active: props.route.params.deck.active
        }
      })
    }
    fetchFolders()
  }, [])

  const fetchFolders = async () => {
    const folders = await getFolders()
    setFolders(folders)
  }

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        onGoBack()
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
      }
    }, [])
  )
  const { state, dispatch } = useCreateDeckContext()
  const navigation = useNavigation()

  const onUpdateDeck = (key: string, value: string) => {
    dispatch({ type: 'UPDATE_DECK_KEY', key, value })
  }

  const onNavigateToCreateCard = async () => {
    if (!state.id) {
      console.log('HELLO')
      const response = await createDeck({
        name: state.name,
        description: state.description,
        cards: state.cards,
        folder_id: state.folder_id
      })
      console.log('RESPONSE', response)
      dispatch({ type: 'SET_DECK', response })
    }

    navigation.navigate('CreateCard')
  }

  const onSaveDeck = async () => {
    await updateDeck(state.id, { name: state.name, description: state.description })
    dispatch({ type: 'RESET' })
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Home', params: { screen: 'Decks' } }] })
    )
  }

  const onGoBack = () => {
    dispatch({ type: 'RESET' })
    navigation.dispatch(CommonActions.goBack())
  }

  const onPublishDeck = async () => {
    await updateDeck(state.id, {
      name: state.name,
      description: state.description,
      active: true
    })
    dispatch({ type: 'RESET' })
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Home', params: { screen: 'Decks' } }] })
    )
  }

  return (
    <MainBackground>
      <CustomTextInput
        value={state.name}
        placeholder={'Title'}
        onChangeText={(text) => onUpdateDeck('name', text)}
      />

      <CustomTextInput
        value={state.description}
        placeholder={'Description'}
        style={{ height: 100 }}
        onChangeText={(text) => onUpdateDeck('description', text)}
      />

      <View>{state.folder_id && <NormalText>Folder: {state.folder_id}</NormalText>}</View>

      <View>
        <Dropdown onChange={(value) => onUpdateDeck('folder_id', value)} items={folders} />
      </View>
      <View style={{ flex: 3, padding: 10 }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <View>
            <NormalText>Cards</NormalText>
          </View>
          <View>
            <SideActionButton onPress={() => onNavigateToCreateCard()}>Add card</SideActionButton>
          </View>
        </View>
        <View style={{ flex: 5 }}>
          {state.cards?.map((card, index) => (
            <View style={{ marginBottom: 10 }} key={index}>
              <ClickButton onPress={() => navigation.navigate('CreateCard', { card: card })}>
                {card.title}
              </ClickButton>
            </View>
          ))}
        </View>
      </View>

      {state.id && (
        <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', marginBottom: 20 }}>
          {/*
          <View style={{ flex: 2, justifyContent: 'flex-end' }}>
            <FilledButton onPress={onPublishDeck}>Publish deck</FilledButton>
          </View>
          */}

          <View style={{ flex: 2, justifyContent: 'flex-end', paddingHorizontal: 5 }}>
            <ClearButton onPress={onSaveDeck}>Save deck</ClearButton>
          </View>
        </View>
      )}
    </MainBackground>
  )
}
