import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Start from './views/Start'
import Login from './views/Login'
import SignUp from './views/SignUp'
import SignUpConfirmation from './views/SignUpConfirmation'
import { useStoreContext } from './context/StoreContext'
import Deck from './views/Deck'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Decks from './views/Decks'
import DeckSession from './views/DeckSession'
import Profile from './views/Profile'
import CreateDeck from './views/CreateDeck'
import CreateCard from './views/CreateCard'
import Account from './views/Account'
import { Platform, View } from 'react-native'

import { getColorProperty } from './helpers'
import { useTheme } from './context/ThemeContext'
import DeckIcon from './svgs/DeckIcon'
import SettingsIcon from './svgs/SettingsIcon'
import SettingsIconFilled from './svgs/SettingsIconFilled'
import DeckIconFilled from './svgs/DeckIconFilled'
import HomeIconFilled from './svgs/HomeIconFilled'
import HomeIcon from './svgs/HomeIcon'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as NavigationBar from 'expo-navigation-bar'
import { setStatusBarHidden } from 'expo-status-bar'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function WelcomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal'
      }}
    >
      <Stack.Screen name="Welcome" component={Start} options={{ headerTitle: '' }} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen
        name="SignUpConfirmation"
        component={SignUpConfirmation}
        options={{ gestureEnabled: false, headerBackVisible: false, headerTitle: '' }}
      />
    </Stack.Navigator>
  )
}

function LoggedInStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Home" component={TabStack} />
      <Stack.Screen name="Deck" component={Deck} />
      <Stack.Screen
        name="DeckSession"
        component={DeckSession}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="CreateDeck" component={CreateDeck} />
      <Stack.Screen name="CreateCard" component={CreateCard} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  )
}

function TabStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: '',
        tabBarStyle: {
          backgroundColor: getColorProperty(undefined, 'darkest'),
          borderTopWidth: 0
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          const marginBottom = Platform.OS === 'android' ? 45 : 0
          if (route.name === 'Decks') {
            if (focused) {
              return (
                <View style={{ marginTop: 20, marginBottom }}>
                  <HomeIconFilled />
                </View>
              )
            }

            return (
              <View style={{ marginTop: 20, marginBottom }}>
                <HomeIcon />
              </View>
            )
          }

          if (route.name === 'Account') {
            if (focused) {
              return (
                <View style={{ marginTop: 20, marginBottom }}>
                  <DeckIconFilled />
                </View>
              )
            }

            return (
              <View style={{ marginTop: 20, marginBottom }}>
                <DeckIcon />
              </View>
            )
          }

          if (route.name === 'Settings') {
            if (focused) {
              return (
                <View style={{ marginTop: 20, marginBottom }}>
                  <SettingsIconFilled />
                </View>
              )
            }

            return (
              <View style={{ marginTop: 20, marginBottom }}>
                <SettingsIcon />
              </View>
            )
          }

          // You can return any component that you like here!
        }
      })}
    >
      <Tab.Screen name="Decks" component={Decks} />
      <Tab.Screen name="Account" component={Account} />
      <Tab.Screen name="Settings" component={Profile} />
    </Tab.Navigator>
  )
}

export default function App() {
  const { state, dispatch } = useStoreContext()
  const { theme } = useTheme()

  NavigationBar.setBackgroundColorAsync(getColorProperty(theme, 'background')) // `rgba(0,0,0,0.5)`
  setStatusBarHidden(true, 'none')
  return (
    <View style={{ flex: 1, backgroundColor: getColorProperty(theme, 'background') }}>
      <NavigationContainer>
        {state.isLoggedIn ? <LoggedInStack /> : <WelcomeStack />}
      </NavigationContainer>
    </View>
  )
}
