import { Item } from "../types";


const testItem1: Item = {
    id: 2,
    name: 'Sauce Labs Onesie',
    description: 'Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won\'t unravel.',
    price: 7.99
}

const testItem2: Item = {
    id: 4,
    name: 'Sauce Labs Backpack',
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection',
    price: 29.99
}

const testItem3: Item = {
    id: 5,
    name: 'Sauce Labs Fleece Jacket',
    description: 'It\'s not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.',
    price: 49.99
}

export const testItems = { testItem1, testItem2, testItem3 };