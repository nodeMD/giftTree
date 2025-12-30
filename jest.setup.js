// Mock expo modules
jest.mock("expo/src/winter/runtime.native", () => ({}), { virtual: true });
jest.mock("expo/src/winter/installGlobal", () => ({}), { virtual: true });

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Mock expo-notifications
jest.mock("expo-notifications", () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
}));

// Mock expo-constants
jest.mock("expo-constants", () => ({
  expoConfig: {
    extra: {},
  },
}));

// Mock react-native-appwrite
jest.mock("react-native-appwrite", () => ({
  Client: jest.fn().mockImplementation(() => ({
    setEndpoint: jest.fn().mockReturnThis(),
    setProject: jest.fn().mockReturnThis(),
  })),
  Account: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    createEmailPasswordSession: jest.fn(),
    get: jest.fn(),
    deleteSession: jest.fn(),
    createRecovery: jest.fn(),
    updateRecovery: jest.fn(),
    updateStatus: jest.fn(),
  })),
  Databases: jest.fn(),
  TablesDB: jest.fn().mockImplementation(() => ({
    createRow: jest.fn(),
    getRow: jest.fn(),
    updateRow: jest.fn(),
    deleteRow: jest.fn(),
  })),
  ID: {
    unique: jest.fn(() => "unique-id"),
  },
  Permission: {
    read: jest.fn(),
    write: jest.fn(),
  },
  Role: {
    user: jest.fn(),
  },
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
