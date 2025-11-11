import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Données de démonstration
  const stats = {
    totalCrops: 8,
    activeCrops: 5,
    totalRevenue: 125000,
    totalExpenses: 45000,
    profit: 80000,
    totalArea: 15.5,
  };

  const recentCrops = [
    { id: '1', name: 'Tomates', status: 'active', health: 85, area: 2.5 },
    { id: '2', name: 'Pommes de terre', status: 'active', health: 92, area: 3.0 },
    { id: '3', name: 'Blé', status: 'harvest', health: 78, area: 5.0 },
  ];

  const quickActions = [
    { id: '1', title: 'Ajouter Culture', icon: 'add-circle', color: '#4CAF50', route: '/crops/add' },
    { id: '2', title: 'Transaction', icon: 'cash', color: '#2196F3', route: '/finance' },
    { id: '3', title: 'Météo', icon: 'cloud', color: '#FF9800', route: '/weather' },
    { id: '4', title: 'Carte', icon: 'map', color: '#9C27B0', route: '/map' },
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>{user?.name || 'Agriculteur'}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle" size={40} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.primaryCard]}>
          <Ionicons name="leaf" size={32} color="#fff" />
          <Text style={styles.statValue}>{stats.activeCrops}</Text>
          <Text style={styles.statLabel}>Cultures Actives</Text>
        </View>
        <View style={[styles.statCard, styles.secondaryCard]}>
          <Ionicons name="trending-up" size={32} color="#fff" />
          <Text style={styles.statValue}>{stats.profit / 1000}K</Text>
          <Text style={styles.statLabel}>Profit (DA)</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.accentCard]}>
          <Ionicons name="resize" size={32} color="#fff" />
          <Text style={styles.statValue}>{stats.totalArea}</Text>
          <Text style={styles.statLabel}>Hectares</Text>
        </View>
        <View style={[styles.statCard, styles.warningCard]}>
          <Ionicons name="calendar" size={32} color="#fff" />
          <Text style={styles.statValue}>{stats.totalCrops}</Text>
          <Text style={styles.statLabel}>Total Cultures</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions Rapides</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon as any} size={28} color="#fff" />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Financial Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vue Financière</Text>
        <View style={styles.financeCard}>
          <View style={styles.financeRow}>
            <View style={styles.financeItem}>
              <Ionicons name="arrow-up-circle" size={24} color="#4CAF50" />
              <View style={styles.financeInfo}>
                <Text style={styles.financeLabel}>Revenus</Text>
                <Text style={[styles.financeValue, { color: '#4CAF50' }]}>
                  {stats.totalRevenue.toLocaleString()} DA
                </Text>
              </View>
            </View>
            <View style={styles.financeItem}>
              <Ionicons name="arrow-down-circle" size={24} color="#F44336" />
              <View style={styles.financeInfo}>
                <Text style={styles.financeLabel}>Dépenses</Text>
                <Text style={[styles.financeValue, { color: '#F44336' }]}>
                  {stats.totalExpenses.toLocaleString()} DA
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.profitContainer}>
            <Text style={styles.profitLabel}>Bénéfice Net</Text>
            <Text style={styles.profitValue}>{stats.profit.toLocaleString()} DA</Text>
          </View>
        </View>
      </View>

      {/* Recent Crops */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cultures Récentes</Text>
          <TouchableOpacity onPress={() => router.push('/crops')}>
            <Text style={styles.viewAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        {recentCrops.map((crop) => (
          <View key={crop.id} style={styles.cropCard}>
            <View style={styles.cropHeader}>
              <View style={styles.cropInfo}>
                <Ionicons name="leaf" size={24} color="#4CAF50" />
                <View style={styles.cropDetails}>
                  <Text style={styles.cropName}>{crop.name}</Text>
                  <Text style={styles.cropArea}>{crop.area} hectares</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, crop.status === 'active' ? styles.activeStatus : styles.harvestStatus]}>
                <Text style={styles.statusText}>
                  {crop.status === 'active' ? 'Active' : 'Récolte'}
                </Text>
              </View>
            </View>
            <View style={styles.healthBar}>
              <View style={styles.healthBarBg}>
                <View style={[styles.healthBarFill, { width: `${crop.health}%` }]} />
              </View>
              <Text style={styles.healthText}>{crop.health}% Santé</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Weather Widget */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Météo Aujourd'hui</Text>
        <View style={styles.weatherCard}>
          <View style={styles.weatherMain}>
            <Ionicons name="sunny" size={64} color="#FF9800" />
            <View style={styles.weatherInfo}>
              <Text style={styles.temperature}>28°C</Text>
              <Text style={styles.weatherDesc}>Ensoleillé</Text>
            </View>
          </View>
          <View style={styles.weatherDetails}>
            <View style={styles.weatherDetail}>
              <Ionicons name="water" size={20} color="#2196F3" />
              <Text style={styles.weatherDetailText}>65%</Text>
            </View>
            <View style={styles.weatherDetail}>
              <Ionicons name="speedometer" size={20} color="#9C27B0" />
              <Text style={styles.weatherDetailText}>1013 hPa</Text>
            </View>
            <View style={styles.weatherDetail}>
              <Ionicons name="navigate" size={20} color="#4CAF50" />
              <Text style={styles.weatherDetailText}>12 km/h</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryCard: {
    backgroundColor: '#4CAF50',
  },
  secondaryCard: {
    backgroundColor: '#2196F3',
  },
  accentCard: {
    backgroundColor: '#9C27B0',
  },
  warningCard: {
    backgroundColor: '#FF9800',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAll: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  financeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  financeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  financeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  financeInfo: {
    gap: 4,
  },
  financeLabel: {
    fontSize: 12,
    color: '#666',
  },
  financeValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profitContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  profitLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  profitValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  cropCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cropInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cropDetails: {
    gap: 4,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cropArea: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: '#E8F5E9',
  },
  harvestStatus: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  healthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  healthBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  healthBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  healthText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  weatherCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  weatherInfo: {
    gap: 4,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherDesc: {
    fontSize: 16,
    color: '#666',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weatherDetail: {
    alignItems: 'center',
    gap: 8,
  },
  weatherDetailText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
});
