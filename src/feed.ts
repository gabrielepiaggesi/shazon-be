export let offers = {};
export let products = {};

export function updateProducts(page, elements) {
    products[page] = elements;
}

export function updateOffers(page, elements) {
    offers[page] = elements;
}

export async function getProducts(page: number) {
    !products[page] && console.log('getProducts from scraper', page);
    const res = products[page] ? products[page] : [];
    return res;
}

export async function getOffers(page: number) {
    !offers[page] && console.log('getOffers from scraper', page);
    const res = offers[page] ? offers[page] : [];
    return res;
}