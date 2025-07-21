import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  isDark: boolean;
  primaryColor: string;
  accentColor: string;
}

const initialState: ThemeState = {
  isDark: false,
  primaryColor: '#2563eb',
  accentColor: '#f59e0b',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload;
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
    },
  },
});

export const { toggleTheme, setPrimaryColor, setAccentColor } = themeSlice.actions;

export default themeSlice.reducer;