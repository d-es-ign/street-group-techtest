import "@testing-library/jest-native/extend-expect";

jest.mock("@react-native-async-storage/async-storage", () => {
  const store = new Map();

  return {
    getItem: jest.fn(async (key) => store.get(key) ?? null),
    setItem: jest.fn(async (key, value) => {
      store.set(key, value);
    }),
    removeItem: jest.fn(async (key) => {
      store.delete(key);
    }),
    clear: jest.fn(async () => {
      store.clear();
    }),
  };
});
