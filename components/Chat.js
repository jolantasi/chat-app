import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------------------- Firebase Initialization ---------------------- //
const firebaseConfig = {
  apiKey: 'AIzaSyAAoICpor5cwqcGR0IQIvoGIDRnyxz7M_k',
  authDomain: 'chat-app-f4e38.firebaseapp.com',
  projectId: 'chat-app-f4e38',
  storageBucket: 'chat-app-f4e38.firebasestorage.app',
  messagingSenderId: '550389727107',
  appId: '1:550389727107:web:59186b29618d18195200b6',
  measurementId: 'G-W3XZT0ZS77',
};

// ✅ Initialize Firebase app only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// ✅ Auth with persistence (so users stay logged in)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// ✅ Firestore initialization
const dbDefault = getFirestore(app);

// 🔑 Storage key for cached messages
const MESSAGES_STORAGE_KEY = 'chat_messages';

// ---------------------- Chat Component ---------------------- //
export default function Chat({ route, navigation, db, app, isConnected }) {
  console.log('isConnected in Chat:', isConnected);
  const { name, color, userId } = route.params;
  const database = db || dbDefault;

  // ---------------------- Navigation Title ---------------------- //
  useLayoutEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  // ---------------------- Messages State ---------------------- //
  const [messages, setMessages] = useState([]);

  // Helper: cache messages locally
  const cacheMessages = async (msgs) => {
    try {
      await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(msgs));
    } catch (error) {
      console.log('Error caching messages:', error);
    }
  };

  // Helper: load messages from cache when offline
  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
      if (cachedMessages) {
        const parsed = JSON.parse(cachedMessages).map((msg) => ({
          ...msg,
          createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
        }));
        setMessages(parsed);
      }
    } catch (error) {
      console.log('Error loading cached messages:', error);
    }
  };

  // ---------------------- Load Messages (online/offline) ---------------------- //
  useEffect(() => {
    let unsubscribe;

    if (isConnected) {
      // ✅ ONLINE: listen to Firestore and cache messages
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
        cacheMessages(newMessages); // ✅ cache latest messages
      });
    } else {
      // ❌ OFFLINE: load cached messages
      loadCachedMessages();
    }

    // Cleanup Firestore listener when unmounting or going offline
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [database, isConnected]);

  // ---------------------- Send Message Handler ---------------------- //
  const onSend = async (newMessages = []) => {
  if (!isConnected) {
    console.log("Offline: message not sent");
    return; // prevent saving to Firestore
  }

  setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));

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

// ---------------------- InputToolbar (hide when offline) ---------------------- //
  const renderInputToolbar = (props) => {
  // Show input ONLY when we are explicitly online
  if (isConnected === true) {
    return <InputToolbar {...props} />;
  }

  // Offline or unknown -> hide
  return null;
};

  // ---------------------- JSX Render ---------------------- //
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: color }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        style={{ flex: 1 }}
      >
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          user={{ _id: userId, name }}
          keyboardShouldPersistTaps="handled"
          alwaysShowSend={isConnected}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---------------------- Styles ---------------------- //
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
