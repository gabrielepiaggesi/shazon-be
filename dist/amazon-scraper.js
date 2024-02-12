"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeAmazonProducts = exports.scrapeAmazonOffersList = exports.offersJob = exports.productsJob = exports.openBrowser = exports.closeBrowser = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const utils_1 = require("./utils");
const feed_1 = require("./feed");
const port = process.env.PORT || 8000;
const MAX_PAGE = 30;
const SECONDS_WAIT_FOR_NEXT_PAGE = 30;
function closeBrowser(Browser) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('CLOSE BROWSER');
        yield Browser.close().then(() => console.log('browser closed')).catch((e) => console.error('browser closing error', e));
        return Browser;
    });
}
exports.closeBrowser = closeBrowser;
function openBrowser() {
    return __awaiter(this, void 0, void 0, function* () {
        const headless = !(port === 8000);
        console.log('OPEN NEW BROWSER', headless);
        const Browser = yield puppeteer_1.default.launch({
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
    });
}
exports.openBrowser = openBrowser;
// https://www.amazon.it/s?i=beauty&rh=n%3A6198082031&dc&fs=true&ds=v1%3A1beD71AYUA6N1dmmmVi%2FuoInBnET13ywZtuY7Pms%2FBw&qid=1707750899&ref=sr_ex_n_1
function productsJob() {
    return __awaiter(this, void 0, void 0, function* () {
        let Browser = yield openBrowser();
        let page = 0;
        let retry = 0;
        while (page < MAX_PAGE) {
            yield (0, utils_1.delay)(SECONDS_WAIT_FOR_NEXT_PAGE * 1000);
            try {
                const newProducts = yield scrapeAmazonProducts(page, Browser);
                (0, feed_1.updateProducts)(newProducts);
                console.log('----------- success products', page, newProducts.length);
                page++;
                retry = 0;
            }
            catch (e) {
                console.log('----------- error products', page);
                if (retry < 3) {
                    retry++;
                    console.log('----------- retry products', page);
                }
                else {
                    console.log('----------- stop retrying products', page);
                    retry = 0;
                    page++;
                }
            }
        }
        Browser = yield closeBrowser(Browser);
    });
}
exports.productsJob = productsJob;
function offersJob() {
    return __awaiter(this, void 0, void 0, function* () {
        let Browser = yield openBrowser();
        let page = 0;
        let retry = 0;
        while (page < MAX_PAGE) {
            yield (0, utils_1.delay)(SECONDS_WAIT_FOR_NEXT_PAGE * 1000);
            try {
                const newOffers = yield scrapeAmazonOffersList(page, Browser);
                (0, feed_1.updateOffers)(newOffers);
                console.log('----------- success offers', page, newOffers.length);
                page++;
                retry = 0;
            }
            catch (e) {
                console.log('----------- error offers', page);
                if (retry < 3) {
                    retry++;
                    console.log('----------- retry offers', page);
                }
                else {
                    console.log('----------- stop retrying offers', page);
                    retry = 0;
                    page++;
                }
            }
        }
        Browser = yield closeBrowser(Browser);
    });
}
exports.offersJob = offersJob;
function scrapeAmazonOffersList(viewIndex, Browser) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield Browser.newPage();
        let arr = [];
        try {
            // await page.setViewport({width: 1512, height: 949});
            yield page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
            const params = JSON.stringify({ "version": 1, "viewIndex": (viewIndex * 60), "presetId": "deals-collection-all-deals", "sorting": "FEATURED", "dealState": "AVAILABLE" }); //"priceRange":{"from":20,"to":50}
            yield page.goto('https://www.amazon.it/deals?deals-widget=' + encodeURIComponent(params), { waitUntil: "domcontentloaded" });
            console.log(page.url());
            yield page.waitForSelector('div[data-testid="grid-deals-container"]');
            yield autoScroll(page);
            arr = yield page.evaluate(() => {
                var _a;
                let result = [];
                const divs = Array.from(document.querySelector('div[data-testid="grid-deals-container"]').children);
                for (let i = 0; i < divs.length; i++) {
                    const productElement = divs[i];
                    const offerElem = productElement.querySelector('div > div > div > span > div > div');
                    const offer = offerElem === null || offerElem === void 0 ? void 0 : offerElem.textContent;
                    const imgElem = productElement.querySelector('img');
                    const img = imgElem === null || imgElem === void 0 ? void 0 : imgElem.getAttribute('data-a-hires').replace(/AC_UF[1-9]{3,},[1-9]{3,}_/gm, `AC_UF900,900_`);
                    const linkElem = productElement.getElementsByClassName('a-color-base')[1];
                    const url = linkElem === null || linkElem === void 0 ? void 0 : linkElem.getAttribute('href');
                    const name = (_a = linkElem === null || linkElem === void 0 ? void 0 : linkElem.querySelector('div')) === null || _a === void 0 ? void 0 : _a.textContent;
                    const product = { idx: i, img: img, url: url, name, offer };
                    // !url.includes('deal/') && result.push(product);
                    result.push(product);
                }
                return result;
            });
            console.log('Success scraping offers', viewIndex);
        }
        catch (e) {
            console.log(e);
            console.log('Impossibile scraping offers', viewIndex);
            yield page.close().then(() => console.log('page closed')).catch((e) => console.error('page closing error', e));
            throw new Error('Impossibile scraping offers ' + viewIndex);
        }
        finally {
            yield page.close().then(() => console.log('page closed')).catch((e) => console.error('page closing error', e));
        }
        return arr;
    });
}
exports.scrapeAmazonOffersList = scrapeAmazonOffersList;
function scrapeAmazonProducts(viewIndex, Browser) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield Browser.newPage();
        let arr = [];
        try {
            yield page.setViewport({ width: 1512, height: 949 });
            yield page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
            viewIndex > 0 && (yield page.goto(`https://www.amazon.it/s?i=kitchen&rh=n%3A524015031&dc&fs=true${viewIndex ? '&page=' + viewIndex : ''}&qid=1706730373&ref=sr_pg_1`, { waitUntil: "domcontentloaded" }));
            viewIndex == 0 && (yield page.goto(`https://www.amazon.it/s?i=kitchen&rh=n%3A524015031&dc&fs=true&qid=1706730373&ref=sr_pg_1`, { waitUntil: "domcontentloaded" }));
            console.log(page.url());
            // https://www.amazon.it/s?i=kitchen&rh=n%3A524015031&dc&fs=true&page=2&qid=1706730373&ref=sr_pg_1 < -------- PAGINATION!
            yield page.waitForSelector('#nav-subnav');
            yield page.waitForSelector('#search');
            yield page.waitForSelector('div[data-asin]:not([data-asin=""])');
            yield autoScroll(page);
            arr = yield page.evaluate(() => {
                var _a, _b, _c;
                let result = [];
                const divs = Array.from(document.querySelectorAll('div[data-asin]:not([data-asin=""])'));
                for (let i = 0; i < divs.length; i++) {
                    const productElement = divs[i];
                    const titleDiv = productElement.querySelector('div[data-cy="title-recipe"]');
                    const titleSpan = titleDiv.querySelector('h2 > a > span');
                    const name = titleSpan === null || titleSpan === void 0 ? void 0 : titleSpan.textContent;
                    const asin = productElement.getAttribute('data-asin');
                    const url = 'https://amazon.it/dp/' + asin;
                    const stars = (_a = productElement.getElementsByClassName('a-icon-alt')[0]) === null || _a === void 0 ? void 0 : _a.textContent;
                    const priceDiv = productElement.querySelector('div[data-cy="price-recipe"] > div > div > a > span');
                    const priceWhole = (_b = priceDiv === null || priceDiv === void 0 ? void 0 : priceDiv.getElementsByClassName('a-price-whole')[0]) === null || _b === void 0 ? void 0 : _b.textContent;
                    const priceFraction = (_c = priceDiv === null || priceDiv === void 0 ? void 0 : priceDiv.getElementsByClassName('a-price-fraction')[0]) === null || _c === void 0 ? void 0 : _c.textContent;
                    const price = priceWhole ? `${priceWhole}${priceFraction} €` : null;
                    const imgElem = productElement.querySelector('img');
                    const img = imgElem === null || imgElem === void 0 ? void 0 : imgElem.getAttribute('src').replace(/AC_UL[1-9]/gm, `AC_UL960_FMwebp_QL65`);
                    const product = { idx: i, img, url, name, stars, price, asin };
                    // !url.includes('deal/') && result.push(product);
                    result.push(product);
                }
                return result;
            });
            console.log('Success scraping products', viewIndex);
            yield page.close().then(() => console.log('page closed')).catch((e) => console.error('page closing error', e));
        }
        catch (e) {
            console.log(e);
            console.log('Impossibile scraping products', viewIndex);
            yield page.close().then(() => console.log('page closed')).catch((e) => console.error('page closing error', e));
            throw new Error('Impossibile scraping products ' + viewIndex);
        }
        return arr;
    });
}
exports.scrapeAmazonProducts = scrapeAmazonProducts;
function autoScroll(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.evaluate(() => __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve) => {
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
        }));
    });
}
//# sourceMappingURL=amazon-scraper.js.map