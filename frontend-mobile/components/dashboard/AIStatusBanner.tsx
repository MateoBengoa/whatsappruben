import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useColorScheme } from 'react-native'
import { ThemedText } from '../ThemedText'
import { ThemedView } from '../ThemedView'
import { Colors } from '../../constants/Colors'

export function AIStatusBanner() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
    <ThemedView style={[styles.banner, { backgroundColor: colors.lightGray }]}>
      <View style={styles.content}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
          <ThemedText style={styles.statusText}>IA Activa</ThemedText>
        </View>
        <ThemedText style={[styles.details, { color: colors.gray }]}>
          GPT-4 • Última respuesta: hace 2 segundos
        </ThemedText>
      </View>
      <ThemedText style={styles.emoji}>🤖</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  details: {
    fontSize: 14,
  },
  emoji: {
    fontSize: 24,
  },
}) 