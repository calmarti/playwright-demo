import { test, expect } from '@playwright/test';
import { ProductsPage } from '../page-objects/products-page';
import path from 'node:path';

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
    
    test('Sort products by name in ascending order', async ({ page }) => {
        //arrange and act
        const [expectedSortedItemNameList, sortedItemNameList] = 
            await productsPage.sortProductsByNameAsc();
        //assert: compare sorted array in JS vs. actual sorted array
        expect(sortedItemNameList).toEqual(expectedSortedItemNameList);
    });

    test.skip('Sort products by price in ascending order', async ({ page }) => {
        
    });

    test.skip('View item details screen', async ({ page }) => {
        
    })
    

    test.skip('Add one item to cart and then remove it', async ({ page }) => {
        
    });

    test.skip('Add several items to cart, go to cart and proceed to checkout', async ({ page }) => {
        
    })
    
    
    
    
});



