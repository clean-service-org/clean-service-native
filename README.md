# 🚀 My Expo App

A React Native project built with [Expo](https://expo.dev) and `create-expo-app`.  
Configured with **ESLint (flat config)** and **Prettier** for consistent code style.

## 📋 Requirements

- [Node.js](https://nodejs.org/) **18+**
- [npm](https://www.npmjs.com/) (or yarn)
- (Optional) [Git](https://git-scm.com/) to clone the repo
- Device or emulator to run the app:
  - **Android**: Android Studio + emulator
  - **iOS (macOS)**: Xcode + simulator
  - **Or** install the [Expo Go](https://expo.dev/go) app on your phone

## ▶️ How to Run

1. **Clone the repo**

   ```bash
   git clone https://github.com/clean-service-org/clean-service-native.git
   cd clean-service-native
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

4. **Open the app on your phone**
   - Make sure your phone and computer are on the **same Wi‑Fi network**.
   - After the server starts, the terminal shows a **QR code**.
   - **Open the Expo Go app** on your phone and use the built‑in scanner to scan the QR code.
   - The app will bundle and load on your device automatically.
   - Edit any source file, then press **R** in the terminal to reload the updated app instantly on your phone.

That’s it—your teammate just needs to clone, install, and start.

## (Optional) Code Quality

- **Lint check**
  ```bash
  npm run lint
  ```
- **Auto-fix issues**
  ```bash
  npm run lint -- --fix
  ```
- **Format code**
  ```bash
  npx prettier --write .
  ```

---

Happy coding!
