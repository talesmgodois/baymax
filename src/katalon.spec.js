
const { browser, by, element, Key, logging, ExpectedConditions } = require('protractor');
const EC = ExpectedConditions;

describe('Untitled Test Case', () => {

  beforeAll(async () => { });
  beforeEach(async () => { });

  it('should do something', async () => {
    await browser.get('https://cav.receita.fazenda.gov.br/autenticacao/login');
    await element(by.id("caixa-login-certificado")).click();
    await element(by.id("caixa-login-certificado")).click();
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    }));
  });
});