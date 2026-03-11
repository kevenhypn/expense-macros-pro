# Getting Started

Follow these exact steps to run the app locally.

## Prerequisites

- Node.js **v20** (you've already installed this via nvm)
- Expo Go app on your phone, or an iOS Simulator / Android Emulator

## Step 1 — Pull the latest changes

The repo was just updated to fix incompatible packages. Pull the latest:

```bash
cd ~/Downloads/expense-macros-pro-main
git pull  # if using git, OR re-download the ZIP from GitHub
```

Or just re-download the ZIP from GitHub and unzip fresh.

## Step 2 — Make sure you're on Node 20

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm use --delete-prefix v20.20.1
node -v  # should print v20.20.1
```

## Step 3 — Clean install

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## Step 4 — Start the app

```bash
npx expo start -c
```

Then:
- Press **i** to open in iOS Simulator
- Press **a** to open in Android Emulator  
- Or scan the QR code with **Expo Go** on your phone

## What was fixed

| Problem | Fix |
|---------|-----|
| `expo-haptics` PluginError | Removed from `app.json` plugins |
| `react-native-worklets` missing | Removed `react-native-reanimated` (app uses RN's built-in `Animated` API) |
| `victory-native` peer dep issues | Removed (charts can be added later once RN version is upgraded) |
| Missing `assets/` folder | Removed asset references from `app.json` |

## Troubleshooting

**"Cannot find module" errors after install:**
```bash
rm -rf node_modules package-lock.json .expo
npm install --legacy-peer-deps
npx expo start -c
```

**Still on wrong Node version:**
```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
nvm use --delete-prefix v20.20.1
```

**Metro bundler stale cache:**
```bash
npx expo start --clear
```
