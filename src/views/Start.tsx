import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '@react-navigation/elements'
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import { login } from '../api/AuthApi'
import { useAuthContext } from '../context/AuthContext'

export default function Start() {
  const navigation = useNavigation()
  const { state, dispatch } = useAuthContext()

  const rememberKey = async () => {
    return await SecureStore.getItemAsync('rememberMe')
  }

  const emailAndPassword = async () => {
    const email = await SecureStore.getItemAsync('email')
    const password = await SecureStore.getItemAsync('password')
    return { email, password }
  }

  useEffect(() => {
    const autoLogin = async () => {
      const rememberMe = await rememberKey()
      if (rememberMe === 'true') {
        const { email, password } = await emailAndPassword()
        const response = await login(email, password)
        if (response.status.code === 200) {
          dispatch({ type: 'LOG_IN' })
        }
      }
    }

    autoLogin()
  }, [])
  return (
    <View style={styles.container}>
      <Text>Basic start screen</Text>
      <StatusBar style="auto" />
      <Button onPress={() => navigation.navigate('Login')}>User clicks Continue or Login</Button>
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
