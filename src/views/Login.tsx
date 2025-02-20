import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { login } from '../api/AuthApi'
import { useAuthContext } from '../context/AuthContext'
import * as SecureStore from 'expo-secure-store'
import { getAccountInfo } from '../api/AccountsApi'
import { useUserContext } from '../context/UserContext'
import MainBackground from '../components/MainBackground'
import CustomTextInput from '../components/Forms/Input'
import CustomCheckBox from '../components/Forms/Checkbox'
import FilledButton from '../components/Buttons/FilledButton'

export default function Login() {
  const navigation = useNavigation()
  const { state, dispatch } = useAuthContext()
  const { state: userState, dispatch: userDispatch } = useUserContext()

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
        const accountResponse = await getAccountInfo()
        userDispatch({ type: 'SET_ACCOUNT', payload: accountResponse })
        dispatch({ type: 'LOG_IN' })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <MainBackground>
      <View style={styles.inputContainer}>
        <CustomTextInput label="Email" onChangeText={setEmail} />
        <CustomTextInput label="Password" secureTextEntry onChangeText={setPassword} />
        <CustomCheckBox
          label={'Remember me'}
          checked={rememberMe}
          onPress={() => setRememberMe(!rememberMe)}
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
