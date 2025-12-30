![example workflow](https://github.com/nodeMD/giftTree/actions/workflows/ci.yml/badge.svg)

# Gift Tree 🌲

A React Native mobile app that gamifies tree planting through user engagement. Click to view cat GIFs, track your progress, and unlock virtual trees!

## Features

- **Click Counter** - Track progress towards planting goals (1,500 clicks per tree)
- **Cat GIF Rewards** - View a new cat GIF with each click
- **Virtual Tree Collection** - Unlock and view trees from the Trefle API
- **User Authentication** - Sign up, sign in, password reset via Appwrite
- **Dark/Light Theme** - System-aware theming with manual override
- **Daily Notifications** - Optional reminders to keep clicking
- **Progress Persistence** - All progress synced to cloud database

## Tech Stack

- **Framework**: [Expo](https://expo.dev) (SDK 54) with [Expo Router](https://docs.expo.dev/router/introduction/)
- **Language**: TypeScript
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Backend**: [Appwrite](https://appwrite.io/) (Authentication & Database)
- **APIs**: 
  - [CATAAS](https://cataas.com/) - Cat as a Service (GIFs)
  - [Trefle](https://trefle.io/) - Plant/Tree data
- **Testing**: Jest + React Native Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator / Android Emulator / Expo Go app

### Environment Variables

Create a `.env` file in the root directory:

```env
# Appwrite
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id

# APIs
EXPO_PUBLIC_CATAAS_API_URL=https://cataas.com/cat/gif?json=true
EXPO_PUBLIC_TREFLE_API_URL=https://trefle.io/api/v1
EXPO_PUBLIC_TREFLE_TOKEN=your_trefle_api_token
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/gift-tree.git
   cd gift-tree
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your preferred platform:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo development server |
| `npm run ios` | Run on iOS Simulator |
| `npm run android` | Run on Android Emulator |
| `npm run web` | Run in web browser |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## Project Structure

```
gift-tree/
├── app/                    # App screens (file-based routing)
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── reset-password.tsx
│   ├── (tabs)/            # Main tab screens
│   │   ├── index.tsx      # Home (click counter + GIFs)
│   │   ├── trees.tsx      # Tree collection
│   │   └── settings.tsx   # User settings
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
├── constants/             # App constants
│   ├── app.ts            # App-wide constants (MAX_CLICKS)
│   └── images.ts         # Image assets
├── contexts/              # React contexts
│   ├── AuthContext.tsx   # Authentication state
│   └── ThemeContext.tsx  # Theme state
├── services/              # API & external services
│   ├── api.ts            # External API calls
│   ├── appwrite.ts       # Appwrite SDK wrapper
│   ├── notifications.ts  # Push notifications
│   └── useFetch.ts       # Data fetching hook
├── __tests__/            # Test files
│   ├── app/
│   ├── contexts/
│   └── services/
└── __mocks__/            # Jest mocks
```

## Testing

The project uses Jest and React Native Testing Library with 50+ unit tests covering:

- **AuthContext**: Authentication flows, click counting, goal completion
- **useFetch Hook**: Data fetching, loading states, error handling
- **API Services**: Network requests, error responses
- **Components**: HomeScreen, TreesScreen rendering and interactions

Run tests:
```bash
npm test
```

## CI/CD

GitHub Actions workflow runs on every PR and merge to `master`/`main`:

1. **Lint** - ESLint code quality checks
2. **Test** - Full test suite execution

See `.github/workflows/ci.yml` for configuration.

## Appwrite Database Schema

### Users Collection

| Attribute | Type | Description |
|-----------|------|-------------|
| `nickName` | string | User's display name |
| `email` | string | User's email |
| `clickCount` | integer | Current click progress (0-1500) |
| `completedGoals` | integer | Number of trees unlocked |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and not licensed for public use.
