import React from 'react'
import { StyleSheet, ScrollView, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '../../lib/api'
import { ThemedText } from '../../components/ThemedText'
import { ThemedView } from '../../components/ThemedView'
import { StatsCards } from '../../components/dashboard/StatsCards'
import { QuickActionButtons } from '../../components/dashboard/QuickActionButtons'
import { RecentActivity } from '../../components/dashboard/RecentActivity'
import { AIStatusBanner } from '../../components/dashboard/AIStatusBanner'
import { Colors } from '../../constants/Colors'
import { useColorScheme } from 'react-native'

export default function DashboardScreen() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const {
    data: analytics,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsApi.getData,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const handleRefresh = () => {
    refetch()
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={handleRefresh}
            tintColor={colors.fitness}
          />
        }
      >
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Bot Rubén</ThemedText>
          <ThemedText style={styles.subtitle}>Panel de Control 💪</ThemedText>
        </ThemedView>

        {/* AI Status Banner */}
        <AIStatusBanner />

        {/* Stats Cards */}
        <StatsCards analytics={analytics} isLoading={isLoading} />

        {/* Quick Actions */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Acciones Rápidas</ThemedText>
          <QuickActionButtons />
        </ThemedView>

        {/* Recent Activity */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Actividad Reciente</ThemedText>
          <RecentActivity />
        </ThemedView>

        {/* Footer */}
        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Bot de WhatsApp v1.0.0
          </ThemedText>
          <ThemedText style={[styles.footerText, { color: colors.fitness }]}>
            Entrenador Fitness IA
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    opacity: 0.7,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.6,
  },
}) 