const {By} = require('selenium-webdriver');
const PageBase = require('./pagebase');

class CheckoutStepTwo extends PageBase {
  constructor(
      webdriver,
      driver,
      targetUrl = 'https://www.saucedemo.com/checkout-step-two.html',
      waitTimeout = 10000,
  ) {
    super(webdriver, driver, targetUrl, waitTimeout);
  }

  async numberOfItems(itemName) {
    try {
      const itemNameElement = await this.getItemNameElement(itemName);
      const itemQtyXpath = '../../../*[@class=\'summary_quantity\']';
      const itemQtyStr = await itemNameElement.findElement(
          By.xpath(itemQtyXpath)).getText();
      const itemQtyNum = parseInt(itemQtyStr, 10);
      return itemQtyNum;
    } catch (error) {
      console.log(`returning 0, could not find: ${itemName}`);
      return 0;
    }
  }
}

module.exports = CheckoutStepTwo;
