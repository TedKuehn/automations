const {By} = require('selenium-webdriver');
const PageBase = require('./pagebase');

class CheckoutStepOne extends PageBase {
  constructor(
      webdriver,
      driver,
      targetUrl = 'https://www.saucedemo.com/checkout-step-one.html',
      waitTimeout = 10000,
  ) {
    super(webdriver, driver, targetUrl, waitTimeout);
  }


  async doAll(firstName, lastName, zipCode) {
    await this.driver.findElement(By.id('first-name')).sendKeys(firstName);
    await this.driver.findElement(By.id('last-name')).sendKeys(lastName);
    await this.driver.findElement(By.id('postal-code')).sendKeys(zipCode);
    await this.driver.findElement(
        By.xpath('//input[@value=\'CONTINUE\']')).click();
    const taxText = await this.getTextByClass('summary_tax_label');
    console.log(`click took us to new page if tax has number: ${taxText}`);
  }
}

module.exports = CheckoutStepOne;
