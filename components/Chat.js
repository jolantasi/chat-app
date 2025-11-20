// Chat.js
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStorage } from 'firebase/storage';

import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

// ---------------------- Firebase Initialization ---------------------- //
// Used as a fallback if no db is passed in via props (e.g., in tests or other setups)
const firebaseConfig = {
  apiKey: 'AIzaSyAAoICpor5cwqcGR0IQIvoGIDRnyxz7M_k',
  authDomain: 'chat-app-f4e38.firebaseapp.com',
  projectId: 'chat-app-f4e38',
  storageBucket: 'chat-app-f4e38.firebasestorage.app',
  messagingSenderId: '550389727107',
  appId: '1:550389727107:web:59186b29618d18195200b6',
  measurementId: 'G-W3XZT0ZS77',
};

// Initialize Firebase app only once (avoids re-initialization on hot reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Firestore & Storage fallbacks
const dbDefault = getFirestore(app);
const storageDefault = getStorage(app);

// Local storage key for offline messages
const MESSAGES_STORAGE_KEY = 'chat_messages';

// ---------------------- Chat Component ---------------------- //
export default function Chat({ route, navigation, db, isConnected }) {
  const { name, color, userId } = route.params;
  const database = db || dbDefault;

  // ---------------------- UI Title ---------------------- //
  useLayoutEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  // ---------------------- Messages State ---------------------- //
  const [messages, setMessages] = useState([]);

  // Cache messages locally for offline use
  const cacheMessages = async (msgs) => {
    try {
      await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(msgs));
    } catch (error) {
      console.log('Error caching messages:', error);
    }
  };

  // Load cached messages when offline or on startup
  const loadCachedMessages = async () => {
    try {
      const cached = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached).map((msg) => ({
          ...msg,
          // Ensure createdAt is a Date instance
          createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
        }));
        setMessages(parsed);
      }
    } catch (error) {
      console.log('Error loading cached messages:', error);
    }
  };

  // ---------------------- Firestore Listener ---------------------- //
  useEffect(() => {
    let unsubscribe;

    if (isConnected) {
      // Listen to messages in Firestore in reverse chronological order
      const messagesQuery = query(
        collection(database, 'messages'),
        orderBy('createdAt', 'desc')
      );

      unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        const newMessages = querySnapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt
            ? doc.data().createdAt.toDate()
            : new Date(),
        }));

        setMessages(newMessages);
        cacheMessages(newMessages);
      });
    } else {
      // When offline, fall back to local cache
      loadCachedMessages();
    }

    // Clean up Firestore listener when component unmounts or connectivity changes
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [database, isConnected]);

  // ---------------------- Send Message ---------------------- //
  const onSend = async (newMessages = []) => {
    if (!isConnected) {
      console.log('Offline: message not sent');
      return;
    }

    // Optimistic UI update
    setMessages((prev) => GiftedChat.append(prev, newMessages));

    const messageToSave = {
      ...newMessages[0],
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(database, 'messages'), messageToSave);
      console.log('Message saved to Firestore');
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  // ---------------------- Custom Actions (image/location) ---------------------- //
  const renderCustomActions = (props) => (
    <CustomActions
      {...props}
      storage={storageDefault}
      userId={userId}
      user={{ _id: userId, name }}
      onSend={onSend}
      isConnected={isConnected}
    />
  );

  // ---------------------- Custom View (Map for locations) ---------------------- //
  const renderCustomView = (props) => {
    const { currentMessage } = props;

    if (currentMessage && currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }

    return null;
  };

  // ---------------------- Bubble Styling ---------------------- //
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: '#000' },
        left: { backgroundColor: '#FFF' },
      }}
    />
  );

  // ---------------------- Input Toolbar ---------------------- //
  const renderInputToolbar = (props) => {
    // Hide input when offline (read-only mode)
    if (isConnected === false) return null;
    return <InputToolbar {...props} />;
  };

  // ---------------------- Render UI ---------------------- //
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        user={{ _id: userId, name }}
        keyboardShouldPersistTaps="handled"
        alwaysShowSend={isConnected === true}
      />

      {/* Helper on Android to avoid keyboard covering input */}
      {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
    </SafeAreaView>
  );
}

// ---------------------- Styles ---------------------- //
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
