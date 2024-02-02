import { scrapeAmazonOffersList, scrapeAmazonProducts } from "./amazon-scraper";
import { closeBrowser } from "./cron-jobs";

export let offers = {};
export let products = {};

export function updateProducts(page, elements) {
    products[page] = elements;
}

export function updateOffers(page, elements) {
    offers[page] = elements;
}

export async function getProducts(page: number) {
    const res = products[page] ? products[page] : (await scrapeAmazonProducts(page));
    page >= 29 && await closeBrowser();
    return res;
}

export async function getOffers(page: number) {
    const res = offers[page] ? offers[page] : (await scrapeAmazonOffersList(page));
    page >= 29 && await closeBrowser();
    return res;
}