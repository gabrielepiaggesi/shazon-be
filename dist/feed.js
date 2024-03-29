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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOffers = exports.getProducts = exports.updateOffers = exports.updateProducts = exports.products = exports.offers = void 0;
exports.offers = {};
exports.products = {};
function updateProducts(elements) {
    const pages = Object.keys(exports.products);
    const lastPage = pages.length ? +pages[pages.length - 1] : -1;
    if (elements.length)
        exports.products[(lastPage + 1)] = elements;
}
exports.updateProducts = updateProducts;
function updateOffers(elements) {
    const pages = Object.keys(exports.offers);
    const lastPage = pages.length ? +pages[pages.length - 1] : -1;
    if (elements.length)
        exports.offers[(lastPage + 1)] = elements;
}
exports.updateOffers = updateOffers;
function getProducts(page) {
    return __awaiter(this, void 0, void 0, function* () {
        !exports.products[page] && console.log('getProducts from scraper', page);
        const res = exports.products[page] ? exports.products[page] : [];
        return res;
    });
}
exports.getProducts = getProducts;
function getOffers(page) {
    return __awaiter(this, void 0, void 0, function* () {
        !exports.offers[page] && console.log('getOffers from scraper', page);
        const res = exports.offers[page] ? exports.offers[page] : [];
        return res;
    });
}
exports.getOffers = getOffers;
//# sourceMappingURL=feed.js.map