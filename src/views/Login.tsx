import { StatusBar } from 'expo-status-bar'
import React, { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { login } from '../api/AuthApi'
import * as SecureStore from 'expo-secure-store'
import { getAccountInfo } from '../api/AccountsApi'
import useErrorSnackbar from '../hooks/useErrorSnackbar'
import MainBackground from '../components/MainBackground'
import CustomTextInput from '../components/Forms/Input'
import CustomCheckBox from '../components/Forms/Checkbox'
import FilledButton from '../components/Buttons/FilledButton'
import { useStoreContext } from '../context/StoreContext'

export default function Login() {
  const { state, dispatch } = useStoreContext()
  const { showError, errorSnackbar } = useErrorSnackbar()

  const email = useRef('')
  const password = useRef('')
  const passwordInputRef = useRef(null)
  const [rememberMe, setRememberMe] = React.useState(false)

  const onLoginPress = async () => {
    try {
      const response = await login(email.current, password.current)
      if (rememberMe) {
        await SecureStore.setItemAsync('rememberMe', 'true')
        await SecureStore.setItemAsync('email', email.current)
        await SecureStore.setItemAsync('password', password.current)
      }

      if (response.status.code === 200) {
        dispatch({ type: 'SET_USER', payload: response.status.data.user })
        const accountResponse = await getAccountInfo()
        dispatch({ type: 'SET_ACCOUNT', payload: accountResponse })
        dispatch({ type: 'LOG_IN' })
      }
    } catch (error) {
      showError('Login failed. Please check your credentials.')
    }
  }

  return (
    <MainBackground>
      <View style={styles.inputContainer}>
        <View style={{ marginBottom: 10 }}>
          <CustomTextInput
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
          label="Password"
          secureTextEntry
          onChangeText={(text: string) => (password.current = text)}
          returnKeyType="go"
          returnKeyLabel="login"
          onSubmitEditing={onLoginPress}
        />
        <CustomCheckBox
          label={'Remember me'}
          checked={rememberMe}
          onPress={() => setRememberMe(!rememberMe.current)}
        />
        <StatusBar style="auto" />
      </View>

      <View style={styles.signUpContainer}>
        <FilledButton onPress={onLoginPress}>Log in</FilledButton>
      </View>
      {errorSnackbar()}
    </MainBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputContainer: {
    flex: 5,
    justifyContent: 'center'
  },
  signUpContainer: {
    flex: 2,
    justifyContent: 'center',
    paddingHorizontal: 10
  }
})
