import * as Cron from 'cron';
import { Browser, scrapeAmazonOffersList, scrapeAmazonProducts } from './amazon-scraper';
import { updateOffers, updateProducts } from './feed';


const CronJob = Cron.CronJob;

export async function closeBrowser() {
    await Browser.close();
}

export const initJobs = (app) => {

    const MAX_PAGE = 30;
    const SECONDS_WAIT_FOR_NEXT_PAGE = 30;

    const productsJob = 
    new CronJob('*/30 * * * *', async function() {  // At 12:00 PM, only on Monday (ora server + 1)

        let page = 0;
        let productIntervalId = setInterval(async function() { 
            if (page >= MAX_PAGE) {
                await closeBrowser();
                clearInterval(productIntervalId);
                return;
            }
            try {
                const newProducts = await scrapeAmazonProducts(page);
                updateProducts(page, newProducts);
                console.log('Success scraping products', page);
                page++;
                if (page >= MAX_PAGE) {
                    console.log('CLOSING BROWSER');
                    await closeBrowser();
                    clearInterval(productIntervalId);
                    return;
                }
            } catch(e) {
                console.log(e);
                console.log('Impossibile scraping products', page);
            }
        }, (SECONDS_WAIT_FOR_NEXT_PAGE * 1000));
        if (page >= MAX_PAGE) {
            await closeBrowser();
            clearInterval(productIntervalId);
            return;
        }

    }, null, true, 'Europe/Rome');
    productsJob.start();



    const offersJob = 
    new CronJob('*/30 * * * *', async function() {  // At 12:00 PM, only on Monday (ora server + 1)

        let page = 0;
        let offersIntervalId = setInterval(async function() { 
            if (page >= MAX_PAGE) {
                await closeBrowser();
                clearInterval(offersIntervalId);
                return;
            }
            try {
                const newOffers = await scrapeAmazonOffersList(page);
                updateOffers(page, newOffers);
                console.log('Success scraping offers', page);
                page++;
                if (page >= MAX_PAGE) {
                    await closeBrowser();
                    clearInterval(offersIntervalId);
                    return;
                }
            } catch(e) {
                console.log(e);
                console.log('Impossibile scraping offers', page);
            }
        }, (SECONDS_WAIT_FOR_NEXT_PAGE * 1000));
        if (page >= MAX_PAGE) {
            await closeBrowser();
            clearInterval(offersIntervalId);
            return;
        }

    }, null, true, 'Europe/Rome');
    offersJob.start();
}