import * as Cron from 'cron';
import { Browser, scrapeAmazonOffersList, scrapeAmazonProducts } from './amazon-scraper';
import { updateOffers, updateProducts } from './feed';
import puppeteer, { Browser as PuppeteerBrowser } from 'puppeteer';
import { delay } from './utils';

const CronJob = Cron.CronJob;
const port = process.env.PORT || 8000;

export async function closeBrowser(Browser: PuppeteerBrowser) {
    console.log('CLOSE BROWSER');
    await Browser.disconnect();
    await Browser.close();
    return Browser;
}

export async function openBrowser() {
    const headless = !(port === 8000);
    console.log('OPEN NEW BROWSER', headless);
    const Browser: PuppeteerBrowser = await puppeteer.launch({
        headless,
        args: port === 8000 ? [] : [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            `--window-size=1512,949`,
            "--disable-dev-shm-usage",
            "--single-process",
            "--no-zygote",
        ],
        defaultViewport: {
            width: 1512,
            height: 949
        }
    });
    return Browser;
}

export const initJobs = async (app) => {

    const MAX_PAGE = 30;
    const SECONDS_WAIT_FOR_NEXT_PAGE = 30;

    const productsJob = 
    new CronJob('*/30 * * * *', async function() {  // At 12:00 PM, only on Monday (ora server + 1)

        let Browser = await openBrowser();
        let page = 0;
        while(page < MAX_PAGE) {
            await delay(SECONDS_WAIT_FOR_NEXT_PAGE * 1000);
            try {
                const newProducts = await scrapeAmazonProducts(page, Browser);
                updateProducts(page, newProducts);
                console.log('----------- success products', page);
                page++;
            } catch(e) {
                console.log('----------- error products', page);
            }
        }
        Browser = await closeBrowser(Browser);

    }, null, true, 'Europe/Rome');
    productsJob.start();


    const offersJob = 
    new CronJob('*/30 * * * *', async function() {  // At 12:00 PM, only on Monday (ora server + 1)

        let Browser = await openBrowser();
        let page = 0;
        while(page < MAX_PAGE) {
            await delay(SECONDS_WAIT_FOR_NEXT_PAGE * 1000);
            try {
                const newOffers = await scrapeAmazonOffersList(page, Browser);
                updateOffers(page, newOffers);
                console.log('----------- success offers', page);
                page++;
            } catch(e) {
                console.log('----------- error offers', page);
            }
        }
        Browser = await closeBrowser(Browser);

    }, null, true, 'Europe/Rome');
    offersJob.start();
}