import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import * as Linking from 'expo-linking'
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import { getUserInfo, googleSignIn, login } from '../api/AuthApi'
import { Ionicons } from '@expo/vector-icons'
import { getAccountInfo } from '../api/AccountsApi'
import useErrorSnackbar from '../hooks/useErrorSnackbar'
import MainBackground from '../components/MainBackground'
import NormalText from '../components/Typography/NormalText'
import FilledButton from '../components/Buttons/FilledButton'
import ClearButton from '../components/Buttons/ClearButton'
import { useStoreContext } from '../context/StoreContext'

export default function Start() {
  const navigation = useNavigation()
  const { state, dispatch } = useStoreContext()
  const { showError, errorSnackbar } = useErrorSnackbar()

  const rememberKey = async () => {
    return await SecureStore.getItemAsync('rememberMe')
  }

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const rememberMe = await rememberKey()
        if (rememberMe === 'true') {
          //const { email, password } = await emailAndPassword()
          const response = await getUserInfo()
          if (response) {
            dispatch({ type: 'SET_USER', payload: response })
            const accountResponse = await getAccountInfo()
            dispatch({ type: 'SET_ACCOUNT', payload: accountResponse })
            dispatch({ type: 'LOG_IN' })
          }
        }
      } catch (error) {
        showError('Failed to automatically log in')
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

      <View style={styles.googleButtonContainer}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => navigation.navigate('GoogleLogin')}
        >
          <Ionicons name="logo-google" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {errorSnackbar()}
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
  },
  googleButtonContainer: {
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  googleButton: {
    backgroundColor: '#DB4437',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  }
})
