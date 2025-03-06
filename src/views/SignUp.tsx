import { StatusBar } from 'expo-status-bar'
import React, { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { userSignUp } from '../api/AuthApi'
import MainBackground from '../components/MainBackground'
import CustomTextInput from '../components/Forms/Input'
import MainButton from '../components/Buttons/MainButton'
import { useStoreContext } from '../context/StoreContext'

export default function SignUp() {
  const navigation = useNavigation()

  const { state, dispatch } = useStoreContext()

  const name = useRef('')
  const email = useRef('')
  const password = useRef('')

  const onSignUp = async () => {
    try {
      const response = await userSignUp(email.current, password.current, name.current)
      if (response.status.code === 200) {
        dispatch({ type: 'SET_USER', payload: response.status.data.user })
        navigation.navigate('SignUpConfirmation', {
          email: email.current,
          password: password.current
        })
      }
    } catch (error) {}
  }
  return (
    <MainBackground>
      <View style={styles.container}>
        <View style={styles.form}>
          <CustomTextInput label="Namn" onChangeText={(text: string) => (name.current = text)} />
          <CustomTextInput label="Email" onChangeText={(text: string) => (email.current = text)} />
          <CustomTextInput
            label={'Password'}
            secureTextEntry={true}
            onChangeText={(text) => (password.current = text)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <StatusBar style="auto" />
          <MainButton type={'filled'} onPress={onSignUp}>
            Create account
          </MainButton>
        </View>
      </View>
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
