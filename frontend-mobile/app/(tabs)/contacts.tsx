import React from 'react'
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { contactsApi } from '../../lib/api'
import { ThemedText } from '../../components/ThemedText'
import { ThemedView } from '../../components/ThemedView'
import { Colors } from '../../constants/Colors'

export default function ContactsScreen() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: contactsApi.getAll,
  })

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Contactos</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.gray }]}>
          {contacts?.length || 0} contactos totales
        </ThemedText>
      </ThemedView>

      <ScrollView style={styles.scrollView}>
        {isLoading ? (
          <View style={styles.loading}>
            <ThemedText style={{ color: colors.gray }}>Cargando contactos...</ThemedText>
          </View>
        ) : (
          contacts?.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={[styles.contactItem, { borderBottomColor: colors.border }]}
            >
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactName}>
                  {contact.name || 'Sin nombre'}
                </ThemedText>
                <ThemedText style={[styles.contactPhone, { color: colors.gray }]}>
                  {contact.phone_number}
                </ThemedText>
              </View>
              <View style={styles.contactStatus}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: contact.ai_enabled ? colors.success : colors.gray }
                ]} />
                <ThemedText style={[styles.statusText, { color: colors.gray }]}>
                  {contact.ai_enabled ? 'IA Activa' : 'IA Pausada'}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loading: {
    padding: 20,
    alignItems: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
  },
  contactStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
  },
}) 