# ��� Clean Service - Mobile App

A React Native mobile application for Clean Service platform, built with [Expo](https://expo.dev) and Expo Router for seamless navigation.

## ��� Requirements

Before you begin, ensure you have the following installed:

- **[Node.js](https://nodejs.org/)** version **20.0.0** or higher
- **npm** (comes with Node.js) or **yarn**
- **Git** for version control
- A device or emulator to run the app:
  - **Android**: [Android Studio](https://developer.android.com/studio) with Android emulator
  - **iOS (macOS only)**: [Xcode](https://developer.apple.com/xcode/) with iOS simulator
  - **Physical Device**: Install [Expo Go](https://expo.dev/go) app on your phone (iOS/Android)

## ��� Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/clean-service-org/clean-service-native.git
cd clean-service-native
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Then edit `.env` with your configuration:

```env

# Backend API URL (Required)

BACKEND_API=https://cleanservice.app/api

# Google Maps API Key (Required for map features)

GOOGLE_MAP_KEY=your_google_maps_api_key_here
```

**Getting Google Maps API Key:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Geocoding API
4. Create credentials (API Key)
5. Copy the API key to your \`.env\` file

### 4. Start the Development Server

```bash
npx expo start
```

Or use the npm script:

```bash
npm start
```

### 5. Run on Your Device

After starting the development server, you'll see a QR code in the terminal. Choose one of the following options:

#### Option A: Physical Device (Recommended for Testing)

1. Install **Expo Go** app on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Ensure your phone and computer are on the same Wi-Fi network**

3. Scan the QR code:
   - **iOS**: Open Camera app and scan the QR code
   - **Android**: Open Expo Go app and use the built-in scanner

4. The app will bundle and load automatically

#### Option B: Android Emulator

```bash
npm run android
```

or

```bash
npx expo start --android
```

Make sure Android Studio is installed and an emulator is running.

#### Option C: iOS Simulator (macOS only)

```bash
npm run ios
```

or

```bash
npx expo start --ios
```

Make sure Xcode is installed.

