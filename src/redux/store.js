import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import languageReducer from "./languageSlice";
import volumeReducer from "./volumeSlice";
import darkModeSlice from "./darkModeSlice";
import routeSlice from "./routeSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["volume", "auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  language: languageReducer,
  volume: volumeReducer,
  theme: darkModeSlice,
  route: routeSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
