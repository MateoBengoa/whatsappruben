import React from 'react'
import { View, type ViewProps } from 'react-native'
import { useColorScheme } from 'react-native'

import { Colors } from '../constants/Colors'

export type ThemedViewProps = ViewProps & {
  lightColor?: string
  darkColor?: string
}

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const colorScheme = useColorScheme()
  const backgroundColor = lightColor || darkColor 
    ? (colorScheme === 'light' ? lightColor : darkColor)
    : Colors[colorScheme ?? 'light'].background

  return <View style={[{ backgroundColor }, style]} {...otherProps} />
} 