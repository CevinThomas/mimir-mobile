import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useAuthContext } from '../context/AuthContext'
import { Button } from '@react-navigation/elements'
import * as SecureStore from 'expo-secure-store'
import { logout } from '../api/AuthApi'

export default function Profile() {
  const onLogoutPress = async () => {
    try {
      await logout()
      await SecureStore.deleteItemAsync('jwt')
      await SecureStore.deleteItemAsync('rememberMe')
      await SecureStore.deleteItemAsync('email')
      await SecureStore.deleteItemAsync('password')
      dispatch({ type: 'LOG_OUT' })
    } catch (error) {
      console.error(error)
    }
  }

  const getEmailOfProfile = async () => {
    const email = SecureStore.getItemAsync('email')
    return email
  }

  const { state, dispatch } = useAuthContext()
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile</Text>
      <Text>{getEmailOfProfile()}</Text>
      <Text>{state.isLoggedIn ? 'Logged in' : 'Not logged in'}</Text>
      <Button onPress={onLogoutPress}>Log out</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold'
  }
})
