// CustomActions.js
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// ---------- Core CustomActions component (class, used by GiftedChat) ----------
class CustomActions extends React.Component {
  // Show action sheet with media/location options
  onActionPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;

    const { showActionSheetWithOptions } = this.props;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            await this.pickImage();
            return;
          case 1:
            await this.takePhoto();
            return;
          case 2:
            await this.getLocation();
            return;
          default:
            return;
        }
      }
    );
  };

  // Pick image from media library and send as message
  pickImage = async () => {
    const { isConnected } = this.props;

    if (!isConnected) {
      Alert.alert('Offline', 'Internet connection is required.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Library access is required.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset) return;

      const imageUrl = await this.uploadImage(asset.uri);
      this.sendImageMessage(imageUrl);
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Could not pick image.');
    }
  };

  // Take photo with camera and send as message
  takePhoto = async () => {
    const { isConnected } = this.props;

    if (!isConnected) {
      Alert.alert('Offline', 'Internet connection is required.');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera access is required.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.7,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset) return;

      const imageUrl = await this.uploadImage(asset.uri);
      this.sendImageMessage(imageUrl);
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Could not take photo.');
    }
  };

  // Get current location and send as message
  getLocation = async () => {
    const { isConnected } = this.props;

    if (!isConnected) {
      Alert.alert('Offline', 'Internet connection is required.');
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Location access is required.');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      if (!location) return;

      this.sendLocationMessage(location);
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Could not get location.');
    }
  };

  // Upload image to Firebase Storage and return a public URL
  uploadImage = async (uri) => {
    const { storage, userId } = this.props;

    const response = await fetch(uri);
    const blob = await response.blob();

    const filename = `${userId}-${Date.now()}.jpg`;
    const imageRef = ref(storage, `images/${filename}`);

    await uploadBytes(imageRef, blob);

    return await getDownloadURL(imageRef);
  };

  // Send an image message via GiftedChat
  sendImageMessage = (imageUrl) => {
    this.props.onSend([
      {
        _id: Date.now(),
        createdAt: new Date(),
        user: this.props.user,
        image: imageUrl,
      },
    ]);
  };

  // Send a location message via GiftedChat
  sendLocationMessage = (location) => {
    const { onSend, user } = this.props;

    if (!onSend) return;

    onSend([
      {
        _id: Date.now(),
        createdAt: new Date(),
        user: {
          _id: user._id,
          name: user.name,
          avatar: user.avatar || null,
        },
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      },
    ]);
  };

  // Render the "+" button that opens the action sheet
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.wrapper}
          onPress={this.onActionPress}
          accessibilityRole="button"
          accessibilityLabel="More actions"
          accessibilityHint="Open menu for media options"
        >
          <Text style={styles.iconText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 10,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

// ---------- Hook wrapper to inject ActionSheet into class ----------
export default function CustomActionsWrapper(props) {
  const { showActionSheetWithOptions } = useActionSheet();

  return (
    <CustomActions
      {...props}
      showActionSheetWithOptions={showActionSheetWithOptions}
    />
  );
}
