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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initJobs = exports.closeBrowser = void 0;
const Cron = __importStar(require("cron"));
const amazon_scraper_1 = require("./amazon-scraper");
const feed_1 = require("./feed");
const CronJob = Cron.CronJob;
function closeBrowser() {
    return __awaiter(this, void 0, void 0, function* () {
        yield amazon_scraper_1.Browser.close();
    });
}
exports.closeBrowser = closeBrowser;
const initJobs = (app) => {
    const MAX_PAGE = 30;
    const SECONDS_WAIT_FOR_NEXT_PAGE = 30;
    const productsJob = new CronJob('*/30 * * * *', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let page = 0;
            let productIntervalId = setInterval(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if (page >= MAX_PAGE) {
                        yield closeBrowser();
                        clearInterval(productIntervalId);
                        return;
                    }
                    try {
                        const newProducts = yield (0, amazon_scraper_1.scrapeAmazonProducts)(page);
                        (0, feed_1.updateProducts)(page, newProducts);
                        console.log('Success scraping products', page);
                        page++;
                        if (page >= MAX_PAGE) {
                            console.log('CLOSING BROWSER');
                            yield closeBrowser();
                            clearInterval(productIntervalId);
                            return;
                        }
                    }
                    catch (e) {
                        console.log(e);
                        console.log('Impossibile scraping products', page);
                    }
                });
            }, (SECONDS_WAIT_FOR_NEXT_PAGE * 1000));
            if (page >= MAX_PAGE) {
                yield closeBrowser();
                clearInterval(productIntervalId);
                return;
            }
        });
    }, null, true, 'Europe/Rome');
    productsJob.start();
    const offersJob = new CronJob('*/30 * * * *', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let page = 0;
            let offersIntervalId = setInterval(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if (page >= MAX_PAGE) {
                        yield closeBrowser();
                        clearInterval(offersIntervalId);
                        return;
                    }
                    try {
                        const newOffers = yield (0, amazon_scraper_1.scrapeAmazonOffersList)(page);
                        (0, feed_1.updateOffers)(page, newOffers);
                        console.log('Success scraping offers', page);
                        page++;
                        if (page >= MAX_PAGE) {
                            yield closeBrowser();
                            clearInterval(offersIntervalId);
                            return;
                        }
                    }
                    catch (e) {
                        console.log(e);
                        console.log('Impossibile scraping offers', page);
                    }
                });
            }, (SECONDS_WAIT_FOR_NEXT_PAGE * 1000));
            if (page >= MAX_PAGE) {
                yield closeBrowser();
                clearInterval(offersIntervalId);
                return;
            }
        });
    }, null, true, 'Europe/Rome');
    offersJob.start();
};
exports.initJobs = initJobs;
//# sourceMappingURL=cron-jobs.js.map