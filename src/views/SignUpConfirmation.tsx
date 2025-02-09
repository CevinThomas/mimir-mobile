import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useAuthContext } from '../context/AuthContext'
import { Button, Text } from '@rneui/themed'

export default function SignUpConfirmation() {
  const { state, dispatch } = useAuthContext()

  const logIn = (id) => {
    dispatch({ type: 'LOG_IN' })
  }

  return (
    <View style={styles.container}>
      <Text>
        We have sent you an email with a confirmation link. Please click on the link to confirm your
        email address.
      </Text>

      <Button type="solid" loading />

      <Button
        title={'Cancel'}
        buttonStyle={{
          backgroundColor: 'rgba(78, 116, 289, 1)',
          borderRadius: 3
        }}
        containerStyle={{
          width: 200,
          marginHorizontal: 50,
          marginVertical: 10
        }}
      />

      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
