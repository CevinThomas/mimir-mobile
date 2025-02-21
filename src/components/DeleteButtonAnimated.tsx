import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import { StyleSheet, View } from 'react-native'
import { useEffect } from 'react'
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from 'react-native-gesture-handler'
import { Button } from '@rneui/base'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function AnimatedStyleUpdateExample({ onPress, onDelete, children }) {
  const deleteWidth = useSharedValue(30)

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1)
  }

  const deleteStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${deleteWidth.value}%`, config)
    }
  })

  const flingGesture = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart((e) => {
      deleteWidth.value = 30
    })

  const rightFlingGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart((e) => {
      deleteWidth.value = 1
    })

  const gesture = Gesture.Race(flingGesture, rightFlingGesture)

  useEffect(() => {
    setTimeout(() => {
      deleteWidth.value = 1
    }, 2000)
  }, [])

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box]}>
        <GestureHandlerRootView>
          <GestureDetector gesture={gesture}>
            <Button
              onPress={onPress}
              titleStyle={{ width: '100%', textAlign: 'left' }}
              buttonStyle={{ backgroundColor: '#444B56' }}
            >
              {children}
            </Button>
          </GestureDetector>
        </GestureHandlerRootView>
      </Animated.View>
      <Animated.View style={[styles.deleteBox]}>
        <Button onPress={onDelete} buttonStyle={{ backgroundColor: '#FF5A5F', height: '100%' }}>
          <Ionicons name="trash" size={22} color="white" />
        </Button>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#444B56',
    flexDirection: 'row',
    height: 40,
    position: 'relative'
  },
  box: {
    borderRadius: 0
  },
  deleteBox: {
    borderRadius: 0,
    zIndex: 100,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0
  }
})
