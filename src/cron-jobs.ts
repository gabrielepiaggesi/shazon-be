import * as Cron from 'cron';
import { scrapeAmazonOffersList, scrapeAmazonProducts } from './amazon-scraper';
import { updateOffers, updateProducts } from './feed';


const CronJob = Cron.CronJob;

export const initJobs = (app) => {
    const productsJob = 
    new CronJob('*/10 * * * *', async function() {  // At 12:00 PM, only on Monday (ora server + 1)

        let page = 0;
        let intervalId = setInterval(async function() { 
            if (page >= 30) {
                clearInterval(intervalId);
                return;
            }
            try {
                const newProducts = await scrapeAmazonProducts(page);
                updateProducts(page, newProducts);
                console.log('Success scraping products', page);
                page++;
                if (page >= 30) clearInterval(intervalId);
            } catch(e) {
                console.log(e);
                console.log('Impossibile scraping products', page);
            }
        }, 10000);
        if (page >= 30) clearInterval(intervalId);

    }, null, true, 'Europe/Rome');
    productsJob.start();



    const offersJob = 
    new CronJob('*/10 * * * *', async function() {  // At 12:00 PM, only on Monday (ora server + 1)

        let page = 0;
        let intervalId = setInterval(async function() { 
            if (page >= 30) {
                clearInterval(intervalId);
                return;
            }
            try {
                const newOffers = await scrapeAmazonOffersList(page);
                updateOffers(page, newOffers);
                console.log('Success scraping offers', page);
                page++;
            } catch(e) {
                console.log(e);
                console.log('Impossibile scraping offers', page);
            }
        }, 10000);
        if (page >= 30) clearInterval(intervalId);

    }, null, true, 'Europe/Rome');
    offersJob.start();
}