const webdriver = require('selenium-webdriver');

const assert = require('assert');

const SauceDemoLogin = require('./pageObjects/saucedemologin');
const Inventory = require('./pageObjects/inventory');
const PageBase = require('./pageObjects/pagebase');
const Cart = require('./pageObjects/cart');
const CheckoutStepOne = require('./pageObjects/checkout-step-one');
const CheckoutStepTwo = require('./pageObjects/checkout-step-two');

const pref = new webdriver.logging.Preferences();
const driver = new webdriver.Builder()
    .forBrowser('firefox')
    .setLoggingPrefs(pref)
    .build();

describe('saucedemo example', () => {
  before(async () => {
    this.sauceDemoLogin = new SauceDemoLogin(webdriver, driver);
    this.inventory = new Inventory(webdriver, driver);
    this.pageBase = new PageBase(webdriver, driver);
    this.cart = new Cart(webdriver, driver);
    this.checkoutStepOne = new CheckoutStepOne(webdriver, driver);
    this.checkoutStepTwo = new CheckoutStepTwo(webdriver, driver);
  });

  it('Log into the site', async () => {
    await driver.get('https://www.saucedemo.com/');

    const text1 = await this.pageBase.getTextByClass('product_label');
    assert(text1.match('ERROR: not found'));

    await this.sauceDemoLogin.userLogin('standard_user', 'secret_sauce');

    const text2 = await this.pageBase.getTextByClass('product_label', 'text:');
    assert(text2.match('Products'));
  });

  it('Sort the items', async () => {
    await this.inventory.sortBy('za');
    const zaFirstItem = await this.inventory.getFirstItemName();
    await this.inventory.sortBy('az');
    const azFirstItem = await this.inventory.getFirstItemName();
    this.pageBase.plog(`${azFirstItem} should not equal ${zaFirstItem}`);

    await this.inventory.sortBy('lohi');
    const loFirstPrice = await this.inventory.getFirstItemPrice();
    await this.inventory.sortBy('hilo');
    const hiFirstPrice = await this.inventory.getFirstItemPrice();
    this.pageBase.plog(`${loFirstPrice} should not equal ${hiFirstPrice}`);
  });

  it('Add two or more items to the shopping cart', async () => {
    await this.inventory.addToCartByName('Test.allTheThings() T-Shirt (Red)');
    await this.inventory.addToCartByName('Sauce Labs Bolt T-Shirt');
  });

  it('Visit the shopping cart', async () => {
    await this.inventory.visitCart();
    const text1 = await this.pageBase.getTextByClass('subheader');
    assert(text1.match('Your Cart'));
    const qty1 = await this.cart.numberOfItems(
        'Test.allTheThings() T-Shirt (Red)');
    const qty2 = await this.cart.numberOfItems('Sauce Labs Bolt T-Shirt');
    const qty3 = await this.cart.numberOfItems('Sauce Labs Bike Light');
    // next 3 asserts: Assert that the items that you added are in the cart
    assert.equal(qty1, 1, 'correct item, QTY 1');
    assert.equal(qty2, 1, 'correct item, QTY 1');
    assert.equal(qty3, 0, 'incorrect item, QTY 0');
  });

  it('Remove an item and then continue shopping', async () => {
    await this.cart.removeItem('Test.allTheThings() T-Shirt (Red)');
    await this.pageBase.clickText('Continue Shopping');
    const text2 = await this.pageBase.getTextByClass('product_label');
    assert(text2.match('Products'));
  });

  it('Add another item', async () => {
    await this.inventory.addToCartByName('Sauce Labs Bike Light');
  });

  it('Checkout', async () => {
    await this.inventory.visitCart();
    const text1 = await this.pageBase.getTextByClass('subheader');
    assert(text1.match('Your Cart'));
    const cartQty1 = await this.cart.numberOfItems(
        'Test.allTheThings() T-Shirt (Red)');
    const cartQty2 = await this.cart.numberOfItems('Sauce Labs Bolt T-Shirt');
    const cartQty3 = await this.cart.numberOfItems('Sauce Labs Bike Light');
    const cartPrice2 = await this.cart.itemsPrice('Sauce Labs Bolt T-Shirt');
    this.pageBase.plog(`cartPrice2: ${cartPrice2}`);
    const cartPrice3 = await this.cart.itemsPrice('Sauce Labs Bike Light');
    // next 3 asserts: On cart page, Assert you are purchasing the correct items
    assert.equal(cartQty1, 0, 'removed item should by QTY 0');
    assert.equal(cartQty2, 1, 'kept item should be QTY 1');
    assert.equal(cartQty3, 1, 'new item should be QTY 1');

    await this.pageBase.clickText('CHECKOUT');
    const text2 = await this.pageBase.getTextByClass('subheader');
    assert(text2.match('Checkout: Your Information'));

    await this.checkoutStepOne.doAll('Steve', 'Rodgers', '12345');
    const text3 = await this.pageBase.getTextByClass(
        'subheader', 'after doAll, page has:');
    assert(text3.match('Checkout: Overview'));

    const checkoutQty1 = await this.checkoutStepTwo.numberOfItems(
        'Test.allTheThings() T-Shirt (Red)');
    const checkoutQty2 = await this.checkoutStepTwo.numberOfItems(
        'Sauce Labs Bolt T-Shirt');
    const checkoutQty3 = await this.checkoutStepTwo.numberOfItems(
        'Sauce Labs Bike Light');
    // next 3 asserts: On Checkout page--
    // Assert you are purchasing the correct items
    assert.equal(checkoutQty1, 0, 'removed item should by QTY 0');
    assert.equal(checkoutQty2, 1, 'kept item should be QTY 1');
    assert.equal(checkoutQty3, 1, 'new item should be QTY 1');

    const checkoutPrice2 = await this.checkoutStepTwo.itemsPrice(
        'Sauce Labs Bolt T-Shirt');
    const checkoutPrice3 = await this.checkoutStepTwo.itemsPrice(
        'Sauce Labs Bike Light');
    this.pageBase.plog(`${checkoutPrice2} vs ${cartPrice2}`);
    assert.equal(checkoutPrice2, cartPrice2,
        'checkout price 2 matches cart price');
    assert.equal(checkoutPrice3, cartPrice3,
        'checkout price 3 matches cart price');

    this.pageBase.plog(`${checkoutPrice2} X ${checkoutQty2}`);

    const expectedSubtotal = (checkoutPrice2 * checkoutQty2) +
    (checkoutPrice3 * checkoutQty3);
    this.pageBase.plog(`expected subtotal: ${expectedSubtotal}`);
    const actualSubtotal = await this.pageBase.getTextByClass(
        'summary_subtotal_label');
    this.pageBase.plog(`actual subtotal: ${actualSubtotal}`);

    // 8% tax
    const expectedTotal = (expectedSubtotal * 1.08).toFixed(2);
    this.pageBase.plog(`expected total: ${expectedTotal}`);
    const actualTotal = await this.pageBase.getTextByClass(
        'summary_total_label');
    this.pageBase.plog(`actual total: ${actualTotal}`);

    // Next two asserts: Assert the total price
    assert(actualTotal.includes(expectedTotal),
        'total is mathmatically correct');
    assert(actualTotal.includes('$28.06'), 'total matches expectation');

    await this.pageBase.clickText('FINISH');
    const text4 = await this.pageBase.getTextByClass(
        'subheader', 'after clicking finish, page has:');
    assert(text4.match('Finish'));
  });
});
