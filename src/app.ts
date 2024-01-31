import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import puppeteer from 'puppeteer';
import { scrapeAmazonOffersList, scrapeAmazonProducts } from './amazon-scraper';
process.env.TZ = 'Europe/Rome';

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

const app = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(bodyParser.json({limit: 52428800}));
app.use(bodyParser.urlencoded({limit: 52428800, extended: true, parameterLimit: 50000}));

export let Browser: any = null;

async function start() {
  if (!Browser) {
    Browser = await puppeteer.launch({
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
}

start();
port === 8000 && setTimeout(() => {
  scrapeAmazonProducts(0);
}, 2000);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/offers', async (req, res) => {
  res.send(await scrapeAmazonOffersList(0)).json();
});

app.get('/products', async (req, res) => {
  res.send(await scrapeAmazonProducts(0)).json();
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});