import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Start from './views/Start'
import Login from './views/Login'
import SignUp from './views/SignUp'
import SignUpConfirmation from './views/SignUpConfirmation'
import Home from './views/Home'
import { AuthProvider, useAuthContext } from './context/AuthContext'
import Profile from './views/Profile'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Stack = createNativeStackNavigator(RootStack)
const Tab = createBottomTabNavigator(LoggedInStack)

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: { backgroundColor: 'tomato' }
      }}
    >
      <Stack.Screen name="Welcome" component={Start} options={{ title: 'Welcome' }} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignUpConfirmation" component={SignUpConfirmation} />
    </Stack.Navigator>
  )
}

function LoggedInStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
      <Tab.Screen name="Profile" component={Profile} />
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
