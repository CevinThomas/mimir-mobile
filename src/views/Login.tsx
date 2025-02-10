import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, CheckBox } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'
import { login } from '../api/AuthApi'
import { useAuthContext } from '../context/AuthContext'
import * as SecureStore from 'expo-secure-store'
import { Input } from '@rneui/base'

export default function Login() {
  const navigation = useNavigation()
  const { state, dispatch } = useAuthContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const onLoginPress = async () => {
    try {
      const response = await login(email, password)
      if (rememberMe) {
        await SecureStore.setItemAsync('rememberMe', 'true')
        await SecureStore.setItemAsync('email', email)
        await SecureStore.setItemAsync('password', password)
      }

      if (response.status.code === 200) {
        dispatch({ type: 'LOG_IN' })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      <Input
        autoCapitalize="none"
        autoComplete="email"
        placeholder="Email"
        onChangeText={setEmail}
      />
      <Input autoCapitalize="none" placeholder="Password" onChangeText={setPassword} />
      <CheckBox title={'Remember me'} checked={rememberMe} onPress={setRememberMe} />
      <StatusBar style="auto" />
      <Button onPress={onLoginPress}>Login</Button>
      <Button onPress={() => navigation.navigate('SignUp')}>User clicks Sign Up</Button>
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
