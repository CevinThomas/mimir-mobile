import { useState } from 'react'
import NormalText from '../components/Typography/NormalText'
import Animated, { Easing, FadeIn, FadeInDown, FadeOutDown } from 'react-native-reanimated'
import { StyleSheet, View } from 'react-native'
import Checkmark from '../svgs/Checkmark'

export default function useSnackBar() {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState('info')

  const show = (message: string, type: string = 'info') => {
    setMessage(message)
    setType(type)
    setVisible(true)
  }

  const hide = () => {
    setVisible(false)
  }

  FadeIn.duration(500).easing(Easing.ease)

  const snackBar = () => {
    return (
      <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={styles.container}>
        <View style={styles.checkmark}>
          <Checkmark />
        </View>
        <View>
          <NormalText>{message}</NormalText>
        </View>
      </Animated.View>
    )
  }

  return {
    visible,
    message,
    show,
    hide,
    snackBar
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    backgroundColor: '#326290',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    }
  },
  checkmark: {
    marginRight: 15,
    marginLeft: 5
  }
})
