import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";

const reducer = combineReducers({
  user: userSlice,
});

const store = configureStore({
  reducer: reducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
