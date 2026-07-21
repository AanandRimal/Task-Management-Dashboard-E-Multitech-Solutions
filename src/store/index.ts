import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import { baseApi } from "@/store/base-api";
import { persistConfig } from "@/store/persist-config";
import { rootReducer } from "@/store/root-reducer";

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(baseApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];

let clientStore: AppStore | undefined;

export function getStore() {
  if (!clientStore) {
    clientStore = makeStore();
  }
  return clientStore;
}

export function getPersistor(store: AppStore) {
  return persistStore(store);
}
