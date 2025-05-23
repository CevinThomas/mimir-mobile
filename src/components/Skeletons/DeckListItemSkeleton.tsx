import React from 'react'
import { View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay
} from 'react-native-reanimated'

interface DeckListItemSkeletonProps {
  style?: any
}

export default function DeckListItemSkeleton({ style }: DeckListItemSkeletonProps) {
  // Animation values for the skeleton loading effect
  const opacity1 = useSharedValue(0.3)
  const opacity2 = useSharedValue(0.5)
  const opacity3 = useSharedValue(0.7)

  // Create animated styles with different delays for a wave effect
  const animatedStyle1 = useAnimatedStyle(() => {
    return {
      opacity: opacity1.value
    }
  })

  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      opacity: opacity2.value
    }
  })

  const animatedStyle3 = useAnimatedStyle(() => {
    return {
      opacity: opacity3.value
    }
  })

  // Start the animations when the component mounts
  React.useEffect(() => {
    const animation1 = withRepeat(withTiming(0.7, { duration: 1000 }), -1, true)
    const animation2 = withRepeat(withDelay(200, withTiming(0.7, { duration: 1000 })), -1, true)
    const animation3 = withRepeat(withDelay(400, withTiming(0.7, { duration: 1000 })), -1, true)

    opacity1.value = animation1
    opacity2.value = animation2
    opacity3.value = animation3
  }, [])

  return (
    <View style={[{ marginBottom: 10, width: '100%' }, style]}>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 10,
          height: 120,
          justifyContent: 'space-between'
        }}
      >
        {/* Top row with cards count */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginBottom: 30
          }}
        >
          <Animated.View
            style={[
              animatedStyle1,
              {
                width: 60,
                height: 20,
                backgroundColor: '#E0E0E0',
                borderRadius: 4
              }
            ]}
          />
        </View>

        {/* Description */}
        <Animated.View
          style={[
            animatedStyle2,
            {
              width: '70%',
              height: 16,
              backgroundColor: '#E0E0E0',
              borderRadius: 4,
              marginBottom: 8
            }
          ]}
        />

        {/* Title */}
        <Animated.View
          style={[
            animatedStyle3,
            {
              width: '90%',
              height: 24,
              backgroundColor: '#E0E0E0',
              borderRadius: 4
            }
          ]}
        />
      </View>
    </View>
  )
}
