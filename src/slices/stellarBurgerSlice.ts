import {
  getIngredientsApi,
  getFeedsApi,
  orderBurgerApi,
  getOrderByNumberApi,
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  getOrdersApi,
  updateUserApi
} from '@api';
import { TIngredient, TConstructorItems, TOrder } from '@utils-types';
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { RootState } from '../services/store';

export interface IBurgerState {
  ingredients: TIngredient[];
  constructorItems: TConstructorItems;
  isLoading: boolean;
  error?: string;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orders: TOrder[];
  userOrders: TOrder[];
  totalOrders: number;
  ordersToday: number;
  isAuthorized: boolean;
  name: string;
  email: string;
  currentOrder: TOrder | null;
}

const initialState: IBurgerState = {
  ingredients: [],
  constructorItems: { bun: null, ingredients: [] },
  isLoading: false,
  error: undefined,
  orderRequest: false,
  orderModalData: null,
  orders: [],
  userOrders: [],
  totalOrders: 0,
  ordersToday: 0,
  isAuthorized: false,
  name: '',
  email: '',
  currentOrder: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  getIngredientsApi
);
export const fetchFeeds = createAsyncThunk('fedds/fetchFeeds', getFeedsApi);
export const fetchOrderBurger = createAsyncThunk(
  'order/fetchOrderBurger',
  orderBurgerApi
);
export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  getOrderByNumberApi
);
export const fetchUserOrders = createAsyncThunk(
  'orders/userOrders',
  getOrdersApi
);
export const fetchRegisterUser = createAsyncThunk(
  'user/register',
  registerUserApi
);
export const fetchLoginUser = createAsyncThunk('user/login', loginUserApi);
export const fetchLogoutUser = createAsyncThunk('user/logout', logoutApi);
export const fetchUpdateUser = createAsyncThunk(
  'user/updateUser',
  updateUserApi
);
export const getUserThunk = createAsyncThunk('user/getUser', getUserApi);

const pendingMatcher = isAnyOf(
  fetchIngredients.pending,
  fetchFeeds.pending,
  fetchRegisterUser.pending,
  fetchLoginUser.pending,
  fetchLogoutUser.pending,
  getUserThunk.pending,
  fetchUserOrders.pending,
  fetchUpdateUser.pending
);

const rejectedMatcher = isAnyOf(
  fetchIngredients.rejected,
  fetchFeeds.rejected,
  fetchRegisterUser.rejected,
  fetchLoginUser.rejected,
  fetchLogoutUser.rejected,
  getUserThunk.rejected,
  fetchUserOrders.rejected,
  fetchUpdateUser.rejected
);

export const stellarBurgerSlice = createSlice({
  name: 'stellarburger',
  initialState,
  reducers: {
    addIngredient(state, { payload }: { payload: TIngredient }) {
      if (payload.type === 'bun') {
        state.constructorItems.bun = payload;
      } else {
        state.constructorItems.ingredients.push({ ...payload, id: uuidv4() });
      }
    },
    removeIngredient(state, { payload }: { payload: { index: number } }) {
      state.constructorItems.ingredients.splice(payload.index, 1);
    },
    ingredientUp(
      state,
      { payload }: { payload: TIngredient & { id: string } }
    ) {
      const index = state.constructorItems.ingredients.findIndex(
        (i) => i.id === payload.id
      );
      if (index > 0) {
        [
          state.constructorItems.ingredients[index - 1],
          state.constructorItems.ingredients[index]
        ] = [
          state.constructorItems.ingredients[index],
          state.constructorItems.ingredients[index - 1]
        ];
      }
    },
    ingredientDown(
      state,
      { payload }: { payload: TIngredient & { id: string } }
    ) {
      const index = state.constructorItems.ingredients.findIndex(
        (i) => i.id === payload.id
      );
      if (index < state.constructorItems.ingredients.length - 1) {
        [
          state.constructorItems.ingredients[index + 1],
          state.constructorItems.ingredients[index]
        ] = [
          state.constructorItems.ingredients[index],
          state.constructorItems.ingredients[index + 1]
        ];
      }
    },
    resetOrderModal(state) {
      state.orderModalData = null;
    },
    closeModalRequest(state) {
      state.orderRequest = false;
      state.orderModalData = null;
      state.constructorItems = { bun: null, ingredients: [] };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.fulfilled, (state, { payload }) => {
        state.ingredients = payload;
      })
      .addCase(fetchFeeds.fulfilled, (state, { payload }) => {
        state.orders = payload.orders;
        state.totalOrders = payload.total;
        state.ordersToday = payload.totalToday;
      })
      .addCase(fetchOrderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchOrderBurger.fulfilled, (state, { payload }) => {
        state.orderModalData = payload.order;
        state.orderRequest = false;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, { payload }) => {
        state.currentOrder = payload.orders[0];
      })
      .addCase(fetchRegisterUser.fulfilled, (state) => {
        state.isAuthorized = true;
      })
      .addCase(fetchLoginUser.fulfilled, (state, { payload }) => {
        state.name = payload.user.name;
        state.email = payload.user.email;
        state.isAuthorized = true;
      })
      .addCase(fetchLogoutUser.fulfilled, (state) => {
        state.isAuthorized = false;
        state.name = '';
        state.email = '';
      })
      .addCase(getUserThunk.fulfilled, (state, { payload }) => {
        state.name = payload.user.name;
        state.email = payload.user.email;
        state.isAuthorized = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, { payload }) => {
        state.userOrders = payload;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, { payload }) => {
        state.name = payload.user.name;
        state.email = payload.user.email;
      })
      .addMatcher(pendingMatcher, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addMatcher(rejectedMatcher, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message;
      })
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.isLoading = false;
        }
      );
  }
});

export const selectIngredients = (s: RootState) => s.stellarburger.ingredients;
export const selectConstructorItems = (s: RootState) =>
  s.stellarburger.constructorItems;
export const selectOrderRequest = (s: RootState) =>
  s.stellarburger.orderRequest;
export const selectOrderModalData = (s: RootState) =>
  s.stellarburger.orderModalData;
export const selectOrders = (s: RootState) => s.stellarburger.orders;
export const selectUserOrders = (s: RootState) => s.stellarburger.userOrders;
export const selectTotalOrders = (s: RootState) => s.stellarburger.totalOrders;
export const selectOrdersToday = (s: RootState) => s.stellarburger.ordersToday;
export const selectIsAuthorized = (s: RootState) =>
  s.stellarburger.isAuthorized;
export const selectCurrentOrder = (s: RootState) =>
  s.stellarburger.currentOrder;
export const selectName = (s: RootState) => s.stellarburger.name;
export const selectEmail = (s: RootState) => s.stellarburger.email;
export const selectIsLoading = (s: RootState) => s.stellarburger.isLoading;

export const {
  addIngredient,
  removeIngredient,
  ingredientUp,
  ingredientDown,
  resetOrderModal,
  closeModalRequest
} = stellarBurgerSlice.actions;

export default stellarBurgerSlice.reducer;
