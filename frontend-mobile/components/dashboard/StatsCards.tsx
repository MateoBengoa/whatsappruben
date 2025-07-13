import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useColorScheme } from 'react-native'
import { ThemedText } from '../ThemedText'
import { ThemedView } from '../ThemedView'
import { Colors } from '../../constants/Colors'

interface StatsCardsProps {
  analytics?: any
  isLoading?: boolean
}

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  color: string
}

function StatCard({ title, value, subtitle, color }: StatCardProps) {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
    <ThemedView style={[styles.statCard, { borderColor: colors.border }]}>
      <ThemedText style={styles.statTitle}>{title}</ThemedText>
      <ThemedText style={[styles.statValue, { color }]}>{value}</ThemedText>
      <ThemedText style={[styles.statSubtitle, { color: colors.gray }]}>{subtitle}</ThemedText>
    </ThemedView>
  )
}

export function StatsCards({ analytics, isLoading }: StatsCardsProps) {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  if (isLoading) {
    return (
      <View style={styles.container}>
        {[...Array(4)].map((_, i) => (
          <ThemedView key={i} style={[styles.statCard, styles.loadingCard, { borderColor: colors.border }]}>
            <View style={[styles.loadingBar, { backgroundColor: colors.lightGray }]} />
            <View style={[styles.loadingBar, styles.loadingBarLarge, { backgroundColor: colors.lightGray }]} />
            <View style={[styles.loadingBar, { backgroundColor: colors.lightGray }]} />
          </ThemedView>
        ))}
      </View>
    )
  }

  if (!analytics) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={[styles.errorText, { color: colors.gray }]}>
          No hay datos disponibles
        </ThemedText>
      </ThemedView>
    )
  }

  const stats = [
    {
      title: 'Contactos',
      value: analytics.total_contacts?.toString() || '0',
      subtitle: `${analytics.active_contacts || 0} activos`,
      color: colors.fitness,
    },
    {
      title: 'Mensajes',
      value: analytics.total_messages?.toString() || '0',
      subtitle: `${analytics.ai_responses || 0} de IA`,
      color: '#3b82f6',
    },
    {
      title: 'Respuesta',
      value: `${Math.round(analytics.response_rate || 0)}%`,
      subtitle: 'Tasa de éxito',
      color: colors.success,
    },
    {
      title: 'Tiempo',
      value: `${analytics.avg_response_time || 0}s`,
      subtitle: 'Promedio',
      color: colors.warning,
    },
  ]

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          color={stat.color}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  loadingCard: {
    justifyContent: 'center',
  },
  loadingBar: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
    width: '70%',
  },
  loadingBarLarge: {
    height: 20,
    width: '50%',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
}) 