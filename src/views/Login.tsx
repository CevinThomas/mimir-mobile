import { StatusBar } from 'expo-status-bar'
import React, { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { login } from '../api/AuthApi'
import * as SecureStore from 'expo-secure-store'
import { getAccountInfo } from '../api/AccountsApi'
import MainBackground from '../components/MainBackground'
import CustomTextInput from '../components/Forms/Input'
import CustomCheckBox from '../components/Forms/Checkbox'
import FilledButton from '../components/Buttons/FilledButton'
import { useStoreContext } from '../context/StoreContext'

export default function Login() {
  const { state, dispatch } = useStoreContext()

  const email = useRef('')
  const password = useRef('')
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
    } catch (error) {}
  }

  return (
    <MainBackground>
      <View style={styles.inputContainer}>
        <CustomTextInput label="Email" onChangeText={(text: string) => (email.current = text)} />
        <CustomTextInput
          label="Password"
          secureTextEntry
          onChangeText={(text: string) => (password.current = text)}
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
