import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { BeforeAll, Before, After, AfterAll, Status, ITestCaseHookParameter } from '@cucumber/cucumber';

// Launch options.
const options = {
  headless: process.env.CI ? true : false,
  slowMo: process.env.CI ? 0 : 100
};

let browser: Browser;
let browserContext: BrowserContext;
let page: Page;

// Create a browser engine for the entire test suite
BeforeAll(async function () {
  console.log('before all ...');
  browser = await chromium.launch(options);
});

AfterAll(async function () {
  console.log('after all ...');
  await browser.close();
});

// Create a fresh browser context and page for each test
Before(async function (this: any) {
  console.log('before ...');
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

// Close the page and context after each test
After(async function (this: any) {
  console.log('after pass...');
  await this.page.close();
  await this.context.close();
});


After(async function (this: any, scenario: ITestCaseHookParameter) {
    // 1. Check if the scenario actually failed
    if (scenario.result?.status === Status.FAILED) {        
        // 2. Take a screenshot of the failure
          const image = await this.page.screenshot({ 
            path: `./reports/screenshots/${scenario.pickle.name}.png`,
            fullPage: true 
        });
        // 3. ATTACH it to the Cucumber HTML report
        // This is the step that tells the HTML formatter: "Hey, this failed!"
        await this.attach(image, 'image/png');        
        console.log(`\n ❌ Scenario Failed: ${scenario.pickle.name} - Screenshot captured.`);
    }
  }); 

