import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login-page';
import { users } from '../test-data/users';
import { InventoryPage } from '../page-objects/inventory-page';
//import { executeActionOnElem } from '../utils';

const { validUser, invalidPasswordUser, invalidUsernameUser, invalidCredentialsUser } = users;

//this overrides storageState set in global.setup.ts
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login page test suite', () => {

  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigateToLoginPage();
    await expect(page).toHaveURL(/https:\/\/(www\.)?saucedemo\.com/);
  });

  test('User with valid username and password should login successfully', async ({ page }) => {
    await expect(loginPage.submitButton).toBeVisible();
    await loginPage.fillLoginForm(validUser.username, validUser.password);
    await loginPage.clickSubmitButton();
    await expect(inventoryPage.productsTitleLocator).toBeVisible();
    await expect(page).toHaveURL(/inventory\.html$/i);
  });

  test('User with invalid password should fail to login', async ({ }) => {
    await expect(loginPage.submitButton).toBeVisible();
    await loginPage.fillLoginForm(invalidPasswordUser.username, invalidPasswordUser.password);
    await loginPage.clickSubmitButton();
    //await executeActionOnElem(browserName,loginPage.submitButton);
    await expect(loginPage.failedLoginLocator).toBeVisible();
  });

  test('User with invalid username should fail to login', async ({ }) => {
    await expect(loginPage.submitButton).toBeVisible();
    await loginPage.fillLoginForm(invalidUsernameUser.username, invalidUsernameUser.password);
    //await executeActionOnElem(browserName, loginPage.submitButton);
    await loginPage.clickSubmitButton();
    await expect(loginPage.failedLoginLocator).toBeVisible();
  });

  test('User with both wrong username and password should fail to login', async ({ browserName }) => {
    await expect(loginPage.submitButton).toBeVisible();
    await loginPage.fillLoginForm(invalidCredentialsUser.username, invalidCredentialsUser.password);
    //await executeActionOnElem(browserName,loginPage.submitButton);
    await loginPage.clickSubmitButton();
    await expect(loginPage.failedLoginLocator).toBeVisible();
  });

  test('User with empty username should fail to login', async ({ page }) => {
     await expect(loginPage.submitButton).toBeVisible();
     await loginPage.fillLoginForm("", validUser.password);
     await loginPage.clickSubmitButton();
     await expect(loginPage.failedLoginLocator).toBeVisible();
  });

  
  test('User with empty password should fail to login', async ({ page }) => {
     await expect(loginPage.submitButton).toBeVisible();
     await loginPage.fillLoginForm(validUser.username, "");
     await loginPage.clickSubmitButton();
     await expect(loginPage.failedLoginLocator).toBeVisible();
  });

  
  test('User with empty username and empty password should fail to login', async ({ page }) => {
     await expect(loginPage.submitButton).toBeVisible();
     await loginPage.fillLoginForm("", "");
     await loginPage.clickSubmitButton();
     await expect(loginPage.failedLoginLocator).toBeVisible();
  })
  
  test('User should be able to log out', async ({ page }) => {

    await expect(loginPage.submitButton).toBeVisible();
    await loginPage.fillLoginForm(validUser.username, validUser.password);
    await loginPage.clickSubmitButton();
    //await executeActionOnElem(browserName,loginPage.submitButton);
    await expect(page).toHaveURL(/inventory\.html$/i);
    await expect(inventoryPage.productsTitleLocator).toBeVisible();

    //await executeActionOnElem(browserName,loginPage.homeTopLeftMenu);
    await inventoryPage.openBurguerMenu();  

    await inventoryPage.logout(); 
    //await executeActionOnElem(browserName,loginPage.logoutLocator);
    await expect(page).toHaveURL(/https:\/\/(www\.)?saucedemo\.com/);

  });

});
