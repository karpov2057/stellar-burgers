import {
  selectIngredients,
  selectIsLoading,
  selectConstructorItems,
  selectOrderModalData,
  selectOrderRequest,
  selectOrders,
  selectUserOrders,
  selectTotalOrders,
  selectOrdersToday,
  selectIsAuthorized,
  selectName,
  selectEmail,
  selectCurrentOrder,
  selectIngredientCount
} from '../stellarBurgerSlice';
import {
  mockBun,
  mockMain,
  mockConstructorIngredient
} from '../mockData';

describe('Селекторы stellarBurgerSlice', () => {
  it('Экспортируется правильно', () => {
    expect(selectIngredients).toBeDefined();
    expect(selectIsLoading).toBeDefined();
    expect(selectConstructorItems).toBeDefined();
    expect(selectOrderModalData).toBeDefined();
    expect(selectOrderRequest).toBeDefined();
    expect(selectOrders).toBeDefined();
    expect(selectUserOrders).toBeDefined();
    expect(selectTotalOrders).toBeDefined();
    expect(selectOrdersToday).toBeDefined();
    expect(selectIsAuthorized).toBeDefined();
    expect(selectName).toBeDefined();
    expect(selectEmail).toBeDefined();
    expect(selectCurrentOrder).toBeDefined();
    expect(selectIngredientCount).toBeDefined();
  });

  it('Работает с состоянием правильно', () => {
    const testState = {
      stellarburger: {
        ingredients: [mockBun, mockMain],
        constructorItems: {
          bun: mockBun,
          ingredients: [mockConstructorIngredient]
        },
        isLoading: true,
        error: '',
        orderModalData: null,
        orderRequest: false,
        orders: [],
        userOrders: [],
        totalOrders: 100,
        ordersToday: 10,
        isAuthorized: true,
        name: 'Тест',
        email: 'test@example.com',
        currentOrder: null
      }
    } as any;

    expect(selectIngredients(testState)).toEqual([mockBun, mockMain]);
    expect(selectIsLoading(testState)).toBe(true);

    expect(selectConstructorItems(testState)).toEqual({
      bun: mockBun,
      ingredients: [mockConstructorIngredient]
    });

    expect(selectOrderModalData(testState)).toBeNull();
    expect(selectOrderRequest(testState)).toBe(false);
    expect(selectOrders(testState)).toEqual([]);
    expect(selectUserOrders(testState)).toEqual([]);
    expect(selectTotalOrders(testState)).toBe(100);
    expect(selectOrdersToday(testState)).toBe(10);
    expect(selectIsAuthorized(testState)).toBe(true);
    expect(selectName(testState)).toBe('Тест');
    expect(selectEmail(testState)).toBe('test@example.com');
    expect(selectCurrentOrder(testState)).toBeNull();

    expect(
      selectIngredientCount(mockBun._id, 'bun')(testState)
    ).toBe(2);

    expect(
      selectIngredientCount(mockMain._id, 'main')(testState)
    ).toBe(1);
  });
});
