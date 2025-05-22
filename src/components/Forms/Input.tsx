import React, { memo, useEffect, useRef, useState } from 'react'
import { StyleSheet, TextInputProps, View, TouchableWithoutFeedback } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { getColorProperty } from '../../helpers'
import { Input } from '@rneui/base'
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate
} from 'react-native-reanimated'
import NormalText from '../Typography/NormalText'

interface CustomTextInputProps extends TextInputProps {
  label: string
}

const CustomTextInput: React.FC<CustomTextInputProps> = memo(
  ({ label, style, outline, onChangeText, ...props }) => {
    const { theme } = useTheme()
    const inputValue = useRef(props.value || '')
    const inputRef = useRef(null)
    const [isFocused, setIsFocused] = useState(false)
    const animationProgress = useSharedValue(props.value ? 1 : 0)

    const backgroundColor = getColorProperty(theme, 'inputBackground')
    const textColor = getColorProperty(theme, 'inputText')
    // Use accent color for the label when focused, or text color as fallback
    const labelColor = getColorProperty(
      theme,
      'accent',
      getColorProperty(theme, 'inputLabel', textColor)
    )

    // Update animation when value changes externally
    useEffect(() => {
      if (props.value === undefined) return

      if (props.value !== '') {
        // Ensure label is at the top when there's a value
        animationProgress.value = 1
      } else if (!isFocused) {
        animationProgress.value = withTiming(0, { duration: 150 })
      }
    }, [props.value])

    // Update animation on focus/blur
    useEffect(() => {
      if (!isFocused && props.value !== '') return
      if (isFocused || inputValue.current !== '') {
        animationProgress.value = withTiming(1, { duration: 150 })
      } else {
        animationProgress.value = withTiming(0, { duration: 150 })
      }
    }, [isFocused])

    // Animated styles for the floating label
    const labelAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: interpolate(animationProgress.value, [0, 1], [0, -24])
          },
          {
            translateX: interpolate(animationProgress.value, [0, 1], [0, -10])
          },
          {
            scale: interpolate(animationProgress.value, [0, 1], [1, 0.85])
          }
        ],
        color: isFocused ? labelColor : textColor,
        zIndex: 1
      }
    })

    return (
      <View style={styles.container}>
        <Input
          ref={inputRef}
          onChangeText={(text) => {
            inputValue.current = text
            if (onChangeText) {
              onChangeText(text)
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize={'none'}
          autoComplete={label === 'Email' ? 'email' : 'off'}
          style={[
            styles.input,
            {
              backgroundColor,
              color: textColor,
              borderColor: isFocused ? '#005DB4' : getColorProperty(theme, 'inputBorder'),
              borderWidth: isFocused || outline ? 1 : 0
            },
            style
          ]}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          label={null} // Remove default label
          {...props}
        />
        <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
          <Animated.View style={[styles.labelContainer, labelAnimatedStyle]}>
            <NormalText style={styles.labelText}>{label}</NormalText>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    height: 50,
    position: 'relative'
  },
  labelContainer: {
    position: 'absolute',
    top: 15,
    left: 25,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    zIndex: 2
  },
  labelText: {
    fontWeight: 'normal',
    color: 'white'
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 12
  }
})

export default CustomTextInput
