import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
    readonly page: Page;
    readonly productsHeadingLocator: Locator;
    readonly itemLocator: Locator;
    readonly sortProductsLocator: Locator;
    readonly addToCartLocator: Locator;
    readonly removeFromCartLocator: Locator;
    readonly shoppingCartLocator: Locator;

    constructor(page: Page){
        this.page = page;
        this.productsHeadingLocator = page.getByText('Products');
        this.itemLocator = page.getByTestId('inventory-item-name');
        this.sortProductsLocator = page.getByTestId('product-sort-container');
        this.addToCartLocator = page.getByRole('button', { name: 'Add to Cart'});
        this.removeFromCartLocator = page.getByRole('button', { name: 'Remove'});
        this.shoppingCartLocator = page.getByTestId('shopping-cart-link');
    };

    async navigateToProductsPage(){
        await this.page.goto('/inventory.html');
    };

    async sortProductsByNameAsc() {
        //arrange: sort item names in JS before actual sort (expected array)
        let expectedSortedItemNamesList: string[] = await this.itemLocator.allTextContents();
        expectedSortedItemNamesList = expectedSortedItemNamesList
        .sort((a,b) => a.localeCompare(b, 'en'));
        //act: sort by name (asc) in actual page (actual array)
        await this.sortProductsLocator.selectOption({ value: 'az'});     
        const sortedItemNamesList: string[] = await this.itemLocator.allTextContents(); 
        return [expectedSortedItemNamesList, sortedItemNamesList];
    };
};

