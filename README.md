# Expense Macros Pro

A polished, app store-ready personal budgeting app built with React Native + Expo. Daily & monthly budget tracking, rollover mode, category breakdowns, and smooth animations.

## Features

- **Smart Budget Dashboard** — Animated progress bar with color-coded status (green/amber/red), remaining balance hero display, and projected spend calculation
- **Daily, Weekly & Monthly Budgets** — Flexible period tracking that resets automatically
- **Rollover Mode** — Unused budget carries over to the next period
- **Category Tracking** — 10+ categories (Food, Transport, Entertainment, etc.) with emoji icons
- **Transaction History** — Filterable by category, grouped by date with section totals
- **Spending Analytics** — Daily average, projected end-of-period spend, days remaining
- **Setup Wizard** — Smooth 5-step onboarding flow with progress indicator
- **Settings** — Edit budget, period, and rollover anytime; full data reset option
- **Fully Offline** — All data stored locally via AsyncStorage, no account needed
- **App Store Ready** — Proper bundle IDs, safe area handling, iOS & Android support

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native + Expo SDK 51 |
| Navigation | Expo Router (file-based tabs) |
| Styling | NativeWind (Tailwind CSS for RN) |
| Storage | AsyncStorage |
| Date handling | date-fns |
| Types | TypeScript (strict) |

## Project Structure

```
expense-macros-pro/
├── app/
│   ├── _layout.tsx        # Tab navigation root
│   ├── index.tsx          # Home dashboard + add transaction
│   ├── history.tsx        # Transaction history with filters
│   ├── settings.tsx       # Budget settings & data management
│   └── setup.tsx          # First-launch onboarding wizard
├── hooks/
│   └── useAppData.ts      # Central state hook (config, transactions, summary)
├── lib/
│   ├── budgetEngine.ts    # Period calculations, projections, trends
│   ├── categoryStyles.ts  # Category definitions with emojis/colors
│   ├── formatters.ts      # Currency, date, percent formatters
│   └── storage.ts         # AsyncStorage read/write helpers
├── types/
│   └── index.ts           # Shared TypeScript types
└── app.json               # Expo config with bundle IDs
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

## Building for App Stores

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Key Improvements Over v1

- **Animated progress bar** — Smooth spring animations on budget fill
- **Projected spend** — Calculates whether you're on track to overspend
- **Section-grouped history** — Transactions grouped by date with daily totals
- **Category filter chips** — One-tap filtering in history screen
- **Strict TypeScript** — All types defined, no `any` usage
- **Budget engine** — Separated into pure functions for easy testing
- **Rollover logic** — Properly computes previous period remainder
- **30-day spending trend** — Data structure ready for chart visualization

## License

MIT
