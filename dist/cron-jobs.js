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
exports.initJobs = void 0;
const Cron = __importStar(require("cron"));
const amazon_scraper_1 = require("./amazon-scraper");
const feed_1 = require("./feed");
const CronJob = Cron.CronJob;
const initJobs = (app) => {
    const productsJob = new CronJob('*/10 * * * *', function () {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i <= 30; i++) {
                yield setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    const page = i;
                    try {
                        const newProducts = yield (0, amazon_scraper_1.scrapeAmazonProducts)(page);
                        (0, feed_1.updateProducts)(page, newProducts);
                        console.log('Success scraping products', page);
                    }
                    catch (e) {
                        console.log(e);
                        console.log('Impossibile scraping products', page);
                        i--;
                    }
                }), 5000);
            }
        });
    }, null, true, 'Europe/Rome');
    productsJob.start();
    const offersJob = new CronJob('*/10 * * * *', function () {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i <= 30; i++) {
                yield setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    const page = i;
                    try {
                        const newOffers = yield (0, amazon_scraper_1.scrapeAmazonOffersList)(page);
                        (0, feed_1.updateOffers)(page, newOffers);
                        console.log('Success scraping offers', page);
                    }
                    catch (e) {
                        console.log(e);
                        console.log('Impossibile scraping offers', page);
                        i--;
                    }
                }), 5000);
            }
        });
    }, null, true, 'Europe/Rome');
    offersJob.start();
};
exports.initJobs = initJobs;
//# sourceMappingURL=cron-jobs.js.map