import * as orderFixture from '../fixtures/orders.json';

describe('Тест конструктора бургера', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
  });
  it('Список ингредиентов для выбора', () => {
    cy.get('[data-ingredient="bun"]').should('have.length.at.least', 1);
    cy.get('[data-ingredient="main"], [data-ingredient="sauce"]').should(
      'have.length.at.least',
      1
    );
  });
  describe('Проверка работы модальных окон', () => {
    beforeEach(() => {
      cy.get('#modals').as('modal').children().should('have.length', 0);
      cy.get('[data-ingredient="bun"]').first().as('firstBun').click();
      cy.get('@modal').children().should('have.length.at.least', 1);
    });
    describe('Проверка открытия модального окна ингредиента', () => {
      it('Модальное окно остается открытым при перезагрузке страницы', () => {
        cy.reload(true);
        cy.get('#modals').children().should('have.length.at.least', 1);
      });

      it('Модальное окно открывается у нужного ингредиента', () => {
        cy.fixture('ingredients').then((ingredientsData) => {
          const bunIngredient = ingredientsData.data.find(
            (ingredient: { type: string }) => ingredient.type === 'bun'
          );
          cy.get('@modal')
            .find('[data-testid="ingredient-name"]')
            .should('contain', bunIngredient.name);
        });
      });
    });
    describe('Проверка закрытия модального окна ингредиента', () => {
      it('Закрытие модального окна на кнопку крестика', () => {
        cy.get('@modal').find('[type="button"]').click();
        cy.get('@modal').children().should('have.length', 0);
      });

      it('Закрытие модального окна нажатием на overlay', () => {
        cy.get('@modal')
          .find('div:nth-child(2)')
          .click({ force: true, multiple: true });
        cy.get('@modal').children().should('have.length', 0);
      });

      it('Закрытие модального окна нажатием на Esc', () => {
        cy.get('body').type('{esc}');
        cy.get('@modal').children().should('have.length', 0);
      });
    });
  });
  describe('Процесс создания заказа', () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.setCookie('accessToken', 'token');
      localStorage.setItem('refreshToken', 'token');
      cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as(
        'getUsers'
      );
      cy.intercept('POST', '**/orders', { fixture: 'orders.json' }).as(
        'getOrders'
      );
      cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
        'getIngredients'
      );
      cy.visit('/');
      cy.wait('@getIngredients');
      cy.wait('@getUsers');
      cy.get('[data-ingredient="bun"]:first-of-type button')
        .as('firstBun')
        .click();
      cy.get('[data-ingredient="main"]:first-of-type button')
        .as('firstMain')
        .click();
      cy.get('[data-ingredient="sauce"]:first-of-type button')
        .as('firstSauce')
        .click();
      cy.get('[data-testid="burger-constructor"] [data-testid="bun-top"]')
        .children()
        .should('have.length', 1);
      cy.get('[data-testid="burger-constructor"] [data-testid="bun-bottom"]')
        .children()
        .should('have.length', 1);
      cy.get('[data-testid="burger-constructor"] ul:first-of-type')
        .children()
        .should('have.length', 2);
      cy.get('[data-testid="order-button"]').as('orderButton').click();
      cy.wait('@getOrders');
      cy.get('#modals').as('modal').children().should('have.length.at.least', 1);
    });
    afterEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
    });
    it('Оформить заказ может авторизованный пользователь', () => {
      cy.get('@modal').children().should('exist');
      cy.get('body').type('{esc}');
      cy.get(
        '[data-testid="burger-constructor"] [data-testid="bun-top"]'
      ).should('not.exist');
      cy.get(
        '[data-testid="burger-constructor"] [data-testid="bun-bottom"]'
      ).should('not.exist');
      cy.get(
        '[data-testid="burger-constructor"] ul:first-of-type [data-testid="main-ingredient"]'
      ).should('not.exist');
    });
    it('В модальном окне отображается корректный номер заказа', () => {
      cy.fixture('orders.json').then((data) => {
        const orderNumber = data.order.number;
        cy.get('@modal').should('contain', orderNumber);
      });
    });
  });
  describe('Добавление ингредиента в конструктор', () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
        'getIngredients'
      );
      cy.visit('/');
    });
    it('Добавление ингредиента в конструктор', () => {
      cy.get('[data-ingredient="main"]').first().as('mainIngredient');
      cy.get('@mainIngredient').find('button').click();
      cy.fixture('ingredients').then((ingredientsData) => {
        const mainIngredient = ingredientsData.data.find(
          (ingredient: { type: string }) => ingredient.type === 'main'
        );
        cy.get('[data-testid="burger-constructor"] ul:first-of-type')
          .children()
          .should('contain', mainIngredient.name);
      });
    });
  });
});
