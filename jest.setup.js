// Mock ExpoModulesCore
jest.mock("expo-modules-core", () => {
  return {
    NativeModulesProxy: {
      ExponentConstants: {
        statusBarHeight: 0,
      },
    },
    requireNativeModule: () => ({}),
  };
});

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return {
    ...Reanimated,
    useSharedValue: jest.fn((initial) => ({ value: initial })),
    useDerivedValue: jest.fn((callback) => ({ value: callback() })),
    useAnimatedReaction: jest.fn(),
    runOnJS: jest.fn((fn) => fn),
    ReanimatedLogLevel: {
      warn: "warn",
      error: "error",
      info: "info",
      debug: "debug",
    },
    configureReanimatedLogger: jest.fn(),
  };
});

// Mock Expo constants
jest.mock("expo-constants", () => ({
  Constants: {
    statusBarHeight: 0,
  },
}));

// Mock safe area context
jest.mock("react-native-safe-area-context", () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
  };
});

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    Ionicons: View,
    createIconSet: () => View,
  };
});

// Mock react-native-gesture-handler
jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native/Libraries/Components/View/View");
  return {
    GestureHandlerRootView: View,
    State: {},
    Directions: {},
    gestureHandlerRootHOC: jest.fn(),
    PanGestureHandler: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    TouchableOpacity: View,
    ScrollView: View,
    Swipeable: View,
    DrawerLayout: View,
    TextInput: View,
    createNativeWrapper: jest.fn(),
    Slider: View,
    Switch: View,
    default: {
      install: jest.fn(),
    },
  };
});
