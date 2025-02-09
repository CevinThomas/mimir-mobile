import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'

type DeckItem = {
  id: string
  title: string
  description: string
}

type DeckProps = {
  deck: DeckItem
}

export default function DeckList(props: DeckProps) {
  const navigation = useNavigation()

  const handlePress = () => {
    navigation.navigate('Deck', { deck: props.deck })
  }
  return (
    <View style={styles.container}>
      <Button onPress={handlePress}>{props.deck.name}</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})
