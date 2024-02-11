"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.initJobs = exports.openBrowser = exports.closeBrowser = void 0;
const Cron = __importStar(require("cron"));
const amazon_scraper_1 = require("./amazon-scraper");
const feed_1 = require("./feed");
const puppeteer_1 = __importDefault(require("puppeteer"));
const utils_1 = require("./utils");
const CronJob = Cron.CronJob;
const port = process.env.PORT || 8000;
function closeBrowser(Browser) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('CLOSE BROWSER');
        yield Browser.disconnect();
        yield Browser.close();
        return Browser;
    });
}
exports.closeBrowser = closeBrowser;
function openBrowser() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('OPEN NEW BROWSER');
        const Browser = yield puppeteer_1.default.launch({
            headless: !(port === 8000),
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
const initJobs = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const MAX_PAGE = 30;
    const SECONDS_WAIT_FOR_NEXT_PAGE = 30;
    const productsJob = new CronJob('*/30 * * * *', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let Browser = yield openBrowser();
            let page = 0;
            while (page < MAX_PAGE) {
                yield (0, utils_1.delay)(SECONDS_WAIT_FOR_NEXT_PAGE * 1000);
                try {
                    const newProducts = yield (0, amazon_scraper_1.scrapeAmazonProducts)(page, Browser);
                    (0, feed_1.updateProducts)(page, newProducts);
                    console.log('----------- success products', page);
                    page++;
                }
                catch (e) {
                    console.log('----------- error products', page);
                }
            }
            Browser = yield closeBrowser(Browser);
        });
    }, null, true, 'Europe/Rome');
    productsJob.start();
    const offersJob = new CronJob('*/30 * * * *', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let Browser = yield openBrowser();
            let page = 0;
            while (page < MAX_PAGE) {
                yield (0, utils_1.delay)(SECONDS_WAIT_FOR_NEXT_PAGE * 1000);
                try {
                    const newOffers = yield (0, amazon_scraper_1.scrapeAmazonOffersList)(page, Browser);
                    (0, feed_1.updateOffers)(page, newOffers);
                    console.log('----------- success offers', page);
                    page++;
                }
                catch (e) {
                    console.log('----------- error offers', page);
                }
            }
            Browser = yield closeBrowser(Browser);
        });
    }, null, true, 'Europe/Rome');
    offersJob.start();
});
exports.initJobs = initJobs;
//# sourceMappingURL=cron-jobs.js.map