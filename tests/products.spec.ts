import { test, expect } from '@playwright/test';
import path from 'node:path';
import { ProductsPage } from '../page-objects/products-page';
import { testItems } from '../test-data/items';

const { testItem1, testItem2, testItem3 } = testItems

const authJson = path.join(__dirname, '../setup/auth.json'); 

test.describe('Products page tests cases', () => {

    let productsPage: ProductsPage;
    
    test.beforeEach(async ({ page }) => {
        productsPage = new ProductsPage(page);
        await productsPage.navigateToProductsPage();
        await expect(productsPage.productsHeadingLocator).toBeVisible();
    });
    

    test('Sort items  by name in descending order', async () => {
        //arrange: programatically sort (DESC) by name before UI sort (expected array)
        let expectedSortedItemNamesList: string[] = 
        await productsPage.itemNameLocatorList.allTextContents() 
        expectedSortedItemNamesList = expectedSortedItemNamesList.sort((a,b) => b.localeCompare(a, 'en'));
        //act: sort (DESC) by item names in UI 
        const sortedItemNamesList = await productsPage.sortItemsBy('name','desc');
        //assert: compare JS-sorted array (expected) vs. actual UI-sorted array
        expect(sortedItemNamesList).toEqual(expectedSortedItemNamesList);
    });


    test('Sort items by price in ascending order', async () => {
        //arrange: programatically sort (ASC) item names before UI sort (expected array) 
        let expectedSortedItemPricesList: string[] = 
        await productsPage.itemPriceLocatorList.allTextContents();
        expectedSortedItemPricesList
        .sort((a,b)=> {
            const numA = parseFloat(a.slice(1)); 
            const numB = parseFloat(b.slice(1));
            return numA - numB;  
        });                  
        //act: sort (ASC) by item prices in UI 
        const sortedItemPricesList = await productsPage.sortItemsBy('price','asc');
        expect(expectedSortedItemPricesList).toEqual(sortedItemPricesList);    
    });
    

    test('Go to an item details view', async ({ page }) => { 
       //act: go to item details view 
       await productsPage.goToItemDetailsView(testItem1);      
       //assert: item details page has expected url   
       await expect(page)
       .toHaveURL(new RegExp(`inventory-item\\.html\\?id=${testItem1.id}`));    
    })
    

    test('Add one item to cart and then remove it', async () => {

        //act: add item to cart
        await productsPage.addItemToCart(testItem1);
        //act: get button locator
        const button = productsPage.getItemButton(testItem1); 
        //assert: button text changes to 'Remove'
        await expect(button).toHaveText(/Remove/i);
        //assert: shopping cart has 1 item
        await expect(productsPage.shoppingCartLocator).toHaveText('1');

        //act: remove that same item from cart  
        await productsPage.removeFromCart(testItem1);
        //assert: button text changes back to 'Add to Cart'
        await expect(button).toHaveText(/Add to cart/i);
        //assert: shopping cart has 0 items
        await expect(productsPage.shoppingCartLocator).toHaveText('');
    });

    test('Add several items and go to cart page', async ({ page }) => {
        //act: add items
        await productsPage.addItemToCart(testItem1);
        await productsPage.addItemToCart(testItem2);
        await productsPage.addItemToCart(testItem3);
        //assert: Expected number of items in cart icon: 3 
        expect(productsPage.shoppingCartLocator).toHaveText('3');
        //act: click on cart icon to go to cart page
        await productsPage.navigateToCartPage();
        //assert: cart page has expected url
        expect(page).toHaveURL((/cart\.html/)); 
    });       
    
});



