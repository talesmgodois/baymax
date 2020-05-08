import puppeteer from 'puppeteer';
import { ETestWebsites } from '../websites';

class GoogleCrwl {
    private url = ETestWebsites.GOOGLE;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async getGoogleScreenShot() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(this.url);
        await page.pdf({ path: 'hn.pdf', format: 'A4' });
        await browser.close();
        return true;
    }
}

export default new GoogleCrwl();
