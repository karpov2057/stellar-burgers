import store, { RootState } from '../store';
import { stellarBurgerSlice } from '../../slices/stellarBurgerSlice';

describe('Store', () => {
  describe('rootReducer', () => {
    it('должен правильно инициализировать rootReducer', () => {
      const state = store.getState();

      expect(state).toHaveProperty('stellarburger');

      expect(state.stellarburger).toHaveProperty('ingredients');
      expect(state.stellarburger).toHaveProperty('constructorItems');
      expect(state.stellarburger).toHaveProperty('isLoading');
      expect(state.stellarburger).toHaveProperty('orderModalData');
      expect(state.stellarburger).toHaveProperty('orderRequest');
      expect(state.stellarburger).toHaveProperty('orders');
      expect(state.stellarburger).toHaveProperty('userOrders');
      expect(state.stellarburger).toHaveProperty('totalOrders');
      expect(state.stellarburger).toHaveProperty('ordersToday');
      expect(state.stellarburger).toHaveProperty('isAuthorized');
      expect(state.stellarburger).toHaveProperty('name');
      expect(state.stellarburger).toHaveProperty('email');
      expect(state.stellarburger).toHaveProperty('error');
      expect(state.stellarburger).toHaveProperty('currentOrder');
    });

    it('должен иметь правильные начальные значения', () => {
      const state = store.getState();

      expect(state.stellarburger.ingredients).toEqual([]);
      expect(state.stellarburger.constructorItems).toEqual({
        bun: null,
        ingredients: []
      });
      expect(state.stellarburger.isLoading).toBe(false);
      expect(state.stellarburger.orderModalData).toBeNull();
      expect(state.stellarburger.orderRequest).toBe(false);
      expect(state.stellarburger.orders).toEqual([]);
      expect(state.stellarburger.userOrders).toEqual([]);
      expect(state.stellarburger.totalOrders).toBe(0);
      expect(state.stellarburger.ordersToday).toBe(0);
      expect(state.stellarburger.isAuthorized).toBe(false);
      expect(state.stellarburger.name).toBe('');
      expect(state.stellarburger.email).toBe('');
      expect(state.stellarburger.error).toBeUndefined();
      expect(state.stellarburger.currentOrder).toBeNull();
    });

    it('должен обрабатывать экшены stellarBurgerSlice (addIngredient)', () => {
      const mockIngredient: any = {
        _id: 'test-1',
        name: 'Тестовый ингредиент',
        type: 'main',
        proteins: 10,
        fat: 5,
        carbohydrates: 15,
        calories: 100,
        price: 50,
        image: 'test.png',
        image_large: 'test-large.png',
        image_mobile: 'test-mobile.png'
      };

      store.dispatch(stellarBurgerSlice.actions.addIngredient(mockIngredient));

      const newState = store.getState();

      expect(newState.stellarburger.constructorItems.ingredients).toHaveLength(1);
      expect(newState.stellarburger.constructorItems.ingredients[0]).toMatchObject({
        ...mockIngredient,
        id: expect.any(String)
      });
    });

    it('должен корректно устанавливать булку (addIngredient с type="bun")', () => {
      const bun: any = {
        _id: 'bun-1',
        name: 'Булка',
        type: 'bun',
        proteins: 5,
        fat: 3,
        carbohydrates: 20,
        calories: 150,
        price: 80,
        image: 'bun.png',
        image_large: 'bun-large.png',
        image_mobile: 'bun-mobile.png'
      };

      store.dispatch(stellarBurgerSlice.actions.addIngredient(bun));

      const newState = store.getState();
      expect(newState.stellarburger.constructorItems.bun?._id).toBe('bun-1');
    });
  });

  describe('Редьюсер не мутирует состояние', () => {
    it('должен возвращать то же состояние при неизвестном экшене', () => {
      const initialState = stellarBurgerSlice.getInitialState();
      const unknownAction = { type: 'UNKNOWN_ACTION' };

      const newState = stellarBurgerSlice.reducer(initialState, unknownAction as any);

      expect(newState).toEqual(initialState);
    });

    it('должен возвращать то же состояние при пустом type', () => {
      const initialState = stellarBurgerSlice.getInitialState();
      const emptyAction = { type: '' };

      const newState = stellarBurgerSlice.reducer(initialState, emptyAction as any);

      expect(newState).toEqual(initialState);
    });

  });

  describe('Типы', () => {
    it('должен иметь правильный тип RootState', () => {
      const state: RootState = store.getState();

      expect(typeof state.stellarburger.ingredients).toBe('object');
      expect(Array.isArray(state.stellarburger.ingredients)).toBe(true);
    });
  });
});
