import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { BrowserContext, Page } from '@playwright/test';

export class CustomWorld extends World {
    BASE_URL: string;
    context: BrowserContext | null;
    page: Page | null;
    
    constructor(options: IWorldOptions) {
        super(options);
        const env = options.parameters.env || 'local';
        this.BASE_URL = options.parameters.BASE_URL || 'https://saucedemo.com/';
        this.context = null;
        this.page = null;
    }
}

setWorldConstructor(CustomWorld);