import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Dropdown as LibraryDropdown } from 'react-native-element-dropdown'

export default function Dropdown({ items, onChange }) {
  const [value, setValue] = useState(null)
  const [isFocus, setIsFocus] = useState(false)

  const renderLabel = () => {
    if (value || isFocus) {
      return <Text style={[styles.label, isFocus && { color: 'blue' }]}></Text>
    }
    return null
  }
  return (
    <View style={styles.container}>
      {renderLabel()}
      <LibraryDropdown
        itemTextStyle={{ color: 'gray' }}
        containerStyle={styles.containerStyle}
        style={[styles.dropdown]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={items}
        maxHeight={300}
        labelField="name"
        valueField="id"
        placeholder={!isFocus ? 'Select folder' : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onChange(item.id)
          setIsFocus(false)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  containerStyle: {
    backgroundColor: '#303844',
    borderWidth: 0
  },
  dropdown: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#303844'
  },
  icon: {
    marginRight: 5
  },
  label: {
    position: 'absolute',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray'
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'gray'
  },
  iconStyle: {
    width: 20,
    height: 20
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16
  }
})
