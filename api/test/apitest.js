class ApiTest {
  async jsonCompare(json1, json2) {
    const jsonString1 = JSON.stringify(json1);
    const jsonString2 = JSON.stringify(json2);
    this.plog(jsonString1);
    this.plog(jsonString2);
    return jsonString1 == jsonString2;
  }

  async plog(text) {
    console.log(`       ${text}`);
  }
}

module.exports = ApiTest;
