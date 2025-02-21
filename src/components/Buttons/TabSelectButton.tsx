import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '@rneui/themed'
import { getColorProperty } from '../../helpers'

export default function TabSelectButton({ children, ...props }) {
  const [selected, setSelected] = React.useState(props.selected)

  useEffect(() => {
    setSelected(props.selected)
  }, [props.selected])
  const { theme } = useTheme()
  return (
    <View style={[styles.container]}>
      <Button
        type={'clear'}
        style={{
          borderBottomWidth: selected ? 0 : 2,
          borderLeftWidth: selected ? 2 : 0,
          borderTopWidth: selected ? 2 : 0,
          borderRightWidth: selected ? 2 : 0,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          borderColor: getColorProperty(theme, 'inputBorder')
        }}
        title={children}
        titleStyle={{
          color: getColorProperty(theme, 'text'),
          fontSize: 14
        }}
        titleProps={{
          ellipsizeMode: 'tail',
          numberOfLines: 1
        }}
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    borderRadius: 1,
    padding: 12
  }
})
