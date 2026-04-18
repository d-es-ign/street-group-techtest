import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistQueryClientSave } from "@tanstack/react-query-persist-client";

import {
  createQueryClient,
  createQueryPersister,
  restorePersistedQueryClient,
} from "./index";

const createMemoryStorage = (): typeof AsyncStorage => {
  const storage = new Map<string, string>();

  return {
    getItem: jest.fn(async (name: string) => storage.get(name) ?? null),
    getAllKeys: jest.fn(async () => [...storage.keys()]),
    getMany: jest.fn(async (names: string[]) =>
      Object.fromEntries(
        names.map((name) => [name, storage.get(name) ?? null]),
      ) as Record<string, string | null>,
    ),
    setItem: jest.fn(async (name: string, value: string) => {
      storage.set(name, value);
    }),
    setMany: jest.fn(async (entries: [string, string][]) => {
      entries.forEach(([name, value]) => {
        storage.set(name, value);
      });
    }),
    removeItem: jest.fn(async (name: string) => {
      storage.delete(name);
    }),
    removeMany: jest.fn(async (names: string[]) => {
      names.forEach((name) => {
        storage.delete(name);
      });
    }),
    clear: jest.fn(async () => {
      storage.clear();
    }),
  } as unknown as typeof AsyncStorage;
};

describe("GIVEN query persistence", () => {
  it("SHOULD restore persisted query data from storage", async () => {
    const storage = createMemoryStorage();
    const persister = createQueryPersister(storage);
    const firstClient = createQueryClient();

    firstClient.setQueryData(["bank-holidays"], [
      {
        title: "New Year's Day",
        date: "2026-01-01",
        notes: "",
        bunting: true,
      },
    ]);

    await persistQueryClientSave({
      queryClient: firstClient,
      persister,
    });

    const secondClient = createQueryClient();

    await restorePersistedQueryClient(secondClient, persister);

    expect(secondClient.getQueryData(["bank-holidays"])).toEqual([
      {
        title: "New Year's Day",
        date: "2026-01-01",
        notes: "",
        bunting: true,
      },
    ]);
  });
});
