import { StatusBar } from 'expo-status-bar'
import React, { useRef } from 'react'
import { AppState, StyleSheet, View } from 'react-native'
import { useAuthContext } from '../context/AuthContext'
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import { login, userConfirmed } from '../api/AuthApi'
import * as SecureStore from 'expo-secure-store'
import { getAccountInfo } from '../api/AccountsApi'
import { useUserContext } from '../context/UserContext'
import useDenyBackButton from '../hooks/useDenyBackButton'
import MainBackground from '../components/MainBackground'
import NormalText from '../components/Typography/NormalText'
import ClearButton from '../components/Buttons/ClearButton'
import LottieView from 'lottie-react-native'

export default function SignUpConfirmation(props: {
  route: { params: { email: string; password: string } }
}) {
  const { state, dispatch } = useAuthContext()
  const { state: userState, dispatch: userDispatch } = useUserContext()
  const navigation = useNavigation()
  const intervalIdRef = useRef(null)
  const animation = useRef<LottieView>(null)

  useDenyBackButton()

  useFocusEffect(
    React.useCallback(() => {
      const startPolling = () => {
        intervalIdRef.current = setInterval(async () => {
          const response = await userConfirmed(props.route.params.email)
          if (response.is_verified === true) {
            stopPolling()
            onVerified()
          }
        }, 2000)
      }

      const stopPolling = () => {
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current)
          intervalIdRef.current = null
        }
      }

      const handleAppStateChange = (nextAppState: any) => {
        if (nextAppState === 'active') {
          return startPolling()
        }
        stopPolling()
      }

      const subscription = AppState.addEventListener('change', handleAppStateChange)
      startPolling()
      return () => {
        subscription.remove()
        stopPolling()
      }
    }, [])
  )

  const onVerified = async () => {
    await SecureStore.setItemAsync('email', props.route.params.email)
    await SecureStore.setItemAsync('password', props.route.params.password)
    await login(props.route.params.email, props.route.params.password)
    const account = await getAccountInfo()
    userDispatch({ type: 'SET_ACCOUNT', payload: account })

    dispatch({ type: 'LOG_IN' })
  }

  const onCancelPress = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Welcome' }]
      })
    )
  }

  return (
    <MainBackground>
      <View style={styles.textContainer}>
        <NormalText style={{ textAlign: 'center' }}>
          We have sent you an email with a confirmation link. Please click on the link to confirm
          your email address.
        </NormalText>
      </View>

      <View style={styles.buttonContainer}>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 200,
            height: 200,
            backgroundColor: 'transparent'
          }}
          source={require('../../assets/lottie/loading.json')}
        />
      </View>

      <View style={styles.cancelContainer}>
        <ClearButton onPress={onCancelPress}>Cancel</ClearButton>
      </View>

      <StatusBar style="auto" />
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
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelContainer: {
    flex: 2,
    justifyContent: 'center',
    paddingHorizontal: 10
  }
})
