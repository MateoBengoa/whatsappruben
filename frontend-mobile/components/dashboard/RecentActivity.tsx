import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useColorScheme } from 'react-native'
import { ThemedText } from '../ThemedText'
import { ThemedView } from '../ThemedView'
import { Colors } from '../../constants/Colors'

const mockActivity = [
  {
    id: 1,
    contact: 'Juan Pérez',
    message: 'Mensaje recibido',
    time: 'Hace 2 min',
    type: 'incoming'
  },
  {
    id: 2,
    contact: 'María García',
    message: 'IA respondió automáticamente',
    time: 'Hace 5 min',
    type: 'outgoing'
  },
  {
    id: 3,
    contact: 'Carlos López',
    message: 'Nuevo contacto agregado',
    time: 'Hace 10 min',
    type: 'system'
  }
]

export function RecentActivity() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
    <ThemedView style={styles.container}>
      {mockActivity.map((activity) => (
        <View key={activity.id} style={[styles.activityItem, { borderBottomColor: colors.border }]}>
          <View style={styles.activityContent}>
            <View style={styles.activityHeader}>
              <ThemedText style={styles.contactName}>{activity.contact}</ThemedText>
              <ThemedText style={[styles.activityTime, { color: colors.gray }]}>
                {activity.time}
              </ThemedText>
            </View>
            <ThemedText style={[styles.activityMessage, { color: colors.gray }]}>
              {activity.message}
            </ThemedText>
          </View>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(activity.type, colors) }
          ]} />
        </View>
      ))}
    </ThemedView>
  )
}

function getStatusColor(type: string, colors: any) {
  switch (type) {
    case 'incoming':
      return colors.fitness
    case 'outgoing':
      return colors.success
    case 'system':
      return colors.gray
    default:
      return colors.gray
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
  },
  activityTime: {
    fontSize: 12,
  },
  activityMessage: {
    fontSize: 14,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 12,
  },
}) 