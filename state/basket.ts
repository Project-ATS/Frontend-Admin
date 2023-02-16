import { createSlice } from '@reduxjs/toolkit'

import { basketState } from "../lib/types";

const initialState: basketState = { basketItems: [] }

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addItem: (state, { payload }) => {

      const index = state.basketItems.findIndex(item => item.id === payload.id);

      if (index === -1) {
        state.basketItems.push(payload);
      } else {
        state.basketItems.map(item => item.count += payload.count)
      }

    },
    removeItem: (state, { payload }) => {
      state.basketItems = state.basketItems.filter(item => item.id !== payload)
    },
    increase: (state, { payload }) => {
      const index = state.basketItems.findIndex(item => item.id === payload);
      state.basketItems[index].count += 1

    },
    decrease: (state, { payload }) => {
      const index = state.basketItems.findIndex(item => item.id === payload);
      if (state.basketItems[index].count > 1) {
        state.basketItems[index].count -= 1
      } else {
        state.basketItems = state.basketItems.filter(item => item.id !== payload)
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { addItem, removeItem, increase, decrease } = basketSlice.actions

export default basketSlice.reducer