import { persistStorage } from "@/lib/persist-storage";
import type { RootState } from "@/store/root-reducer";

export const persistConfig = {
  key: "root",
  storage: persistStorage,
  whitelist: ["auth", "filters", "preferences"],
};

export type PersistedRootState = Pick<RootState, "auth" | "filters" | "preferences">;
