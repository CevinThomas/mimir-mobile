import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '@react-navigation/elements'
import { useNavigation } from '@react-navigation/native'

export default function SignUp() {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <Text>This is where the user enters information about them to sign up</Text>
      <Text>Name, Email, Password etc</Text>
      <StatusBar style="auto" />
      <Button onPress={() => navigation.navigate('SignUpConfirmation')}>
        User clicks Continue
      </Button>
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
