import React, { useState } from 'react';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';

export default function Start({ navigation }) {
  // ---------------------- State ---------------------- //
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  // Available background color options
  const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

  // ---------------------- Anonymous Login & Navigation ---------------------- //
  const handleStartChatting = () => {
    const auth = getAuth();

    // Basic validation
    if (!name) {
      alert('Please enter your name!');
      return;
    }

    if (!color) {
      alert('Please select a background color!');
      return;
    }

    // Sign in user anonymously and navigate to Chat
    signInAnonymously(auth)
      .then((userCredential) => {
        const user = userCredential.user;

        navigation.navigate('Chat', {
          userId: user.uid,
          name,
          color,
        });
      })
      .catch((error) => {
        console.error('Anonymous login failed:', error);
      });
  };

  // ---------------------- UI ---------------------- //
  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* App title */}
        <Text style={styles.title}>Chat App</Text>

        {/* Card with input, color selection, and button */}
        <View style={styles.box}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
            placeholderTextColor="rgba(117, 112, 131, 0.5)"
          />

          <Text style={styles.chooseColorText}>Choose Background Color:</Text>

          <View style={styles.colorContainer}>
            {colors.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorCircle,
                  { backgroundColor: c },
                  color === c ? styles.selected : null, // Highlight selected color
                ]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleStartChatting}
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

// ---------------------- Styles ---------------------- //
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 80,
  },
  box: {
    backgroundColor: 'white',
    width: '88%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
    borderRadius: 10,
  },
  input: {
    height: 50,
    width: '88%',
    borderColor: '#757083',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 0.5,
  },
  chooseColorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginTop: 20,
    marginBottom: 10,
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '60%',
    marginBottom: 20,
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  selected: {
    borderWidth: 3,
    borderColor: '#757083',
  },
  button: {
    backgroundColor: '#757083',
    width: '88%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
