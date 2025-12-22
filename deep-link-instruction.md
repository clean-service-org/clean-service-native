# Complete Guide: Setting Up Universal Links for Clean Service Mobile App

## Overview

This guide will help you set up deep linking for your Clean Service mobile app using the domain `app.cleanservice.app`. This allows payment providers and other services to redirect users back to your app seamlessly.

## Architecture

```
cleanservice.app                    → Main website
api.cleanservice.app                → Backend API
app.cleanservice.app                → Mobile app deep links (verification only)
```

**Important:** The mobile app doesn't run on the server. The server only hosts verification files that prove you own both the domain and the app.

---

## Part 1: DNS Configuration

### 1.1 Add DNS Record

Log into your DNS provider (e.g., Cloudflare, GoDaddy, Namecheap) and add:

```
Type    Name    Value                    TTL
A       app     [your-server-ip]         300
```

**Example:**
```
Type    Name    Value              TTL
A       app     203.0.113.45       300
```

### 1.2 Verify DNS Propagation

Wait 5-15 minutes, then test:

```bash
ping app.cleanservice.app
nslookup app.cleanservice.app
```

---

## Part 2: Server Setup

### 2.1 SSH into Your Server

```bash
ssh user@your-server-ip
```

### 2.2 Create Directory Structure

```bash
sudo mkdir -p /var/www/app.cleanservice.app/.well-known
cd /var/www/app.cleanservice.app/.well-known
```

### 2.3 Create iOS Verification File

Create file **without extension**:

```bash
sudo nano apple-app-site-association
```

Paste this content (replace `TEAM_ID` with your Apple Team ID):

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.cleanservice.app",
        "paths": [
          "/payment-callback",
          "/payment-callback/*",
          "/auth/*",
          "/booking/*",
          "*"
        ]
      }
    ]
  }
}
```

**How to find your Apple Team ID:**
1. Go to https://developer.apple.com/account
2. Click "Membership" in the sidebar
3. Copy your Team ID (e.g., `A1B2C3D4E5`)

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

### 2.4 Create Android Verification File

```bash
sudo nano assetlinks.json
```

Paste this content:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.cleanservice.app",
      "sha256_cert_fingerprints": [
        "YOUR_SHA256_CERT_FINGERPRINT_HERE"
      ]
    }
  }
]
```

**To get your SHA256 fingerprint:**

For **debug builds** (development):
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep SHA256
```

For **release builds** (production):
```bash
keytool -list -v -keystore /path/to/your/release.keystore -alias your-key-alias | grep SHA256
```

**Output example:**
```
SHA256: AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90
```

Copy the SHA256 value and paste it into `assetlinks.json` (replace `YOUR_SHA256_CERT_FINGERPRINT_HERE`).

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

### 2.5 Set Correct Permissions

```bash
sudo chown -R www-data:www-data /var/www/app.cleanservice.app
sudo chmod -R 755 /var/www/app.cleanservice.app
```

---

## Part 3: Nginx Configuration

### 3.1 Create Nginx Site Configuration

```bash
sudo nano /etc/nginx/sites-available/app.cleanservice.app
```

Paste this configuration:

```nginx
# HTTP - Redirect to HTTPS
server {
    listen 80;
    server_name app.cleanservice.app;
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name app.cleanservice.app;
    
    # SSL certificates (will be configured by Certbot)
    ssl_certificate /etc/letsencrypt/live/app.cleanservice.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.cleanservice.app/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    
    # Root directory
    root /var/www/app.cleanservice.app;
    
    # iOS Universal Links verification
    location = /.well-known/apple-app-site-association {
        default_type application/json;
        add_header Content-Type application/json;
        add_header Access-Control-Allow-Origin *;
    }
    
    # Android App Links verification
    location = /.well-known/assetlinks.json {
        default_type application/json;
        add_header Content-Type application/json;
        add_header Access-Control-Allow-Origin *;
    }
    
    # All other routes - redirect to app store or info page
    location / {
        # Detect iOS
        if ($http_user_agent ~* (iPhone|iPad|iPod)) {
            return 302 https://apps.apple.com/app/your-app-id;
        }
        
        # Detect Android
        if ($http_user_agent ~* Android) {
            return 302 https://play.google.com/store/apps/details?id=com.cleanservice.app;
        }
        
        # Default fallback for desktop/other
        return 302 https://cleanservice.app/download;
    }
}
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

### 3.2 Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/app.cleanservice.app /etc/nginx/sites-enabled/
```

### 3.3 Test Nginx Configuration

```bash
sudo nginx -t
```

Expected output:
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 3.4 Reload Nginx (Temporary - Without SSL)

```bash
# First, comment out SSL lines in the config temporarily
sudo nano /etc/nginx/sites-available/app.cleanservice.app

# Comment out these lines:
# ssl_certificate /etc/letsencrypt/live/app.cleanservice.app/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/app.cleanservice.app/privkey.pem;

# Reload
sudo systemctl reload nginx
```

---

## Part 4: SSL Certificate Setup

### 4.1 Install Certbot (if not already installed)

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### 4.2 Get SSL Certificate

```bash
sudo certbot --nginx -d app.cleanservice.app
```

Follow the prompts:
1. Enter your email address
2. Agree to Terms of Service: `Y`
3. Share email with EFF (optional): `Y` or `N`
4. Choose redirect option: `2` (Redirect HTTP to HTTPS)

### 4.3 Uncomment SSL Lines in Nginx Config

```bash
sudo nano /etc/nginx/sites-available/app.cleanservice.app
```

Uncomment the SSL certificate lines (remove the `#`):
```nginx
ssl_certificate /etc/letsencrypt/live/app.cleanservice.app/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/app.cleanservice.app/privkey.pem;
```

### 4.4 Reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 4.5 Set Up Auto-Renewal

```bash
sudo certbot renew --dry-run
```

If successful, the certificate will auto-renew before expiration.

---

## Part 5: Verify Server Setup

### 5.1 Test Verification Files

```bash
# Test iOS file
curl https://app.cleanservice.app/.well-known/apple-app-site-association

# Test Android file
curl https://app.cleanservice.app/.well-known/assetlinks.json
```

Expected: You should see the JSON content you created.

### 5.2 Test Redirect

```bash
# Should redirect to app store or cleanservice.app/download
curl -I https://app.cleanservice.app/
```

---

## Part 6: Mobile App Configuration

### 6.1 Update app.config.js

```bash
# On your local machine
cd /Users/khoavale/Desktop/Project/College/Mobile/clean-service-native
nano app.config.js
```

Update the configuration:

```javascript
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
      bundleIdentifier: 'com.cleanservice.app',
      associatedDomains: [
        'applinks:app.cleanservice.app'
      ],
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
      package: 'com.cleanservice.app',
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
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'https',
              host: 'app.cleanservice.app',
              pathPrefix: '/'
            }
          ],
          category: ['BROWSABLE', 'DEFAULT']
        }
      ]
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
```

### 6.2 Update Root Layout to Handle Deep Links

```bash
nano app/_layout.tsx
```

Add deep link handling:

```typescript
import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Handle initial URL (app was closed and opened via link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Handle URL when app is already open
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => subscription.remove();
  }, []);

  const handleDeepLink = (url: string) => {
    const { hostname, path, queryParams } = Linking.parse(url);
    
    console.log('Deep link received:', { hostname, path, queryParams });
    
    // Handle payment callback
    if (path === 'payment-callback') {
      router.push({
        pathname: '/payment-callback',
        params: queryParams,
      });
      return;
    }
    
    // Handle auth routes
    if (path?.startsWith('auth/')) {
      router.push({
        pathname: `/${path}`,
        params: queryParams,
      });
      return;
    }
    
    // Handle booking routes
    if (path?.startsWith('booking/')) {
      router.push({
        pathname: `/${path}`,
        params: queryParams,
      });
      return;
    }
    
    // Default fallback
    console.log('Unhandled deep link path:', path);
  };

  // ...rest of your existing code...
}
```

### 6.3 Create Payment Callback Screen (if not exists)

```bash
mkdir -p app/payment-callback
nano app/payment-callback/index.tsx
```

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'success' | 'cancelled' | 'failed'>('failed');

  useEffect(() => {
    handlePaymentCallback();
  }, []);

  const handlePaymentCallback = async () => {
    try {
      console.log('Payment callback params:', params);
      
      // Extract payment status from params
      const paymentStatus = params.status as string;
      const transactionId = params.transactionId || params.transaction_id || params.txn_id;
      
      // TODO: Verify payment with your backend
      // const response = await fetch(`${process.env.BACKEND_API}/api/v1/payments/verify`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ transactionId, ...params }),
      // });
      // const data = await response.json();
      
      // For now, use the status from params
      if (paymentStatus === 'success') {
        setStatus('success');
        // Save payment info to AsyncStorage if needed
        await AsyncStorage.setItem('last_payment', JSON.stringify({
          transactionId,
          status: 'success',
          timestamp: new Date().toISOString(),
        }));
      } else if (paymentStatus === 'cancelled') {
        setStatus('cancelled');
      } else {
        setStatus('failed');
      }
    } catch (error) {
      console.error('Payment callback error:', error);
      setStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#1A78F2" />
        <Text className="mt-4 text-gray-600">Processing payment...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      {status === 'success' && (
        <>
          <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center mb-6">
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</Text>
          <Text className="text-gray-600 text-center mb-8">
            Your payment has been processed successfully.
          </Text>
        </>
      )}

      {status === 'cancelled' && (
        <>
          <View className="w-24 h-24 rounded-full bg-yellow-100 items-center justify-center mb-6">
            <Ionicons name="close-circle" size={64} color="#F59E0B" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</Text>
          <Text className="text-gray-600 text-center mb-8">
            You cancelled the payment. No charges were made.
          </Text>
        </>
      )}

      {status === 'failed' && (
        <>
          <View className="w-24 h-24 rounded-full bg-red-100 items-center justify-center mb-6">
            <Ionicons name="alert-circle" size={64} color="#EF4444" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</Text>
          <Text className="text-gray-600 text-center mb-8">
            There was an error processing your payment. Please try again.
          </Text>
        </>
      )}

      <TouchableOpacity
        className="bg-[#1A78F2] px-8 py-4 rounded-xl"
        onPress={() => router.push('/')}
      >
        <Text className="text-white font-semibold text-base">Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### 6.4 Rebuild the App

```bash
# Clear cache
npx expo start -c

# For iOS
npx expo run:ios

# For Android
npx expo run:android

# Or build for production
eas build --platform ios
eas build --platform android
```

---

## Part 7: Payment Provider Configuration

### 7.1 Configure Return URLs

When setting up payment providers, use these URLs:

**VNPay (Vietnam):**
```javascript
vnp_ReturnUrl: 'https://app.cleanservice.app/payment-callback'
```

**Stripe:**
```javascript
return_url: 'https://app.cleanservice.app/payment-callback?status=success'
```

**PayPal:**
```javascript
return_url: 'https://app.cleanservice.app/payment-callback?status=success',
cancel_url: 'https://app.cleanservice.app/payment-callback?status=cancelled'
```

**MoMo (Vietnam):**
```javascript
returnUrl: 'https://app.cleanservice.app/payment-callback',
notifyUrl: 'https://api.cleanservice.app/webhooks/momo'
```

### 7.2 Test Payment Flow

1. Initiate a test payment in your app
2. Complete payment in payment provider's app/website
3. Payment provider redirects to: `https://app.cleanservice.app/payment-callback?status=success&transactionId=123`
4. iOS/Android intercepts the URL and opens your app
5. Your app handles the callback and shows success/failure screen

---

## Part 8: Testing

### 8.1 Test Universal Links (iOS)

**Using Safari:**
1. Open Notes app on iPhone
2. Type: `https://app.cleanservice.app/payment-callback?status=success`
3. Tap the link
4. Should open your app (if installed) or redirect to App Store

**Using Terminal:**
```bash
# Open iOS Simulator
xcrun simctl openurl booted "https://app.cleanservice.app/payment-callback?status=success"
```

### 8.2 Test App Links (Android)

**Using ADB:**
```bash
# Test with real device or emulator
adb shell am start -W -a android.intent.action.VIEW -d "https://app.cleanservice.app/payment-callback?status=success" com.cleanservice.app
```

**Using Chrome on Android:**
1. Open Chrome
2. Type: `https://app.cleanservice.app/payment-callback?status=success`
3. Press Enter
4. Should show dialog to open in your app

### 8.3 Test Custom Scheme (Fallback)

```bash
# iOS
xcrun simctl openurl booted "cleanservicenative://payment-callback?status=success"

# Android
adb shell am start -W -a android.intent.action.VIEW -d "cleanservicenative://payment-callback?status=success" com.cleanservice.app
```

### 8.4 Verify Apple's CDN

Apple caches the `apple-app-site-association` file on their CDN. Test if Apple can see it:

```bash
curl -I https://app-site-association.cdn-apple.com/a/v1/app.cleanservice.app
```

If you get a 404, it means Apple hasn't cached it yet. This can take 24-48 hours after first deployment.

### 8.5 Android App Links Tester

Use Google's App Links Assistant in Android Studio:
1. Open Android Studio
2. Tools → App Links Assistant
3. Test URL Mapping
4. Enter: `https://app.cleanservice.app/payment-callback`

---

## Part 9: Troubleshooting

### Issue: Deep link doesn't open app

**Checklist:**
- [ ] DNS is pointing to correct IP
- [ ] SSL certificate is valid and active
- [ ] Verification files are accessible via HTTPS
- [ ] `bundleIdentifier` (iOS) / `package` (Android) matches verification files
- [ ] App is installed on device
- [ ] For iOS: Apple Team ID is correct
- [ ] For Android: SHA256 fingerprint matches your keystore

**Debug iOS:**
```bash
# Check if iOS can fetch the file
curl -I https://app.cleanservice.app/.well-known/apple-app-site-association
```

**Debug Android:**
```bash
# Check App Links verification status
adb shell pm get-app-links com.cleanservice.app
```

### Issue: iOS shows "Open in App" banner instead of auto-opening

This is normal behavior. Universal Links require user interaction. The app won't auto-open if:
- User is already in Safari
- Link is in a WebView
- User previously tapped "Open in Safari" for a Universal Link

### Issue: Android doesn't recognize App Links

1. Verify JSON is valid:
```bash
curl https://app.cleanservice.app/.well-known/assetlinks.json | python -m json.tool
```

2. Check verification status:
```bash
adb shell pm get-app-links --user 0 com.cleanservice.app
```

3. Manually verify:
```bash
adb shell pm verify-app-links --re-verify com.cleanservice.app
```

### Issue: 404 on verification files

Check nginx logs:
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

Verify file permissions:
```bash
ls -la /var/www/app.cleanservice.app/.well-known/
```

### Issue: SSL certificate expired

Renew manually:
```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## Part 10: Production Deployment Checklist

Before going live:

- [ ] DNS is configured and propagated
- [ ] SSL certificate is installed and auto-renewal is working
- [ ] Verification files are accessible via HTTPS
- [ ] Apple Team ID is correct in `apple-app-site-association`
- [ ] Android SHA256 is from **release keystore**, not debug
- [ ] App is published to App Store / Google Play with same bundle IDs
- [ ] Payment provider return URLs are configured
- [ ] Deep link handling is tested on real devices
- [ ] Analytics/logging is set up for deep link events
- [ ] Error handling is implemented for failed payments
- [ ] Fallback redirect to app store works for users without app

---

## Part 11: Maintenance

### Monthly Tasks

1. **Check SSL Certificate Expiry:**
```bash
sudo certbot certificates
```

2. **Monitor Deep Link Analytics:**
   - Track how many users are redirected from payment providers
   - Monitor success/failure rates

3. **Update Verification Files:**
   - If you change bundle identifier or package name
   - If you add new deep link paths

### When Releasing New App Version

1. **iOS:** No changes needed if bundle identifier stays same
2. **Android:** If you change signing key, update SHA256 in `assetlinks.json`

---

## Summary

You now have:

✅ `app.cleanservice.app` subdomain configured  
✅ Server hosting verification files  
✅ SSL certificate with auto-renewal  
✅ Universal Links (iOS) configured  
✅ App Links (Android) configured  
✅ Payment callback handling  
✅ Deep link routing in app  

**URL formats that work:**
- Universal Link: `https://app.cleanservice.app/payment-callback?status=success`
- Custom Scheme: `cleanservicenative://payment-callback?status=success`

**What happens when user taps a link:**
1. If app installed → Opens app directly
2. If app not installed → Redirects to App Store/Play Store or website

---

## Support

If you encounter issues:

1. Check logs: `sudo tail -f /var/log/nginx/error.log`
2. Test verification files: `curl https://app.cleanservice.app/.well-known/apple-app-site-association`
3. Verify DNS: `nslookup app.cleanservice.app`
4. Check SSL: `curl -I https://app.cleanservice.app`

For payment-specific issues, refer to your payment provider's documentation for their required redirect URL format.