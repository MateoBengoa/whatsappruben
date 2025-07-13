import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useColorScheme } from 'react-native'
import { ThemedText } from '../ThemedText'
import { Colors } from '../../constants/Colors'

const quickActions = [
  { title: 'Contactos', icon: '👥', color: '#3b82f6' },
  { title: 'Mensajes', icon: '💬', color: '#f97316' },
  { title: 'Entrenar IA', icon: '🧠', color: '#22c55e' },
  { title: 'Analytics', icon: '📊', color: '#8b5cf6' },
]

export function QuickActionButtons() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
    <View style={styles.container}>
      {quickActions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.actionButton, { backgroundColor: colors.lightGray }]}
          onPress={() => {
            // TODO: Navigate to respective screen
            console.log(`Navigate to ${action.title}`)
          }}
        >
          <ThemedText style={styles.actionIcon}>{action.icon}</ThemedText>
          <ThemedText style={styles.actionTitle}>{action.title}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
}) 