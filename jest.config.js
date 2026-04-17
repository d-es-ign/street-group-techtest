module.exports = {
  preset: "jest-expo",
  setupFiles: ["./node_modules/react-native-gesture-handler/jestSetup.js"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  transform: {
    "\\.[jt]sx?$": [
      "babel-jest",
      { caller: { preserveEnvVars: true, platform: "ios" } },
    ],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo(nent)?/.*|expo-router|react-native-reanimated|react-native-gesture-handler|styled-components)",
  ],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/$1",
    "\\.svg$": "<rootDir>/__mocks__/svgMock.tsx",
  },
};
