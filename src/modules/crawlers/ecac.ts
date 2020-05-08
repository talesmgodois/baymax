import puppeteer from 'puppeteer'
import { ETestWebsites } from '../websites'
import request from 'request'
import { readFileSync } from '../../lib/certificates';
import fetch from 'node-fetch';
import fs from 'fs';

const passphrase = 'BV2019'
class EcacCrwl {
  private url = ETestWebsites.ECAC

  public async getScreenShot(): Promise<boolean> {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto(this.url)
    await page.pdf({ path: 'hn.pdf', format: 'A4' })
    await browser.close()
    return true
  }

  public async getShot2(): Promise<any> {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    // const loginBtn = await page.waitForSelector('#caixa-login-certificado');
    // page.click(loginBtn.)
    // Enable Request Interception
    await page.setRequestInterception(true)

    // Client cert files

    // const { ca, cert, key } = await readFileSync(
    //   `${ __dirname }/certificados/BVA.pfx`,
    //   passphrase
    // ) as any;

    const cert = fs.readFileSync(`${ __dirname }/certificados/bva/cert.crt.pem`);
    const key = fs.readFileSync(`${ __dirname }/certificados/bva/cert.key.pem`);

    await page.on('request', (interceptedRequest) => {
      // Intercept Request, pull out request options, add in client cert
      const _options = {
        uri: interceptedRequest.url(),
        method: interceptedRequest.method(),
        headers: interceptedRequest.headers(),
        body: interceptedRequest.postData(),
        cert,
        key,

      }
      if (interceptedRequest.url() === ETestWebsites.ECAC_AUTH) {
        interceptedRequest.respond(_options)
      } else {
        interceptedRequest.continue()
      }
      // _options.headers['referer'] = ETestWebsites.ECAC
      // interceptedRequest.continue();
      // request(_options, function (
      //   err: any,
      //   resp: { statusCode: any; headers: { [x: string]: any } },
      //   body: any
      // ) {
      //   // Abort interceptedRequest on error
      //   if (err || (resp.headers && !resp.headers['content-type'].includes('html'))) {
      //     // console.error(`Unable to call ${ _options.uri }`, err)
      //     // return interceptedRequest.abort('connectionrefused')
      //     interceptedRequest.continue();
      //   } else {
      //     // console.log(resp);
      //     // Return retrieved response to interceptedRequest
      //     interceptedRequest.respond(_options)
      //   }
      // })
    })

    await page.goto(ETestWebsites.ECAC_AUTH)

    await page.pdf({
      path: `./download/${ Date.now() }-ecac.pdf`,
      format: 'A4',
    })

    await browser.close()
    return true
  }

  public async getShotByFetch(): Promise<any> {
    const passphrase = 'BV2019'

    const { cert, key } = await readFileSync(
      `${ __dirname }/certificados/BVA.pfx`,
      passphrase
    ) as any;
    return fetch("https://cav.receita.fazenda.gov.br/autenticacao/Login/Certificado?id=-1", {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
      },
      "referrerPolicy": "no-referrer-when-downgrade",
      "body": null,
      "method": "GET",
      "mode": "cors",
      cert,
      key,
    }).then(data => {
      console.log(data)
      return data;
    }).catch(err => {
      console.error(err);
      return err;
    });
  }

  public async getShot(): Promise<any> {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    let { ca, cert, key } = await readFileSync(
      `${ __dirname }/certificados/BVA.pfx`,
      passphrase
    ) as any;

    // const key = fs.readFileSync(`${ __dirname }/certificados/bva/BVA.key`);
    // const cert = fs.readFileSync(`${ __dirname }/certificados/bva/BVA.pem`);
    // const key = fs.readFileSync(`${ __dirname }/certificados/BVA.c2.pem`);

    // const cert = fs.readFileSync(`${ __dirname }/certificados/BVA.pfx`);

    await page.setRequestInterception(true)
    page.on('request', interceptedRequest => {
      // Intercept Request, pull out request options, add in client cert
      const options = {
        uri: interceptedRequest.url(),
        method: interceptedRequest.method(),
        headers: interceptedRequest.headers(),
        body: interceptedRequest.postData(),
        agentOptions: {
          // pfx: fs.readFileSync(`${ __dirname }/certificados/BVA.pfx`),
          passphrase,
          cert, key,
          referer: ETestWebsites.ECAC_HOME,
          securityOptions: 'SSL_OP_NO_SSLv3'
        }
      };

      if (interceptedRequest.url().startsWith("data:")) {
        return interceptedRequest.continue();
      }
      // if (interceptedRequest.url() === ETestWebsites.ECAC_AUTH) {
      request(options, function (err, resp, body) {
        // Abort interceptedRequest on error
        if (err) {
          console.error(`Unable to call ${ options.uri }`, err);
          interceptedRequest.continue();
        } else {
          // Return retrieved response to interceptedRequest
          interceptedRequest.respond({
            status: resp.statusCode,
            contentType: resp.headers['content-type'],
            headers: resp.headers,
            body: body,
          });
        }

      });
      // } else {
      //   return interceptedRequest.continue();
      // }

      // Fire off the request manually (example is using using 'request' lib)

    });
    await page.goto(ETestWebsites.ECAC_AUTH)
    // const form = await page.$('#frmLoginCert');
    // await form.evaluate(form => form.submit());

    await page.pdf({
      path: `./download/${ Date.now() }-ecac.pdf`,
      format: 'A4',
    })

    return true;
  }
}

export default new EcacCrwl()
