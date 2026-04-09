import { test, expect } from '@playwright/test';
import path from 'node:path';
import { ProductsPage } from '../page-objects/products-page';
import { testItem } from '../test-data/products';
import { privateDecrypt } from 'node:crypto';
const authJson = path.join(__dirname, '../setup/auth.json'); 

//for each test: create a new browser context with a new storage state
//test.use({ storageState: authJson })

test.describe('Products page tests cases', () => {
    let productsPage: ProductsPage;
    
    test.beforeEach(async ({ page }) => {
        productsPage = new ProductsPage(page);
        await productsPage.navigateToProductsPage();
        await expect(productsPage.productsHeadingLocator).toBeVisible();
    });
    

    test.skip('Count all items in Products page', async ({ page }) => {

    });

    test('Sort items  by name in descending order', async ({ page }) => {
        //arrange: programatically sort (DESC) item names before UI sort (expected array)
        let expectedSortedItemNamesList: string[] = 
        await productsPage.itemNameLocatorList.allTextContents()
        expectedSortedItemNamesList = expectedSortedItemNamesList.sort((a,b) => b.localeCompare(a, 'en'));
        //act: sort (DESC) item names in UI 
        const sortedItemNamesList = await productsPage.sortItemsByName('desc');
        //assert: compare JS-sorted array (expected) vs. actual UI-sorted array
        expect(sortedItemNamesList).toEqual(expectedSortedItemNamesList);
    });

    test('Sort items by name in ascending order', async ({ page }) => {
         //arrange: programatically sort (ASC) item names before UI sort (expected array)
        let expectedSortedItemNamesList: string[] = 
        await productsPage.itemNameLocatorList.allTextContents()
        expectedSortedItemNamesList = expectedSortedItemNamesList.sort((a,b) => a.localeCompare(b, 'en'));
        //act: sort (ASC) item names in UI 
        const sortedItemNamesList = await productsPage.sortItemsByName('asc');
        //assert: compare JS-sorted array (expected) vs. actual UI-sorted array
        expect(sortedItemNamesList).toEqual(expectedSortedItemNamesList);
    });

    test('Sort items by price in ascending order', async ({ page }) => {
        
    })
    

    test('Show an item details view', async ({ page }) => {
       await productsPage.showItemDetailsView(testItem);        
       await expect(page)
       .toHaveURL(new RegExp(`inventory-item\\.html\\?id=${testItem.id}`));    
    })
    

    test.only('Add one item to cart and then remove it', async ({ page }) => {

        //act: add item to cart
        await productsPage.addItemToCart(testItem);
        //act: get button locator
        //TODO: refactor button locating logic to POM
        const button = productsPage.itemContainerLocatorList
            .filter({ hasText: testItem.name })
            .getByRole('button');     
        //assert: button text changes to 'Remove'
        await expect(button).toHaveText(/Remove/);
        //assert: shopping cart has 1 item
        await expect(productsPage.shoppingCartLocator).toHaveText('1');

        //act: remove that same item from cart
        await productsPage.removeFromCart(testItem);
        //assert: button text changes back to 'Add to Cart'
        await expect(button).toHaveText(/Add to cart/);
        //assert: shopping cart has 0 items
        await expect(productsPage.shoppingCartLocator).toHaveText('');
    });

    test.skip('Add several items to cart, go to cart and proceed to checkout', async ({ page }) => {
        
    })
    
    
    
    
});



