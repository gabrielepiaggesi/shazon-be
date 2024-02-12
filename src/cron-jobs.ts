import * as Cron from 'cron';
import { offersJob, productsJob } from './amazon-scraper';
const CronJob = Cron.CronJob;

export const initJobs = async (app) => {
    await productsJob();
    await offersJob();

    const startProductsJob = 
    new CronJob('*/45 * * * *', async function() {  // At 12:00 PM, only on Monday (ora server + 1)
        await productsJob();
    }, null, true, 'Europe/Rome');
    startProductsJob.start();

    const starterOffersJob = 
    new CronJob('*/10 * * * *', async function() {  // At 12:00 PM, only on Monday (ora server + 1)
        await offersJob();
    }, null, true, 'Europe/Rome');
    starterOffersJob.start();
}