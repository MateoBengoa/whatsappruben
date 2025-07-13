import React from 'react'
import { StyleSheet, ScrollView, TouchableOpacity, View, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from 'react-native'
import { ThemedText } from '../../components/ThemedText'
import { ThemedView } from '../../components/ThemedView'
import { Colors } from '../../constants/Colors'

export default function SettingsScreen() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const [aiEnabled, setAiEnabled] = React.useState(true)
  const [notifications, setNotifications] = React.useState(true)

  const settingSections = [
    {
      title: 'IA y Automatización',
      items: [
        {
          title: 'IA Habilitada',
          subtitle: 'Respuestas automáticas del bot',
          type: 'toggle',
          value: aiEnabled,
          onValueChange: setAiEnabled,
        },
        {
          title: 'Temperatura IA',
          subtitle: 'Creatividad de las respuestas: 0.7',
          type: 'setting',
        },
        {
          title: 'Delay de Respuesta',
          subtitle: '2-8 segundos',
          type: 'setting',
        },
      ]
    },
    {
      title: 'Notificaciones',
      items: [
        {
          title: 'Notificaciones Push',
          subtitle: 'Nuevos mensajes y actividad',
          type: 'toggle',
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          title: 'Sonidos',
          subtitle: 'Alertas de audio',
          type: 'setting',
        },
      ]
    },
    {
      title: 'Datos y Sincronización',
      items: [
        {
          title: 'Sincronizar Datos',
          subtitle: 'Última sincronización: hace 5 min',
          type: 'action',
        },
        {
          title: 'Limpiar Caché',
          subtitle: 'Liberar espacio de almacenamiento',
          type: 'action',
        },
      ]
    },
    {
      title: 'Información',
      items: [
        {
          title: 'Versión de la App',
          subtitle: '1.0.0',
          type: 'info',
        },
        {
          title: 'Estado del Servidor',
          subtitle: '🟢 Conectado',
          type: 'info',
        },
      ]
    }
  ]

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Configuración</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.gray }]}>
          Ajustes del Bot Rubén
        </ThemedText>
      </ThemedView>

      <ScrollView style={styles.scrollView}>
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: colors.gray }]}>
              {section.title}
            </ThemedText>
            
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[styles.settingItem, { backgroundColor: colors.lightGray }]}
                disabled={item.type === 'info'}
              >
                <View style={styles.settingContent}>
                  <ThemedText style={styles.settingTitle}>{item.title}</ThemedText>
                  <ThemedText style={[styles.settingSubtitle, { color: colors.gray }]}>
                    {item.subtitle}
                  </ThemedText>
                </View>
                
                {item.type === 'toggle' && item.onValueChange && (
                  <Switch
                    value={item.value}
                    onValueChange={item.onValueChange}
                    thumbColor={item.value ? colors.fitness : colors.gray}
                    trackColor={{ false: colors.border, true: colors.fitness + '50' }}
                  />
                )}
                
                {item.type === 'setting' && (
                  <ThemedText style={[styles.chevron, { color: colors.gray }]}>
                    ›
                  </ThemedText>
                )}
                
                {item.type === 'action' && (
                  <ThemedText style={[styles.chevron, { color: colors.fitness }]}>
                    ›
                  </ThemedText>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
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
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 2,
    borderRadius: 8,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}) 