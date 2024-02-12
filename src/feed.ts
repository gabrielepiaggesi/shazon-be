export let offers = {};
export let products = {};

export function updateProducts(elements) {
    const pages = Object.keys(products);
    const lastPage = pages.length ? +pages[pages.length - 1] : -1;
    products[(lastPage+1)] = elements;
}

export function updateOffers(elements) {
    const pages = Object.keys(offers);
    const lastPage = pages.length ? +pages[pages.length - 1] : -1;
    offers[(lastPage+1)] = elements;
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