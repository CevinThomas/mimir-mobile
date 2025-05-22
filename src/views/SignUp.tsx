import { StatusBar } from 'expo-status-bar'
import React, { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { userSignUp } from '../api/AuthApi'
import useErrorSnackbar from '../hooks/useErrorSnackbar'
import MainBackground from '../components/MainBackground'
import CustomTextInput from '../components/Forms/Input'
import MainButton from '../components/Buttons/MainButton'
import { useStoreContext } from '../context/StoreContext'
import FilledButton from '../components/Buttons/FilledButton'

export default function SignUp() {
  const navigation = useNavigation()

  const { state, dispatch } = useStoreContext()
  const { showError, errorSnackbar } = useErrorSnackbar()

  const name = useRef('')
  const email = useRef('')
  const password = useRef('')
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)

  const onSignUp = async () => {
    try {
      const response = await userSignUp(email.current, password.current, name.current)
      if (response.status.code === 200) {
        dispatch({ type: 'SET_USER', payload: response.data })
        navigation.navigate('SignUpConfirmation', {
          email: email.current,
          password: password.current
        })
      }
    } catch (error) {
      showError('Sign up failed. Please try again.')
    }
  }
  return (
    <MainBackground>
      <View style={styles.container}>
        <View style={styles.form}>
          <View style={{ marginBottom: 10 }}>
            <CustomTextInput
              label="Namn"
              onChangeText={(text: string) => (name.current = text)}
              autoCapitalize={'words'}
              returnKeyType="next"
              onSubmitEditing={() => emailInputRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>

          <View style={{ marginBottom: 10 }}>
            <CustomTextInput
              ref={emailInputRef}
              label="Email"
              onChangeText={(text: string) => (email.current = text)}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              blurOnSubmit={false}
              textContentType={'emailAddress'}
              inputMode={'email'}
              keyboardType={'email-address'}
            />
          </View>

          <CustomTextInput
            ref={passwordInputRef}
            label={'Password'}
            secureTextEntry={true}
            onChangeText={(text) => (password.current = text)}
            returnKeyType="go"
            returnKeyLabel="signup"
            onSubmitEditing={onSignUp}
          />
        </View>
        <View style={styles.buttonContainer}>
          <StatusBar style="auto" />
          <FilledButton onPress={onSignUp}>Create account</FilledButton>
        </View>
      </View>
      {errorSnackbar()}
    </MainBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  form: {
    marginBottom: 20,
    flex: 3,
    justifyContent: 'center'
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 10
  }
})
