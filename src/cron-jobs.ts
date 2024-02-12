import * as Cron from 'cron';
import { offersJob, productsJob } from './amazon-scraper';
import { delay } from './utils';
const CronJob = Cron.CronJob;

export const initJobs = async (app) => {
    await delay(30 * 1000);
    await startScraping();

    const startAmazonJob = 
    new CronJob('*/30 * * * *', async function() {  // At 12:00 PM, only on Monday (ora server + 1)
        await startScraping();
    }, null, true, 'Europe/Rome');
    startAmazonJob.start();

}

export async function startScraping() {
    await offersJob();
    await delay(30 * 1000);
    await productsJob();
}