const {By} = require('selenium-webdriver');
const PageBase = require('./pagebase');

class Inventory extends PageBase {
  constructor(
      webdriver,
      driver,
      targetUrl = 'https://www.saucedemo.com/inventory.html',
      waitTimeout = 10000,
  ) {
    super(webdriver, driver, targetUrl, waitTimeout);
  }

  async sortBy(sortType) {
    const selectElem = await this.driver.findElement(
        By.xpath('//select[@class=\'product_sort_container\']'));
    await selectElem.click();
    await selectElem.findElement(By.css(`option[value='${sortType}']`)).click();
  }

  async getFirstItemName() {
    return this.getTextByClass('inventory_item_name');
  }

  async getFirstItemPrice() {
    return this.getTextByClass('inventory_item_price');
  }

  async addToCartByName(itemName) {
    try {
      const doubleXpath =
        `//*[@class='inventory_item_name' and text()='${itemName}']`;
      const nameElement = await this.driver.findElement(By.xpath(doubleXpath));
      const itemElement = await nameElement.findElement(By.xpath('../../..'));
      await itemElement.findElement(
          By.xpath('.//button[text()=\'ADD TO CART\']')).click();
    } catch (error) {
      if (error.toString().includes('StaleElement')) {
        console.log('Stale');
        this.addToCartByName(itemName);
      }
    }
  }

  async visitCart() {
    await this.driver.findElement(By.id('shopping_cart_container')).click();
  }
}

module.exports = Inventory;
