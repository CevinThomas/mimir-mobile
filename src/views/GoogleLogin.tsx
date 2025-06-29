import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, TextInput, AppState, AppStateStatus } from 'react-native'
import * as Linking from 'expo-linking'
import { useNavigation } from '@react-navigation/native'
import { expireAuthRequest, googleSignIn, pollGoogleAuthSuccess } from '../api/AuthApi'
import useErrorSnackbar from '../hooks/useErrorSnackbar'
import MainBackground from '../components/MainBackground'
import NormalText from '../components/Typography/NormalText'
import FilledButton from '../components/Buttons/FilledButton'
import CustomCheckBox from '../components/Forms/Checkbox'
import { getColorProperty } from '../helpers'
import { useTheme } from '../context/ThemeContext'
import LottieView from 'lottie-react-native'
import { useStoreContext } from '../context/StoreContext'
import * as SecureStore from 'expo-secure-store'

export default function GoogleLogin() {
  const navigation = useNavigation()
  const { showError, errorSnackbar } = useErrorSnackbar()
  const [email, setEmail] = useState('cevin.thomas.ny@gmail.com')
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [isPolling, setIsPolling] = useState(false)
  const [authToken, setAuthToken] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const appState = useRef(AppState.currentState)
  const { state, dispatch } = useStoreContext()

  // Load saved email and remember me state
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedRememberMe = await SecureStore.getItemAsync('rememberMe')
        if (savedRememberMe === 'true') {
          setRememberMe(true)
          const savedEmail = await SecureStore.getItemAsync('email')
          if (savedEmail) {
            setEmail(savedEmail)
          }
        }
      } catch (error) {
        console.log('Error loading saved credentials:', error)
      }
    }

    loadSavedCredentials()
  }, [])

  // Handle app state changes to manage polling
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      subscription.remove()
      stopPolling()
    }
  }, [isPolling])

  // Start polling when isPolling is true and app is active
  useEffect(() => {
    if (isPolling && appState.current === 'active') {
      startPolling()
    } else {
      stopPolling()
    }
  }, [isPolling, appState.current])

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active' && isPolling) {
      startPolling()
    } else if (nextAppState !== 'active') {
      stopPolling()
    }

    appState.current = nextAppState
  }

  const startPolling = () => {
    if (pollingIntervalRef.current) return

    pollingIntervalRef.current = setInterval(async () => {
      try {
        // Pass email and token to the polling function
        if (!authToken) {
          console.log('No auth token available for polling')
          return
        }

        const response = await pollGoogleAuthSuccess(email, authToken)

        console.log('Polling response: ', response)

        if (response.token) {
          await SecureStore.setItemAsync('jwt', `Bearer ${response.token}`)
          await expireAuthRequest(authToken)

          //TODO:  MAKE REQUEST TO FETCH USER INFO

          // Authentication successful
          stopPolling()
          setIsLoading(false)

          // Update global state with user data
          //dispatch({ type: 'SET_USER', payload: response.status.data.user })
          dispatch({ type: 'LOG_IN' })

          // Navigate to home screen or wherever needed after login
          // navigation.navigate('Home')
        }
      } catch (error) {
        console.log('Polling error:', error)
        // Don't stop polling on error, just continue
      }
    }, 3000)
  }

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }

  const handleGoogleLogin = async () => {
    if (!email) {
      showError('Please enter your email')
      return
    }

    try {
      setIsLoading(true)
      const response = await googleSignIn(email)
      console.log('GOOGLE SIGN IN RESPONSE')
      console.log(response)

      if (response.success === false) {
        showError(response.message)
        return
      }

      // Store email if "Remember Me" is checked
      if (rememberMe) {
        await SecureStore.setItemAsync('rememberMe', 'true')
        await SecureStore.setItemAsync('email', email)
      }

      // Extract token from response
      if (response.token) {
        setAuthToken(response.token)
        console.log('Received token:', response.token)
      } else {
        console.log('No token received in response')
      }

      const canOpen = await Linking.canOpenURL('http://localhost:3001/omniauth/omniauth_window')

      if (canOpen) {
        Linking.openURL('http://localhost:3001/omniauth/omniauth_window')
        // Start polling after opening the auth window
        setIsPolling(true)
      }

      console.log('Google login response:', response)
    } catch (error) {
      setIsLoading(false)
      setIsPolling(false)
      showError('Failed to login with Google')
    }
  }

  return (
    <MainBackground>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <NormalText fontSize={24}>Login with Google</NormalText>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <LottieView
              source={require('../../assets/lottie/loading.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
            <NormalText style={styles.loadingText}>
              {isPolling ? 'Waiting for authentication...' : 'Loading...'}
            </NormalText>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <NormalText>Email</NormalText>
            <TextInput
              style={[styles.input, { backgroundColor: getColorProperty(theme, 'lightest') }]}
              placeholder="Enter your email"
              placeholderTextColor={getColorProperty(theme, 'text')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <CustomCheckBox
              label={'Remember me'}
              checked={rememberMe}
              onPress={() => setRememberMe(!rememberMe)}
            />
            <View style={styles.buttonContainer}>
              <FilledButton onPress={handleGoogleLogin}>Login with Google</FilledButton>
            </View>
          </View>
        )}
      </View>
      {errorSnackbar()}
    </MainBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40
  },
  formContainer: {
    width: '100%'
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 10,
    color: '#000'
  },
  buttonContainer: {
    marginTop: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  lottieAnimation: {
    width: 200,
    height: 200
  },
  loadingText: {
    marginTop: 20,
    textAlign: 'center'
  }
})
