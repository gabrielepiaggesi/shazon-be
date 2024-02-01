import { scrapeAmazonOffersList, scrapeAmazonProducts } from "./amazon-scraper";

export let offers = {};
export let products = {};

export function updateProducts(page, elements) {
    products[page] = elements;
}

export function updateOffers(page, elements) {
    offers[page] = elements;
}

export async function getProducts(page: number) {
    return products[page] ? products[page] : (await scrapeAmazonProducts(page));
}

export async function getOffers(page: number) {
    return offers[page] ? offers[page] : (await scrapeAmazonOffersList(page));
}