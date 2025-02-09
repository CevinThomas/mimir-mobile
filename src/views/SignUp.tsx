import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Text } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'
import { Input } from '@rneui/base'

export default function SignUp() {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <Input autoCapitalize="none" autoComplete="email" placeholder="Namn" />
      <Input autoCapitalize="none" autoComplete="email" placeholder="Email" />
      <Input placeholder="Password" />

      <StatusBar style="auto" />
      <Button onPress={() => navigation.navigate('SignUpConfirmation')}>
        User clicks Continue
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
