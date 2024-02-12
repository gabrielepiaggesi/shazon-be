import * as Cron from 'cron';
import { offersJob, productsJob } from './amazon-scraper';
import { delay } from './utils';
const CronJob = Cron.CronJob;

export const initJobs = async (app) => {
    await delay(30 * 1000);
    await productsJob();
    await offersJob();

    const startAmazonJob = 
    new CronJob('*/30 * * * *', async function() {  // At 12:00 PM, only on Monday (ora server + 1)
        await offersJob();
        await delay(30 * 1000);
        await productsJob();
    }, null, true, 'Europe/Rome');
    startAmazonJob.start();

}