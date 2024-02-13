import * as Cron from 'cron';
import { closeBrowser, offersJob, openBrowser, productsJob } from './amazon-scraper';
import { checkProcess, delay } from './utils';
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
    let browser = await openBrowser();
    const browserPID = await browser.process().pid;
    await offersJob(browser);
    await delay(5 * 1000);
    await productsJob(browser);
    browser = await closeBrowser(browser);
    await checkProcess(browserPID);
    await checkProcess(browserPID+1);
}