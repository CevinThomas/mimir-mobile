import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import { login } from '../api/AuthApi'
import { useAuthContext } from '../context/AuthContext'
import { getAccountInfo } from '../api/AccountsApi'
import { useUserContext } from '../context/UserContext'
import MainBackground from '../components/MainBackground'
import NormalText from '../components/Typography/NormalText'
import FilledButton from '../components/Buttons/FilledButton'
import ClearButton from '../components/Buttons/ClearButton'

export default function Start() {
  const navigation = useNavigation()
  const { state, dispatch } = useAuthContext()
  const { state: userState, dispatch: userDispatch } = useUserContext()

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
          const accountResponse = await getAccountInfo()
          userDispatch({ type: 'SET_ACCOUNT', payload: accountResponse })
          dispatch({ type: 'LOG_IN' })
        }
      }
    }

    autoLogin()
  }, [])
  return (
    <MainBackground>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <NormalText fontSize={36}>APP NAME</NormalText>
        </View>
        <View style={styles.buttonsContainer}>
          <StatusBar style="auto" />
          <View>
            <FilledButton onPress={() => navigation.navigate('SignUp')}>
              Create account
            </FilledButton>
            <View style={styles.userText}>
              <NormalText>Already a user?</NormalText>
            </View>

            <ClearButton onPress={() => navigation.navigate('Login')}>Login</ClearButton>
          </View>
        </View>
      </View>
    </MainBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonsContainer: {
    flex: 2,
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 10
  },
  userText: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10
  }
})
