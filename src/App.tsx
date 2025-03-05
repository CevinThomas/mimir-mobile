import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Start from './views/Start'
import Login from './views/Login'
import SignUp from './views/SignUp'
import SignUpConfirmation from './views/SignUpConfirmation'
import Home from './views/Home'
import { useStoreContext } from './context/StoreContext'
import Deck from './views/Deck'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Decks from './views/Decks'
import DeckSession from './views/DeckSession'
import Profile from './views/Profile'
import CreateDeck from './views/CreateDeck'
import CreateCard from './views/CreateCard'
import ViewAllDecks from './views/ViewAllDecks'
import { View } from 'react-native'

import { getColorProperty } from './helpers'
import DeckIcon from './svgs/DeckIcon'
import HomeIcon from './svgs/HomeIcon'
import SettingsIcon from './svgs/SettingsIcon'
import DeckIconFilled from './svgs/DeckIconFilled'
import HomeIconFilled from './svgs/HomeIconFilled'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function WelcomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
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
      <Stack.Screen name="ViewAllDecks" component={ViewAllDecks} />
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
          if (route.name === 'Decks') {
            if (focused) {
              return (
                <View style={{ marginTop: 20 }}>
                  <DeckIconFilled />
                </View>
              )
            }

            return (
              <View style={{ marginTop: 20 }}>
                <DeckIcon fill={focused ? '' : '#FAF9F6'} />
              </View>
            )
          }

          if (route.name === 'Home') {
            if (focused) {
              return (
                <View style={{ marginTop: 20 }}>
                  <HomeIconFilled />
                </View>
              )
            }
            return (
              <View style={{ marginTop: 20 }}>
                <HomeIcon fill={focused ? '' : '#FAF9F6'} />
              </View>
            )
          }

          if (route.name === 'Settings') {
            return (
              <View style={{ marginTop: 20 }}>
                <SettingsIcon fill={focused ? '' : '#FAF9F6'} />
              </View>
            )
          }

          // You can return any component that you like here!
        }
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Decks" component={Decks} />
      <Tab.Screen name="Settings" component={Profile} />
    </Tab.Navigator>
  )
}

export default function App() {
  const { state, dispatch } = useStoreContext()
  return (
    <NavigationContainer>
      {state.isLoggedIn ? <LoggedInStack /> : <WelcomeStack />}
    </NavigationContainer>
  )
}
