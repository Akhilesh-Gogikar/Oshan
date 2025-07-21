import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { stockApi } from '../services/stockApi';
import { themeSlice } from '../slices/themeSlice';

export const store = configureStore({
  reducer: {
    [stockApi.reducerPath]: stockApi.reducer,
    theme: themeSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stockApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;