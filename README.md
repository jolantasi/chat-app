# Chat App (React Native)

A mobile chat application built with **React Native** and **Expo**, allowing users to enter their name, select a background color, and start chatting.

This project demonstrates React Navigation, dynamic styling, and user input handling in a React Native environment.

---

## 📱 Features

- User can enter their name on the Start screen.
- User can choose a custom background color for the chat.
- Selected name and color are passed to the Chat screen via navigation.
- Chat screen displays the user’s name in the navigation bar.
- Background color dynamically changes based on user selection.
- Responsive layout with styled components.

---

## 🧩 Technologies Used

- **React Native**
- **Expo**
- **React Navigation (Native Stack)**
- **JavaScript (ES6+)**
- **StyleSheet API**

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Install dependencies

npm install

### 3. Run the app

If you’re using Expo, start the development server:

```bash
npx expo start
```

Then:
Press i to open the iOS simulator
Press a to open the Android emulator
Or scan the QR code with the Expo Go app on your phone.

📂 Project Structure

.
├── App.js
└── components/
├── Start.js
└── Chat.js

## 🧠 Learning Goals

Understand navigation between screens in React Native.
Pass props using React Navigation’s route parameters.
Use React Native styling for flexible layouts.
Manage text input and button interaction.

## 🎨 Styling Overview

- Vertical and horizontal spacing: evenly distributed
- App title: font size 45, font weight 600, font color #FFFFFF
- “Your name”: font size 16, font weight 300, font color #757083, 50% opacity
- “Choose background color”: font size 16, font weight 300, font color #757083, 100% opacity
- Color options HEX codes: #090C08; #474056; #8A95A5; #B9C6AE
- Start chatting button: font size 16, font weight 600, font color #FFFFFF, button color #757083

## Requirements

Node.js ≥ 18
Expo CLI ≥ 6
Xcode (for iOS Simulator)
Android Studio (for Android Emulator)

## 🧑‍💻 Author

Jolanta Simkute
