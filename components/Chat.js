import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

export default function Chat({ route, navigation }) {
  const { name, color } = route.params;

  // Set navigation title
  useLayoutEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  // Messages state
  const [messages, setMessages] = useState([]);

  // Load initial messages
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'This is a system message',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  // Handle sending messages
  const onSend = (newMessages = []) => {
    setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages));
  };

  // Bubble styling
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: '#000' },
        left: { backgroundColor: '#FFF' },
      }}
    />
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: color }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90} // Adjust if header exists
    >
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        renderBubble={renderBubble}
        user={{ _id: 1, name }}
        keyboardShouldPersistTaps="handled"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
