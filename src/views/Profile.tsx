import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native'
import { useAuthContext } from '../context/AuthContext'
import * as SecureStore from 'expo-secure-store'
import { logout } from '../api/AuthApi'
import ThemeToggle from '../components/ThemeToggle'
import MainBackground from '../components/MainBackground'
import NormalText from '../components/Typography/NormalText'
import useErrorSnackbar from '../hooks/useErrorSnackbar'
import { getUsers } from '../api/UsersApi'

export default function Profile() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const { state, dispatch } = useAuthContext()
  const { showError, errorSnackbar } = useErrorSnackbar()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // Get email from SecureStore
      const storedEmail = await SecureStore.getItemAsync('email')
      if (storedEmail) {
        setEmail(storedEmail)
      }

      // Try to get user data from API
      try {
        const users = await getUsers()
        if (users && users.length > 0) {
          // Find the user with matching email or just take the first one
          const currentUser = storedEmail
            ? users.find((user) => user.email === storedEmail)
            : users[0]

          if (currentUser) {
            setName(currentUser.name || '')
          }
        }
      } catch (error) {
        console.log('Error fetching user data:', error)
      }
    } catch (error) {
      showError('Failed to load profile data')
      console.error(error)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchUserData()
    } catch (error) {
      showError('Failed to refresh profile data')
    } finally {
      setRefreshing(false)
    }
  }

  const onLogoutPress = async () => {
    try {
      await logout()
      await SecureStore.deleteItemAsync('jwt')
      await SecureStore.deleteItemAsync('rememberMe')
      await SecureStore.deleteItemAsync('email')
      await SecureStore.deleteItemAsync('password')
      dispatch({ type: 'LOG_OUT' })
    } catch (error) {
      showError('Failed to log out')
      console.error(error)
    }
  }

  return (
    <MainBackground>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <NormalText style={styles.avatarText}>
                  {name
                    ? name.charAt(0).toUpperCase()
                    : email
                      ? email.charAt(0).toUpperCase()
                      : '?'}
                </NormalText>
              </View>
            </View>

            <View style={styles.profileInfo}>
              <NormalText style={styles.nameText}>{name || 'User'}</NormalText>
              <NormalText style={styles.emailText}>{email || 'No email available'}</NormalText>
              <NormalText style={styles.statusText}>
                {state.isLoggedIn ? 'Logged in' : 'Not logged in'}
              </NormalText>
            </View>
          </View>

          <View style={styles.section}>
            <NormalText style={styles.sectionTitle}>Settings</NormalText>
            <View style={styles.settingItem}>
              <NormalText>Theme</NormalText>
              <ThemeToggle />
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress}>
            <NormalText style={styles.logoutText}>Log out</NormalText>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {errorSnackbar()}
    </MainBackground>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: 16
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)'
  },
  avatarContainer: {
    marginRight: 16
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold'
  },
  profileInfo: {
    flex: 1
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  emailText: {
    fontSize: 16,
    marginBottom: 4,
    opacity: 0.7
  },
  statusText: {
    fontSize: 14,
    opacity: 0.5
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)'
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold'
  }
})
