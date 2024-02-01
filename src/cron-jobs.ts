import * as Cron from 'cron';
import { scrapeAmazonOffersList, scrapeAmazonProducts } from './amazon-scraper';
import { updateOffers, updateProducts } from './feed';


const CronJob = Cron.CronJob;

export const initJobs = (app) => {
    const productsJob = 
    new CronJob('*/10 * * * *', async function() {  // At 12:00 PM, only on Monday (ora server + 1)

        for (let i = 0; i <= 30; i++) {
            await setTimeout(async () => {
                const page = i;
                try {
                    const newProducts = await scrapeAmazonProducts(page);
                    updateProducts(page, newProducts);
                    console.log('Success scraping products', page);
                } catch(e) {
                    console.log(e);
                    console.log('Impossibile scraping products', page);
                    i--;
                }
            }, 5000);
        }

    }, null, true, 'Europe/Rome');
    productsJob.start();



    const offersJob = 
    new CronJob('*/10 * * * *', async function() {  // At 12:00 PM, only on Monday (ora server + 1)

        for (let i = 0; i <= 30; i++) {
            await setTimeout(async () => {
                const page = i;
                try {
                    const newOffers = await scrapeAmazonOffersList(page);
                    updateOffers(page, newOffers);
                    console.log('Success scraping offers', page);
                } catch(e) {
                    console.log(e);
                    console.log('Impossibile scraping offers', page);
                    i--;
                }
            }, 5000);
        }

    }, null, true, 'Europe/Rome');
    offersJob.start();
}