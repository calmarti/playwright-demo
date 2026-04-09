import { Page, Locator, expect } from '@playwright/test';
import { Item, Order } from '../types';


export class ProductsPage {
    readonly page: Page;
    readonly productsHeadingLocator: Locator;
    readonly itemContainerLocatorList: Locator;
    //TODO: remove itemNameLocatorList and use itemContainerList (if possible) 
    readonly itemNameLocatorList: Locator;
    readonly sortItemsLocator: Locator;
    //readonly addItemToCartLocator: Locator;
    //readonly removeItemFromCartLocator: Locator;
    readonly shoppingCartLocator: Locator;

    constructor(page: Page){
        this.page = page;
        this.productsHeadingLocator = page.getByText('Products');
        this.itemContainerLocatorList = page.getByTestId('inventory-item');
        this.itemNameLocatorList = page.getByTestId('inventory-item-name')
        this.sortItemsLocator = page.getByTestId('product-sort-container');
        this.shoppingCartLocator = page.getByTestId('shopping-cart-link');
    }

    async navigateToProductsPage(){
        await this.page.goto('/inventory.html');
    }

    async sortItemsByName(order: Order) {
        //act: sort by name in actual page (actual array) by given order
        const orderValue = (order === 'desc') ? 'za' : 'az';  
        await this.sortItemsLocator.selectOption({ value: orderValue });
        const sortedItemNamesList: string[] = await this.itemNameLocatorList.allTextContents();
        return sortedItemNamesList;
    }

    async sortItemsByPrice(){

    }

    async showItemDetailsView(item: Item){
        await this.itemNameLocatorList
                .filter({ hasText: item.name, visible: true})
                .click();
        await this.page.waitForURL(`**/inventory-item.html?id=${item.id}`);         
    }

    async addItemToCart(item: Item){
        const addButton = this.itemContainerLocatorList
        .filter({ hasText: item.name, visible: true })
        .getByRole('button', { name: /Add to cart/ })
        await addButton.click();        
    }
    
    async removeFromCart(item: Item){
        const removeButton = this.itemContainerLocatorList
        .filter({ hasText: item.name, visible: true })
        .getByRole('button', { name: /Remove/ })
        await removeButton.click();  
    }
}; 

