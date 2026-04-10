import { Page, Locator } from '@playwright/test';
import { By,  Item, Order } from '../types';

export class ProductsPage {
    readonly page: Page;
    readonly productsHeadingLocator: Locator;
    readonly itemContainerLocatorList: Locator;
    readonly itemNameLocatorList: Locator;
    readonly itemPriceLocatorList: Locator;
    readonly sortItemsLocator: Locator; 
    readonly shoppingCartLocator: Locator;

    constructor(page: Page){
        this.page = page;
        this.productsHeadingLocator = page.getByText('Products');
        this.itemContainerLocatorList = page.getByTestId('inventory-item');
        this.itemNameLocatorList = page.getByTestId('inventory-item-name')
        this.itemPriceLocatorList = page.getByTestId('inventory-item-price');
        this.sortItemsLocator = page.getByTestId('product-sort-container');
        this.shoppingCartLocator = page.getByTestId('shopping-cart-link');
    }

    async navigateToProductsPage(){
        await this.page.goto('/inventory.html');
    }

    async sortItemsBy(by: By, order: Order) {
        if (by === 'name'){
        //act: sort by name in UI (actual array) by given order
        const orderValue = (order === 'desc') ? 'za' : 'az';  
        await this.sortItemsLocator.selectOption({ value: orderValue });
        const sortedItemNamesList: string[] = await this.itemNameLocatorList.allTextContents();
        return sortedItemNamesList;
        }
        else {
        //act: sort by price in UI (actual array) by given order
        const orderValue = (order === 'desc') ? 'hilo' : 'lohi'; 
        await this.sortItemsLocator.selectOption({ value: orderValue });
        const sortedItemPricesList: string[] = await this.itemPriceLocatorList.allTextContents();
        return sortedItemPricesList;
        }
    }

     async goToItemDetailsView(item: Item){
        await this.itemNameLocatorList
                .filter({ hasText: item.name, visible: true})
                .click();
        await this.page.waitForURL(`**/inventory-item.html?id=${item.id}`);         
    }
    

    async addItemToCart(item: Item){
        const addButton = this.getItemButton(item, 'Add to cart');
        await addButton.click();           
    }
    
    async removeFromCart(item: Item){
        const removeButton = this.getItemButton(item, 'Remove'); 
        await removeButton.click();  
    }
    
    getItemButton(item: Item, buttonName?: string): Locator {
        return this.itemContainerLocatorList
            .filter({ hasText: item.name, visible: true })
            .getByRole('button', { name: buttonName }); 
    } 

    async navigateToCartPage(){ 
        await this.shoppingCartLocator.click();
        await this.page.waitForURL(/cart\.html/); 
    }
}; 

