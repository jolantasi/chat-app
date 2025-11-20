# Chat App (React Native, Expo & Firebase)

A real-time mobile chat application built with **React Native**, **Expo**, and **Firebase**.

This project demonstrates navigation, dynamic styling, offline-first behavior, device API integration, and Firebase services.

Users can:

- Enter a display name
- Choose a background color
- Send and receive messages in real time
- Share images (camera or library)
- Share their location (map preview included)
- Continue reading cached messages while offline

---

## 📱 Features

### 🧑‍💬 User Experience

- Start screen with name input and color selection
- Anonymous sign-in using **Firebase Authentication**
- Personalized chat background color

### 💬 Chat Functionality

- Real-time messaging via **Cloud Firestore**
- Send images (camera or library)
- Share current location (displayed via **react-native-maps**)
- Messages synced and stored in Firestore

### 📡 Offline Support

- Network detection using `@react-native-community/netinfo`
- Firestore network automatically disabled when offline
- Local caching with **AsyncStorage**
- When offline:
  - Chat becomes read-only
  - Input toolbar is hidden
  - Cached messages are loaded instantly

### 📸 Custom Actions

- “+” ActionSheet with options:
  - Choose From Library
  - Take Picture
  - Send Location

---

## 🧩 Technologies Used

- React Native (Expo)
- React Navigation (Native Stack)
- Gifted Chat
- Firebase Authentication (Anonymous)
- Cloud Firestore
- Firebase Storage
- Expo Image Picker
- Expo Location
- AsyncStorage
- React Native Maps
- React Native Gesture Handler
- React Native Safe Area Context
- @expo/react-native-action-sheet

---

## 🚀 Getting Started

### 1. Development Environment Setup

Before running the app, install:

- Node.js ≥ 18
- npm
- Git
- Android Studio (for Android emulator)
- Xcode (for iOS simulator — macOS only)
- Expo Go app (optional, for running on a device)

Install Expo SDK dependencies:

```bash
npx expo install
```

### 2. Clone the Repository

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 3. Firebase Configuration

This app uses:

Firebase Authentication (Anonymous)
Cloud Firestore
Firebase Storage

Step 1 — Create a Firebase project
Go to: https://console.firebase.google.com
Click Add project
Add a Web app
Copy the Firebase config object.

Step 2 — Enable Authentication
Go to Build → Authentication
Click Get started
Enable Anonymous login

Step 3 — Enable Firestore
Go to Build → Firestore Database
Click Create
Choose Start in test mode (for development)

Step 4 — Enable Storage
Go to Build → Storage
Click Get started

Step 5 — Add your Firebase config to the project
In App.js and Chat.js, replace:

```bash
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### 4. Required Libraries

Install everything with:

```bash
npm install
```

If you need to install manually:

```bash
# Navigation
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context

# Gesture handler & action sheet
npm install react-native-gesture-handler
npm install @expo/react-native-action-sheet

# Firebase
npm install firebase

# Chat UI
npm install react-native-gifted-chat

# Network detection
npm install @react-native-community/netinfo

# AsyncStorage
npm install @react-native-async-storage/async-storage

# Expo APIs
npx expo install expo-image-picker
npx expo install expo-location

# Maps
npx expo install react-native-maps
```

### 5. Run the App

Start Expo:

```bash
npx expo start
```

Then:
Press a → open on Android emulator
Press i → open on iOS simulator
Scan QR code → open on physical device with Expo Go

### 📂 Project Structure

```bash
.
├── App.js
└── components/
    ├── Start.js
    ├── Chat.js
    └── CustomActions.js
```

App.js — initializes Firebase, navigation, online/offline logic
Start.js — name & background selection, anonymous login
Chat.js — real-time chat, Firestore listener, offline caching, maps
CustomActions.js — image picker, camera, location sending

## 🧠 Learning Goals

Implement screen-to-screen navigation
Authenticate users anonymously
Store & sync messages with Firestore
Upload media to Firebase Storage
Access device APIs (camera, library, location)
Render custom chat UIs (images/maps)
Implement offline-first logic
Manage React hooks and real-time listeners

## 📋 Requirements

Node.js ≥ 18
npm
Android Studio (with at least one AVD)
Xcode (optional, macOS only)
Expo Go app (optional)

## 🧑‍💻 Author

Jolanta Simkute
