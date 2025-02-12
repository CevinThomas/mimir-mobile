import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Start from './views/Start'
import Login from './views/Login'
import SignUp from './views/SignUp'
import SignUpConfirmation from './views/SignUpConfirmation'
import Home from './views/Home'
import { useAuthContext } from './context/AuthContext'
import Deck from './views/Deck'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Decks from './views/Decks'
import DeckSession from './views/DeckSession'
import Profile from './views/Profile'
import CreateDeck from './views/CreateDeck'
import CreateCard from './views/CreateCard'
import ViewAllDecks from './views/ViewAllDecks'
import { useTheme } from './context/ThemeContext'
import { Button } from 'react-native'
import { getColorProperty } from './helpers'

const Stack = createNativeStackNavigator(RootStack)
const Tab = createBottomTabNavigator(TabStack)

function RootStack() {
  const { theme, toggleTheme } = useTheme()

  const HeaderButton = () => {
    return <Button title="Change theme" onPress={toggleTheme} />
  }
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: {
          backgroundColor: getColorProperty(theme, 'background')
        },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        headerRight: () => <HeaderButton />
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
  const { theme, toggleTheme } = useTheme()

  const HeaderButton = () => {
    return <Button title="Change theme" onPress={toggleTheme} />
  }
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: getColorProperty(theme, 'background') },
        headerTitle: '',
        headerBackButtonDisplayMode: 'minimal',
        headerRight: () => <HeaderButton />
      }}
    >
      <Stack.Screen name="Home" component={TabStack} />
      <Stack.Screen name="Deck" component={Deck} options={{ headerShown: false }} />
      <Stack.Screen
        name="DeckSession"
        component={DeckSession}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="CreateDeck"
        component={CreateDeck}
        options={{ gestureEnabled: false, headerBackVisible: false }}
      />
      <Stack.Screen name="CreateCard" component={CreateCard} options={{ gestureEnabled: false }} />
      <Stack.Screen name="ViewAllDecks" component={ViewAllDecks} />
    </Stack.Navigator>
  )
}

function TabStack() {
  const { theme, toggleTheme } = useTheme()

  const HeaderButton = () => {
    return <Button title="Change theme" onPress={toggleTheme} />
  }
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: '',
        tabBarStyle: {
          backgroundColor: getColorProperty(theme, 'background'),
          borderTopWidth: 0
        },
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Home') {
            iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline'
          } else if (route.name === 'Settings') {
            iconName = focused ? 'ios-list' : 'ios-list-outline'
          }

          // You can return any component that you like here!
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray'
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Decks" component={Decks} />
      <Tab.Screen name="Settings" component={Profile} />
    </Tab.Navigator>
  )
}

export default function App() {
  const { state, dispatch } = useAuthContext()
  return (
    <NavigationContainer>
      {state.isLoggedIn ? <LoggedInStack /> : <RootStack />}
    </NavigationContainer>
  )
}
