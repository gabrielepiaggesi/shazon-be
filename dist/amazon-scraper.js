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
exports.scrapeAmazonOffersList = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
let browser;
function scrapeAmazonOffersList(viewIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        // Launch the browser and open a new blank page
        if (!browser) {
            browser = yield puppeteer_1.default.launch({
                args: [
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
        const page = yield browser.newPage();
        // await page.setViewport({width: 1512, height: 949});
        yield page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
        const params = JSON.stringify({ "version": 1, "viewIndex": 180, "presetId": "deals-collection-all-deals", "sorting": "FEATURED", "priceRange": { "from": 20, "to": 50 }, "dealState": "AVAILABLE" });
        const amazonOffersPage = yield page.goto('https://www.amazon.it/deals?deals-widget=' + encodeURIComponent(params), { waitUntil: "domcontentloaded" });
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
        // await browser.close();
        // await browser.disconnect();
        return arr;
    });
}
exports.scrapeAmazonOffersList = scrapeAmazonOffersList;
function getProductData(productElement) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        console.log(productElement);
        const offer = (_a = productElement.querySelector('span > div > div')) === null || _a === void 0 ? void 0 : _a.textContent;
        const img = (_b = productElement.querySelector('img')) === null || _b === void 0 ? void 0 : _b.getAttribute('data-a-hires');
        const link = productElement.querySelector('a-color-base');
        const url = link === null || link === void 0 ? void 0 : link.getAttribute('href');
        const name = (_c = link.querySelector('div')) === null || _c === void 0 ? void 0 : _c.textContent;
        const product = { img, url, name, offer };
        console.log(product);
        return product;
    });
}
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