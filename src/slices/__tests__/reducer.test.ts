import {
  stellarBurgerSlice,
  type IBurgerState,
  addIngredient,
  removeIngredient,
  ingredientUp,
  ingredientDown,
  closeModalRequest,
  resetOrderModal
} from '../stellarBurgerSlice';

import {
  mockBun,
  mockMain,
  mockSauce,
  mockConstructorIngredient
} from '../mockData';

describe('Редьюсеры stellarBurgerSlice', () => {
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
      orderModalData: null,
      orderRequest: false,
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

  describe('addIngredient', () => {
    it('Добавление в конструктор булок', () => {
      const action = addIngredient(mockBun);
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.constructorItems.bun).toEqual(mockBun);
      expect(newState.constructorItems.ingredients).toHaveLength(0);
    });

    it('Добавление в конструктор ингредиентов', () => {
      const action = addIngredient(mockMain);
      const newState = stellarBurgerSlice.reducer(initialState, action);

      expect(newState.constructorItems.bun).toBeNull();
      expect(newState.constructorItems.ingredients).toHaveLength(1);
      expect(newState.constructorItems.ingredients[0]).toMatchObject({
        ...mockMain,
        id: expect.any(String)
      });
    });

    it('При добавлении новой булки происходит замена булки', () => {
      const stateWithBun: IBurgerState = {
        ...initialState,
        constructorItems: {
          bun: mockBun,
          ingredients: []
        }
      };

      const newBun = { ...mockBun, _id: 'bun-2', name: 'New bun' };
      const action = addIngredient(newBun);
      const newState = stellarBurgerSlice.reducer(stateWithBun, action);

      expect(newState.constructorItems.bun).toEqual(newBun);
    });
  });

  describe('removeIngredient', () => {
    it('Удаляем ингредиент по индексу', () => {
      const stateWithIngredients: IBurgerState = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: [
            mockConstructorIngredient,
            { ...mockSauce, id: '643d69a5c3f7b9001cfa0943' }
          ]
        }
      };

      const action = removeIngredient({ index: 0 });
      const newState = stellarBurgerSlice.reducer(stateWithIngredients, action);

      expect(newState.constructorItems.ingredients).toHaveLength(1);
      expect(newState.constructorItems.ingredients[0]._id).toBe(
        '643d69a5c3f7b9001cfa0943'
      );
    });
  });

  describe('ingredientUp', () => {
    it('Перемещаем ингредиент вверх', () => {
      const stateWithIngredients: IBurgerState = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: [
            { ...mockMain, id: '643d69a5c3f7b9001cfa0941' },
            { ...mockSauce, id: '643d69a5c3f7b9001cfa0943' }
          ]
        }
      };

      const action = ingredientUp({
        ...mockSauce,
        id: '643d69a5c3f7b9001cfa0943'
      });

      const newState = stellarBurgerSlice.reducer(stateWithIngredients, action);

      expect(newState.constructorItems.ingredients[0]._id).toBe(
        '643d69a5c3f7b9001cfa0943'
      );
      expect(newState.constructorItems.ingredients[1]._id).toBe(
        '643d69a5c3f7b9001cfa0941'
      );
    });
  });

  describe('ingredientDown', () => {
    it('Перемещаем ингредиент вниз', () => {
      const stateWithIngredients: IBurgerState = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: [
            { ...mockMain, id: '643d69a5c3f7b9001cfa0941' },
            { ...mockSauce, id: '643d69a5c3f7b9001cfa0943' }
          ]
        }
      };

      const action = ingredientDown({
        ...mockMain,
        id: '643d69a5c3f7b9001cfa0941'
      });

      const newState = stellarBurgerSlice.reducer(stateWithIngredients, action);

      expect(newState.constructorItems.ingredients[0]._id).toBe(
        '643d69a5c3f7b9001cfa0943'
      );
      expect(newState.constructorItems.ingredients[1]._id).toBe(
        '643d69a5c3f7b9001cfa0941'
      );
    });
  });

  describe('closeModalRequest', () => {
    it('Сброс состояния модального окна заказа и конструктора', () => {
      const stateWithOrder: IBurgerState = {
        ...initialState,
        orderRequest: true,
        orderModalData: {
          _id: '1',
          status: 'done',
          name: 'Заказ 1',
          createdAt: '2025-16-09',
          updatedAt: '2025-16-09',
          number: 1,
          ingredients: []
        },
        constructorItems: {
          bun: mockBun,
          ingredients: [mockConstructorIngredient]
        }
      };

      const action = closeModalRequest();
      const newState = stellarBurgerSlice.reducer(stateWithOrder, action);

      expect(newState.orderRequest).toBe(false);
      expect(newState.orderModalData).toBeNull();
      expect(newState.constructorItems).toEqual({ bun: null, ingredients: [] });
    });
  });

  describe('resetOrderModal', () => {
    it('Сброс данных модального окна заказа', () => {
      const stateWithOrder: IBurgerState = {
        ...initialState,
        orderModalData: {
          _id: '1',
          status: 'done',
          name: 'Заказ 1',
          createdAt: '2025-16-09',
          updatedAt: '2025-16-09',
          number: 1,
          ingredients: []
        }
      };

      const action = resetOrderModal();
      const newState = stellarBurgerSlice.reducer(stateWithOrder, action);

      expect(newState.orderModalData).toBeNull();
    });
  });
});
