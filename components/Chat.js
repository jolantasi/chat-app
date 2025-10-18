import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Chat({ route, navigation }) {
  const { name, color } = route.params;

  // Set the navigation bar title to the user's name
  useLayoutEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Text style={styles.welcome}>Welcome, {name}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcome: { fontSize: 24, color: '#fff' },
});
