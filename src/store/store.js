import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
})

export const selectRootState = (state) => state;
export const selectAppDispatch = (dispatch) => dispatch;