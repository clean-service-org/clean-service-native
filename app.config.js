require('dotenv').config();

module.exports = {
  expo: {
    name: 'clean-service-native',
    slug: 'clean-service-native',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'cleanservicenative',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAP_KEY,
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'This app needs access to your location to show your address on the map.',
        NSLocationAlwaysUsageDescription:
          'This app needs access to your location to show your address on the map.',
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAP_KEY,
        },
      },
      permissions: ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'],
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      GOOGLE_MAP_KEY: process.env.GOOGLE_MAP_KEY,
      BACKEND_API: process.env.BACKEND_API,
    },
  },
};

