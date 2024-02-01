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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cron_1 = require("./cron");
const feed_1 = require("./feed");
process.env.TZ = 'Europe/Rome';
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
});
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({ limit: 52428800 }));
app.use(body_parser_1.default.urlencoded({ limit: 52428800, extended: true, parameterLimit: 50000 }));
(0, cron_1.initJobs)(app);
// port === 8000 && setTimeout(() => {
//   scrapeAmazonProducts(0);
// }, 2000);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/offers/:page', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield (0, feed_1.getOffers)(+req.params.page || 0));
}));
app.get('/products/:page', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield (0, feed_1.getProducts)(+req.params.page || 0));
}));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map