import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from 'react-native'
import { ThemedText } from '../../components/ThemedText'
import { ThemedView } from '../../components/ThemedView'
import { Colors } from '../../constants/Colors'

export default function ConversationsScreen() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Conversaciones</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.gray }]}>
          Chat en tiempo real con tus contactos
        </ThemedText>
      </ThemedView>

      <View style={styles.content}>
        <ThemedText style={styles.emoji}>💬</ThemedText>
        <ThemedText style={[styles.message, { color: colors.gray }]}>
          Próximamente: Chat en tiempo real
        </ThemedText>
        <ThemedText style={[styles.description, { color: colors.gray }]}>
          Aquí podrás ver y gestionar todas las conversaciones activas con tus contactos.
        </ThemedText>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
}) 