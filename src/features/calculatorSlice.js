import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  history: [],
  memory: 0,
  memoryList: [],
};

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    addToHistory: (state, action) => {
      state.history.push(action.payload);
    },
    clearHistory: (state) => {
      state.history = [];
    },
    setMemory: (state, action) => {
      state.memory = action.payload;
    },
    addToMemoryList: (state, action) => {
      state.memoryList.push(action.payload);
    },
    clearMemory: (state) => {
      state.memory = 0;
      state.memoryList = [];
    },
    removeMemoryItem: (state, action) => {
      state.memoryList = state.memoryList.filter((_, index) => index !== action.payload);
    },
  },
});

export const {
  addToHistory,
  clearHistory,
  setMemory,
  addToMemoryList,
  clearMemory,
  removeMemoryItem,
} = calculatorSlice.actions;

export default calculatorSlice.reducer; 