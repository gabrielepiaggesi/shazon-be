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
exports.Browser = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const amazon_scraper_1 = require("./amazon-scraper");
process.env.TZ = 'Europe/Rome';
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
});
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({ limit: 52428800 }));
app.use(body_parser_1.default.urlencoded({ limit: 52428800, extended: true, parameterLimit: 50000 }));
exports.Browser = null;
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        exports.Browser = yield puppeteer_1.default.launch({
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
    });
}
start();
port === 8000 && setTimeout(() => {
    (0, amazon_scraper_1.scrapeAmazonProducts)(0);
}, 2000);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/offers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, amazon_scraper_1.scrapeAmazonOffersList)(0)).json();
}));
app.get('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, amazon_scraper_1.scrapeAmazonProducts)(0)).json();
}));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map