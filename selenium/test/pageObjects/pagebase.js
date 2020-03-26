const {By} = require('selenium-webdriver');

class PageBase {
  constructor(
      webdriver,
      driver,
      waitTimeout = 10000,
      targetUrl = 'https://www.saucedemo.com/',
  ) {
    this.webdriver = webdriver;
    this.driver = driver;
    this.waitTimeout = waitTimeout;
    this.targetUrl = targetUrl;
  }

  async plog(text) {
    console.log(`       ${text}`);
  }

  async getTextByClass(classText, logText = '') {
    let x = 10;
    while (x > 0) {
      try {
        const returnVal = await this.driver.findElement(
            By.xpath(`//*[@class='${classText}']`)).getText();
        if (!logText.match('')) this.plog(`${logText} ${returnVal}`);
        return returnVal;
      } catch (error) {
        if (!error.toString().includes('NoSuchElementError')) {
          console.error(error);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
      x -= 1;
    }
    return 'ERROR: not found';
  }

  async clickText(textToClick) {
    const clickXpath = `//*[text()='${textToClick}']`;
    await this.driver.findElement(By.xpath(clickXpath)).click();
  }

  async getItemNameElement(itemName) {
    const itemNameXpath = `//*[@class='cart_item']//*[text()='${itemName}']`;
    const itemNameElement = await this.driver.findElement(
        By.xpath(itemNameXpath));
    return itemNameElement;
  }

  async itemsPrice(itemName) {
    const itemNameElement = await this.getItemNameElement(itemName);
    const priceXpath = '../../..//*[@class=\'inventory_item_price\']';
    let priceStr = await itemNameElement.findElement(
        By.xpath(priceXpath)).getText();
    let priceNum = parseFloat(priceStr);
    while (isNaN(priceNum)) {
      priceStr = priceStr.substr(1);
      priceNum = parseFloat(priceStr);
    }
    return priceNum;
  }
}

module.exports = PageBase;
