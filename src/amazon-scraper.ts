import puppeteer, { ElementHandle } from 'puppeteer';

export async function scrapeAmazonOffersList(viewIndex: number) {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ 
        headless: true, 
        args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ]});
    const page = await browser.newPage();

    await page.setViewport({width: 1512, height: 949});
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');

    const params = JSON.stringify({"version":1,"viewIndex":180,"presetId":"deals-collection-all-deals","sorting":"FEATURED","priceRange":{"from":20,"to":50},"dealState":"AVAILABLE"});
    const amazonOffersPage = await page.goto('https://www.amazon.it/deals?deals-widget='+encodeURIComponent(params), { waitUntil: "domcontentloaded" }); 
    await page.waitForSelector('div[data-testid="grid-deals-container"]');

    await autoScroll(page);

    const arr = await page.evaluate(() => {
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
            !url.includes('deal/') && result.push(product);
        }
        return result;
    });

    console.log(arr);
    console.log(arr.length);
    return arr;
}

async function getProductData(productElement: any) {
    console.log(productElement);
    
    const offer = productElement.querySelector('span > div > div')?.textContent;
    const img = productElement.querySelector('img')?.getAttribute('data-a-hires');
    const link = productElement.querySelector('a-color-base');
    const url = link?.getAttribute('href');
    const name = link.querySelector('div')?.textContent;

    const product = { img, url, name, offer };
    console.log(product);
    return product;
}

async function autoScroll(page){
    await page.evaluate(async () => {

        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 500;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve(true);
                }
            }, 100);
        });
    });
}