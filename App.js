import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Start from './components/Start';
import Chat from './components/Chat';

// --- Firebase configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyAAoICpor5cwqcGR0IQIvoGIDRnyxz7M_k",
  authDomain: "chat-app-f4e38.firebaseapp.com",
  projectId: "chat-app-f4e38",
  storageBucket: "chat-app-f4e38.firebasestorage.app",
  messagingSenderId: "550389727107",
  appId: "1:550389727107:web:59186b29618d18195200b6",
  measurementId: "G-W3XZT0ZS77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore database instance

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Start" component={Start} />

          {/* Pass Firestore database as a prop to Chat screen */}
          <Stack.Screen name="Chat">
            {props => <Chat {...props} db={db} app={app} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView> 
  );
}
