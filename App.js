// App.js
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { initializeApp } from 'firebase/app';
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore';

import { useNetInfo } from '@react-native-community/netinfo';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import Start from './components/Start';
import Chat from './components/Chat';

// Firebase project configuration used to connect this app to Firestore
const firebaseConfig = {
  apiKey: 'AIzaSyAAoICpor5cwqcGR0IQIvoGIDRnyxz7M_k',
  authDomain: 'chat-app-f4e38.firebaseapp.com',
  projectId: 'chat-app-f4e38',
  storageBucket: 'chat-app-f4e38.firebasestorage.app',
  messagingSenderId: '550389727107',
  appId: '1:550389727107:web:59186b29618d18195200b6',
  measurementId: 'G-W3XZT0ZS77',
};

// Initialize Firebase & Firestore once at the top level
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Stack = createNativeStackNavigator();

export default function App() {
  const connectionStatus = useNetInfo();

  // Enable/disable Firestore's network based on connectivity status
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection Lost!');
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      < ActionSheetProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {/* Start screen: user chooses name/background color */}
            <Stack.Screen name="Start" component={Start} />
            {/* Chat screen: pass Firestore instance and connection state down as props */}
            <Stack.Screen name="Chat">
              {(props) => (
                <Chat
                  {...props}
                  db={db}
                  app={app}
                  isConnected={connectionStatus.isConnected}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}
