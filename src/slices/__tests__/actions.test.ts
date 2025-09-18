import { stellarBurgerSlice, IBurgerState } from '../stellarBurgerSlice';
import { mockBun, mockMain, mockSauce } from '../mockData';

describe('Экшены (extraReducers, async actions) stellarBurgerSlice', () => {
  let initialState: IBurgerState;

  beforeEach(() => {
    initialState = {
      ingredients: [],
      constructorItems: {
        bun: null,
        ingredients: []
      },
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
  });

  describe('fetchIngredients', () => {
    it('Установка isLoading в true при pending', () => {
      const action = { type: 'ingredients/fetchIngredients/pending' };
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });

    it('Установка isLoading в false и сохранение данных при fulfilled', () => {
      const ingredients = [mockBun, mockMain, mockSauce];
      const action = {
        type: 'ingredients/fetchIngredients/fulfilled',
        payload: ingredients
      };

      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.ingredients).toEqual(ingredients);
    });

    it('Установка isLoading в false и сохранение ошибки при rejected', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: 'ingredients/fetchIngredients/rejected',
        error: { message: errorMessage }
      };

      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchFeeds', () => {
    it('Установка isLoading в true при pending', () => {
      const action = { type: 'fedds/fetchFeeds/pending' };
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });

    it('Установка isLoading в false и сохранение данных при fulfilled', () => {
      const feedsData = {
        orders: [
          {
            _id: '1',
            status: 'done',
            name: 'Заказ 1',
            createdAt: '2025-17-09',
            updatedAt: '2025-17-09',
            number: 1,
            ingredients: []
          }
        ],
        total: 100,
        totalToday: 10
      };

      const action = { type: 'fedds/fetchFeeds/fulfilled', payload: feedsData };
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.orders).toEqual(feedsData.orders);
      expect(newState.totalOrders).toBe(feedsData.total);
      expect(newState.ordersToday).toBe(feedsData.totalToday);
    });

    it('Установка isLoading в false и сохранение ошибки при rejected', () => {
      const errorMessage = 'Ошибка загрузки ленты';
      const action = {
        type: 'fedds/fetchFeeds/rejected',
        error: { message: errorMessage }
      };
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchOrderBurger', () => {
    it('Установка orderRequest в true при pending', () => {
      const action = { type: 'order/fetchOrderBurger/pending' };
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.orderRequest).toBe(true);
    });

    it('Сохранение данных заказа и сброс orderRequest при fulfilled', () => {
      const orderData = {
        order: {
          _id: '1',
          status: 'done',
          name: 'Заказ 1',
          createdAt: '2025-17-09',
          updatedAt: '2025-17-09',
          number: 1,
          ingredients: []
        }
      };

      const action = {
        type: 'order/fetchOrderBurger/fulfilled',
        payload: orderData
      };
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.orderModalData).toEqual(orderData.order);
      expect(newState.orderRequest).toBe(false);
      expect(newState.isLoading).toBe(false);
    });

    it('Установка isLoading в false и сохранение ошибки при rejected (orderRequest без изменений)', () => {
      const errorMessage = 'Ошибка создания заказа';
      const action = {
        type: 'order/fetchOrderBurger/rejected',
        error: { message: errorMessage }
      };

      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.orderRequest).toBe(false);
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBeUndefined();
    });
  });

  describe('fetchLoginUser', () => {
    it('Установка isLoading в true при pending', () => {
      const action = { type: 'user/login/pending' };
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });

    it('Установка isLoading в false и сохранение данных пользователя при fulfilled', () => {
      const userData = {
        user: { name: 'Тест', email: 'test@example.com' }
      };

      const action = { type: 'user/login/fulfilled', payload: userData };
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.name).toBe(userData.user.name);
      expect(newState.email).toBe(userData.user.email);
      expect(newState.isAuthorized).toBe(true);
    });

    it('Установка isLoading в false и сохранение ошибки при rejected', () => {
      const errorMessage = 'Ошибка авторизации';
      const action = {
        type: 'user/login/rejected',
        error: { message: errorMessage }
      };

      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchRegisterUser', () => {
    it('Установка isLoading в true при pending', () => {
      const action = { type: 'user/register/pending' };
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });

    it('Установка isLoading в false и isAuthorized в true при fulfilled', () => {
      const action = { type: 'user/register/fulfilled' };
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.isAuthorized).toBe(true);
    });

    it('Установка isLoading в false и сохранение ошибки при rejected', () => {
      const errorMessage = 'Ошибка регистрации';
      const action = {
        type: 'user/register/rejected',
        error: { message: errorMessage }
      };

      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('getUserThunk', () => {
    it('Установка isLoading в true при pending', () => {
      const action = { type: 'user/getUser/pending' };
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });

    it('Установка isLoading в false и сохранение данных пользователя при fulfilled', () => {
      const userData = {
        user: { name: 'Тест', email: 'test@example.com' }
      };

      const action = { type: 'user/getUser/fulfilled', payload: userData };
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.name).toBe(userData.user.name);
      expect(newState.email).toBe(userData.user.email);
      expect(newState.isAuthorized).toBe(true);
    });

    it('Установка isLoading в false и сохранение ошибки при rejected (данные пользователя без изменений)', () => {
      const errorMessage = 'Ошибка получения пользователя';
      const stateWithUser = {
        ...initialState,
        name: 'Тест',
        email: 'test@example.com',
        isAuthorized: true
      };

      const action = {
        type: 'user/getUser/rejected',
        error: { message: errorMessage }
      };

      const newState = stellarBurgerSlice.reducer(stateWithUser, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.name).toBe('Тест');
      expect(newState.email).toBe('test@example.com');
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchLogoutUser', () => {
    it('Установка isLoading в true при pending', () => {
      const action = { type: 'user/logout/pending' };
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });

    it('Установка isLoading в false и сброс данных пользователя при fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        name: 'Тест',
        email: 'test@example.com',
        isAuthorized: true
      };

      const action = { type: 'user/logout/fulfilled' };
      const newState = stellarBurgerSlice.reducer(stateWithUser, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.name).toBe('');
      expect(newState.email).toBe('');
      expect(newState.isAuthorized).toBe(false);
    });

    it('Установка isLoading в false и сохранение ошибки при rejected', () => {
      const errorMessage = 'Ошибка выхода';
      const action = {
        type: 'user/logout/rejected',
        error: { message: errorMessage }
      };

      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchUserOrders', () => {
    it('Установка isLoading в true при pending', () => {
      const action = { type: 'orders/userOrders/pending' };
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });

    it('Установка isLoading в false и сохранение заказов пользователя при fulfilled', () => {
      const userOrders = [
        {
          _id: '1',
          status: 'done',
          name: 'Заказ 1',
          createdAt: '2025-17-09',
          updatedAt: '2025-17-09',
          number: 1,
          ingredients: []
        }
      ];

      const action = { type: 'orders/userOrders/fulfilled', payload: userOrders };
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.userOrders).toEqual(userOrders);
    });

    it('Установка isLoading в false и сохранение ошибки при rejected', () => {
      const errorMessage = 'Ошибка загрузки заказов пользователя';
      const action = {
        type: 'orders/userOrders/rejected',
        error: { message: errorMessage }
      };

      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchUpdateUser', () => {
    it('Установка isLoading в true при pending', () => {
      const action = { type: 'user/updateUser/pending' };
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });

    it('Установка isLoading в false и обновление данных пользователя при fulfilled', () => {
      const userData = {
        user: { name: 'Новый Тест', email: 'new-test@example.com' }
      };

      const action = { type: 'user/updateUser/fulfilled', payload: userData };
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.name).toBe(userData.user.name);
      expect(newState.email).toBe(userData.user.email);
    });

    it('Установка isLoading в false и сохранение ошибки при rejected', () => {
      const errorMessage = 'Ошибка обновления пользователя';
      const action = {
        type: 'user/updateUser/rejected',
        error: { message: errorMessage }
      };

      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchOrderByNumber', () => {
    it('Установка isLoading в false и сохранение текущего заказа при fulfilled', () => {
      const orderData = {
        _id: '1',
        status: 'done',
        name: 'Заказ 1',
        createdAt: '2025-17-09',
        updatedAt: '2025-17-09',
        number: 1,
        ingredients: []
      };

      const action = {
        type: 'order/fetchOrderByNumber/fulfilled',
        payload: { orders: [orderData] }
      };

      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.currentOrder).toEqual(orderData);
    });

    it('Установка isLoading в false и сохранение ошибки при rejected', () => {
      const errorMessage = 'Ошибка получения заказа';
      const action = {
        type: 'order/fetchOrderByNumber/rejected',
        error: { message: errorMessage }
      };

      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBeUndefined();
    });
  });
});
