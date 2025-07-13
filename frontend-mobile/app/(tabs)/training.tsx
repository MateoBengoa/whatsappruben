import React from 'react'
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { trainingDataApi } from '../../lib/api'
import { ThemedText } from '../../components/ThemedText'
import { ThemedView } from '../../components/ThemedView'
import { Colors } from '../../constants/Colors'

export default function TrainingScreen() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const { data: trainingData, isLoading } = useQuery({
    queryKey: ['training-data'],
    queryFn: trainingDataApi.getAll,
  })

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Entrenamiento IA</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.gray }]}>
          Datos para entrenar a Rubén
        </ThemedText>
      </ThemedView>

      <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.fitness }]}>
        <ThemedText style={styles.addButtonText}>+ Agregar Datos</ThemedText>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {isLoading ? (
          <View style={styles.loading}>
            <ThemedText style={{ color: colors.gray }}>Cargando datos...</ThemedText>
          </View>
        ) : (
          trainingData?.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.trainingItem, { backgroundColor: colors.lightGray }]}
            >
              <View style={styles.itemHeader}>
                <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
                <View style={[
                  styles.activeIndicator,
                  { backgroundColor: item.active ? colors.success : colors.gray }
                ]}>
                  <ThemedText style={styles.activeText}>
                    {item.active ? 'Activo' : 'Inactivo'}
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={[styles.itemCategory, { color: colors.gray }]}>
                Categoría: {item.category}
              </ThemedText>
              <ThemedText style={[styles.itemStats, { color: colors.gray }]}>
                {item.word_count} palabras • {item.tags?.join(', ')}
              </ThemedText>
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
  addButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loading: {
    padding: 20,
    alignItems: 'center',
  },
  trainingItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  activeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  itemCategory: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemStats: {
    fontSize: 12,
  },
}) 