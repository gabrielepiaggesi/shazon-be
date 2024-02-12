import puppeteer, { Browser as PuppeteerBrowser } from 'puppeteer';
import { openBrowser } from './cron-jobs';

export let Browser!: PuppeteerBrowser;
const port = process.env.PORT || 8000;

export async function scrapeAmazonOffersList(viewIndex: number, Browser: PuppeteerBrowser) {
    const page = await Browser.newPage();
    let arr = [];

    try {
        // await page.setViewport({width: 1512, height: 949});
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');

        const params = JSON.stringify({ "version": 1, "viewIndex": (viewIndex * 60), "presetId": "deals-collection-all-deals", "sorting": "FEATURED", "dealState": "AVAILABLE" }); //"priceRange":{"from":20,"to":50}
        await page.goto('https://www.amazon.it/deals?deals-widget=' + encodeURIComponent(params), { waitUntil: "domcontentloaded" });
        console.log(page.url());
        await page.waitForSelector('div[data-testid="grid-deals-container"]');

        await autoScroll(page);
        arr = await page.evaluate(() => {
            let result = [];
            const divs = Array.from(document.querySelector('div[data-testid="grid-deals-container"]').children);

            for (let i = 0; i < divs.length; i++) {
                const productElement = divs[i];

                const offerElem = productElement.querySelector('div > div > div > span > div > div');
                const offer = offerElem?.textContent;

                const imgElem = productElement.querySelector('img');
                const img = imgElem?.getAttribute('data-a-hires').replace(/AC_UF[1-9]{3,},[1-9]{3,}_/gm, `AC_UF900,900_`);

                const linkElem = productElement.getElementsByClassName('a-color-base')[1];
                const url = linkElem?.getAttribute('href');
                const name = linkElem?.querySelector('div')?.textContent;

                const product = { idx: i, img: img, url: url, name, offer };
                // !url.includes('deal/') && result.push(product);
                result.push(product);
            }
            return result;
        });
        console.log('Success scraping offers', viewIndex);
    } catch (e) {
        console.log(e);
        console.log('Impossibile scraping offers', viewIndex);
        // throw new Error('Impossibile scraping offers ' + viewIndex);
    } finally {
        await page.close();
    }

    return arr;
}


export async function scrapeAmazonProducts(viewIndex: number, Browser: PuppeteerBrowser) {
    const page = await Browser.newPage();
    let arr = [];

    try {
        await page.setViewport({ width: 1512, height: 949 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    
        await page.goto(`https://www.amazon.it/s?i=kitchen&rh=n%3A524015031&dc&fs=true${viewIndex ? '&page=' + viewIndex : ''}&qid=1706730373&ref=sr_pg_1`, { waitUntil: "load" });
        console.log(page.url());
        // https://www.amazon.it/s?i=kitchen&rh=n%3A524015031&dc&fs=true&page=2&qid=1706730373&ref=sr_pg_1 < -------- PAGINATION!
        await page.waitForSelector('#nav-subnav');
        await page.waitForSelector('#search');
        await page.waitForSelector('div[data-asin]:not([data-asin=""])');
    
        await autoScroll(page);
        arr = await page.evaluate(() => {
            let result = [];
            const divs = Array.from(document.querySelectorAll('div[data-asin]:not([data-asin=""])'));
    
            for (let i = 0; i < divs.length; i++) {
                const productElement = divs[i];
    
                const titleDiv = productElement.querySelector('div[data-cy="title-recipe"]');
                const titleSpan = titleDiv.querySelector('h2 > a > span');
                const name = titleSpan?.textContent;
    
                const asin = productElement.getAttribute('data-asin');
                const url = 'https://amazon.it/dp/' + asin;
                const stars = productElement.getElementsByClassName('a-icon-alt')[0]?.textContent;
    
                const priceDiv = productElement.querySelector('div[data-cy="price-recipe"] > div > div > a > span');
                const priceWhole = priceDiv?.getElementsByClassName('a-price-whole')[0]?.textContent;
                const priceFraction = priceDiv?.getElementsByClassName('a-price-fraction')[0]?.textContent;
                const price = priceWhole ? `${priceWhole}${priceFraction} €` : null;
    
                const imgElem = productElement.querySelector('img');
                const img = imgElem?.getAttribute('src').replace(/AC_UL[1-9]/gm, `AC_UL960_FMwebp_QL65`);
    
                const product = { idx: i, img, url, name, stars, price, asin };
                // !url.includes('deal/') && result.push(product);
                result.push(product);
            }
            return result;
        });
        console.log('Success scraping products', viewIndex);
    } catch(e) {
        console.log(e);
        console.log('Impossibile scraping products', viewIndex);
        // throw new Error('Impossibile scraping products ' + viewIndex);
    } finally {
        await page.close();
    }

    return arr;
}



async function autoScroll(page) {
    await page.evaluate(async () => {

        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 500;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve(true);
                }
            }, 100);
        });
    });
}