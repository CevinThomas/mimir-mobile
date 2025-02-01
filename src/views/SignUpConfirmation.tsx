import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '@react-navigation/elements'
import { useAuthContext } from '../context/AuthContext'

export default function SignUpConfirmation() {
  const { state, dispatch } = useAuthContext()

  const logIn = (id) => {
    dispatch({ type: 'LOG_IN' })
  }

  return (
    <View style={styles.container}>
      <Text>
        This page will first show a "Please check your email for the confirmation email. Once you
        have confirmed, please click the button below"
      </Text>

      <Button onPress={logIn}>User clicks I have confirmed</Button>

      <StatusBar style="auto" />
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
