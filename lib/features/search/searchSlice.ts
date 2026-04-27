import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  query: string;
  isDropdownOpen: boolean;
}

const initialState: SearchState = {
  query: "",
  isDropdownOpen: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setDropdownOpen: (state, action: PayloadAction<boolean>) => {
      state.isDropdownOpen = action.payload;
    },
    clearSearch: (state) => {
      state.query = "";
      state.isDropdownOpen = false;
    },
  },
});

export const { setSearchQuery, setDropdownOpen, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
