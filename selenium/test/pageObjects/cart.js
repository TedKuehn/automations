const {By} = require('selenium-webdriver');
const PageBase = require('./pagebase');

class Cart extends PageBase {
  constructor(
      webdriver,
      driver,
      targetUrl = 'https://www.saucedemo.com/cart.html',
      waitTimeout = 10000,
  ) {
    super(webdriver, driver, targetUrl, waitTimeout);
  }

  async numberOfItems(itemName) {
    try {
      const itemNameElement = await this.getItemNameElement(itemName);
      const itemQtyXpath = '../../../*[@class=\'cart_quantity\']';
      const itemQty = await itemNameElement.findElement(
          By.xpath(itemQtyXpath)).getText();
      return itemQty;
    } catch (error) {
      this.plog(`returning 0, could not find: ${itemName}`);
      return 0;
    }
  }

  async removeItem(itemName) {
    const itemNameElement = await this.getItemNameElement(itemName);
    const removeXpath = '../../..//*[text()=\'REMOVE\']';
    await itemNameElement.findElement(By.xpath(removeXpath)).click();
  }
}

module.exports = Cart;
