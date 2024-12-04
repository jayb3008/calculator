import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import calculatorReducer from '../features/calculatorSlice';

const persistConfig = {
  key: 'calculator',
  storage,
  whitelist: ['history', 'memory', 'memoryList'], 
};

const persistedReducer = persistReducer(persistConfig, calculatorReducer);

export const store = configureStore({
  reducer: {
    calculator: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store); 