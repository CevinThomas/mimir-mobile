import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { userSignUp } from '../api/AuthApi'
import MainBackground from '../components/MainBackground'
import CustomTextInput from '../components/Forms/Input'
import MainButton from '../components/Buttons/MainButton'

export default function SignUp() {
  const navigation = useNavigation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSignUp = async () => {
    try {
      await userSignUp(email, password, name)
      navigation.navigate('SignUpConfirmation', { email, password })
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <MainBackground>
      <View style={styles.container}>
        <View style={styles.form}>
          <CustomTextInput label={'Namn'} value={name} onChangeText={(value) => setName(value)} />
          <CustomTextInput
            label={'Email'}
            value={email}
            onChangeText={(value) => setEmail(value)}
          />
          <CustomTextInput
            label={'Password'}
            value={password}
            secureTextEntry={true}
            onChangeText={(value) => setPassword(value)}
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
