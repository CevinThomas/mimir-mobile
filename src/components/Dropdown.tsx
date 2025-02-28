import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { MultiSelect as LibraryDropdown } from 'react-native-element-dropdown'

export default function Dropdown({ items, onChange, unSelect }) {
  const [selected, setSelected] = useState([])

  const [isFocus, setIsFocus] = useState(false)

  const renderLabel = () => {
    if (isFocus) {
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
        placeholder={'Select folder'}
        value={selected}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          const previousSelected = selected
          previousSelected.push(item[0])
          setSelected(previousSelected)
          onChange(item[0])
          setIsFocus(false)
        }}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity
            onPress={(item) => {
              if (unSelect) {
                unSelect(item.id)
              }
              setSelected(selected.filter((i) => i.id !== item.id))
            }}
          >
            <View style={styles.selectedStyle}>
              <Text style={styles.textSelectedStyle}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
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
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
    color: 'white'
  }
})
