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
exports.scrapeAmazonProducts = exports.scrapeAmazonOffersList = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
let Browser;
const port = process.env.PORT || 8000;
function scrapeAmazonOffersList(viewIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Browser) {
            Browser = yield puppeteer_1.default.launch({
                headless: !(port === 8000),
                args: port === 8000 ? [] : [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    `--window-size=1512,949`
                ],
                defaultViewport: {
                    width: 1512,
                    height: 949
                }
            });
        }
        const page = yield Browser.newPage();
        // await page.setViewport({width: 1512, height: 949});
        yield page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
        const params = JSON.stringify({ "version": 1, "viewIndex": 180, "presetId": "deals-collection-all-deals", "sorting": "FEATURED", "priceRange": { "from": 20, "to": 50 }, "dealState": "AVAILABLE" });
        yield page.goto('https://www.amazon.it/deals?deals-widget=' + encodeURIComponent(params), { waitUntil: "domcontentloaded" });
        yield page.waitForSelector('div[data-testid="grid-deals-container"]');
        yield autoScroll(page);
        const arr = yield page.evaluate(() => {
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
                !url.includes('deal/') && result.push(product);
            }
            return result;
        });
        page.close();
        return arr;
    });
}
exports.scrapeAmazonOffersList = scrapeAmazonOffersList;
function scrapeAmazonProducts(viewIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Browser) {
            Browser = yield puppeteer_1.default.launch({
                headless: !(port === 8000),
                args: port === 8000 ? [] : [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    `--window-size=1512,949`
                ],
                defaultViewport: {
                    width: 1512,
                    height: 949
                }
            });
        }
        console.log('Browser', Browser);
        const page = yield Browser.newPage();
        yield page.setViewport({ width: 1512, height: 949 });
        yield page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
        yield page.goto('https://www.amazon.it/s?i=kitchen&rh=n%3A524015031&dc&fs=true&ref=sr_ex_n_1', { waitUntil: "domcontentloaded" });
        // https://www.amazon.it/s?i=kitchen&rh=n%3A524015031&dc&fs=true&page=2&qid=1706730373&ref=sr_pg_1 < -------- PAGINATION!
        yield page.waitForSelector('div[data-asin]:not([data-asin=""])');
        yield autoScroll(page);
        const arr = yield page.evaluate(() => {
            var _a;
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
                const priceDiv = productElement.querySelector('div[data-cy="price-recipe"]');
                const priceSpan1 = priceDiv === null || priceDiv === void 0 ? void 0 : priceDiv.getElementsByClassName('a-price')[0];
                const priceSpan2 = priceSpan1 === null || priceSpan1 === void 0 ? void 0 : priceSpan1.querySelector('span');
                const price = priceSpan2 === null || priceSpan2 === void 0 ? void 0 : priceSpan2.textContent;
                const imgElem = productElement.querySelector('img');
                const img = imgElem === null || imgElem === void 0 ? void 0 : imgElem.getAttribute('src').replace(/AC_UL[1-9]/gm, `AC_UL960_FMwebp_QL65`);
                const product = { idx: i, img, url, name, stars, price, asin };
                !url.includes('deal/') && result.push(product);
            }
            return result;
        });
        page.close();
        console.log(arr.length);
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