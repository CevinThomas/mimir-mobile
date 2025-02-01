import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function Home() {
  return (
    <View style={styles.container}>
      <Text>
        This is the home page. If you are seeing this, you have successfully logged in.
        Congratulations!
      </Text>
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
