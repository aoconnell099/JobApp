import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { 
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer
} from 'react-navigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Notifications } from 'expo';

import registerForNotifications from './services/push_notifications';
import store from './store'; 
import configureStore from './store';
import AuthScreen from './screens/AuthScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import MapScreen from './screens/MapScreen';
import DeckScreen from './screens/DeckScreen';
import SettingsScreen from './screens/SettingsScreen';
import ReviewScreen from './screens/ReviewScreen';

// TODO:
//  DONE  // Fix the navigation from reviewScreen to SettingsScreen.
//   Fix Bug: After you go to reviewJobs for the first time you can no longer drag the Swipe card when you press on the map. Works like it's supposed to before you go to the review screen for the first time. 
//   Above Bug may not matter once bottom change is implemented
//   --Not all jobs have properly formatted urls--Change the displayed picture to the company logo
//   Get the scroll view nested in the swipe card to work

export default class App extends React.Component {
  componentDidMount() {
    registerForNotifications();
    Notifications.addListener((notification) => {
      const { data: { text }, origin } = notification; // Same as const text = notification.data.text

      if (origin === 'received' && text) {
        Alert.alert(
          'New Push Notification',
          text,
          [{ text: 'Ok.' }]
        );
      }
    });
  }

  render() {
    const { persistor, store } = configureStore();
    const MainNavigator = createAppContainer(
      createBottomTabNavigator({
        welcome: {
          screen: WelcomeScreen,
          navigationOptions: { tabBarVisible: false }
        },
        auth: {
          screen: AuthScreen,
          navigationOptions: { tabBarVisible: false }
        },
        main: {
          navigationOptions: { tabBarVisible: false },
          screen: createBottomTabNavigator({
            map: MapScreen,
            deck: DeckScreen,
            review: {
              navigationOptions: { 
                title: 'Review Jobs',
                tabBarIcon: ({ tintColor }) => {
                  return <Icon name="favorite" size={30} color={tintColor} />;
                }
              },
              screen: createStackNavigator({
                
                review://{ 
                  ReviewScreen,
                  // navigationOptions: () => {
                  //   return {
                  //       title: 'Review Jobs',
                  // //       // headerRight: (
                  // //       //     <Button
                  // //       //         title="Settings" 
                  // //       //         onPress= {() => {navigation.navigate('settings')}} 
                  // //       //         backgroundColor="rgba(0,0,0,0)"
                  // //       //         color="rgba(0, 122, 255, 1)"
                  // //       //         headerStyle={{ marginTop: Platform.OS === 'android' ? 24 : 0 }}
                  // //       //     />
                  // //       // )
                  //    }   
                  // }},
                  settings: SettingsScreen
              })
            }
          }, {
            // tabBarPosition: 'bottom', --deprecated
            // swipeEnabled: false --android only
            tabBarOptions: {
              labelStyle: { fontSize: 12 }
            }
          })
        } 
      }) // Could do ,{defaultNavigationOptions: {tabBarVisible: false}} here instead of setting it individually
    );
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <MainNavigator />
        </PersistGate>
      </Provider>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
