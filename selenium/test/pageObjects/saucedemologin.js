const {By} = require('selenium-webdriver');
const PageBase = require('./pagebase');

class SauceDemoLogin extends PageBase {
  constructor(
      webdriver,
      driver,
      targetUrl = 'https://www.saucedemo.com/',
      waitTimeout = 10000,
  ) {
    super(webdriver, driver, targetUrl, waitTimeout);
  }

  async userLogin(userName, password) {
    await this.driver.findElement(By.id('user-name')).sendKeys(userName);
    await this.driver.findElement(By.id('password')).sendKeys(password);
    await this.driver.findElement(
        By.xpath('//input[@value=\'LOGIN\']')).click();
    console.log('clicked, waiting');
    await this.getTextByClass('product_lab');
  }
}

module.exports = SauceDemoLogin;
