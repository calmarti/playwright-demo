import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login-page';
import { users } from '../test-data/users';
import { executeActionOnElem } from '../utils';

const { validUser, invalidPasswordUser, invalidUsernameUser, invalidCredentialsUser } = users;

//this overrides storageState set in global.setup.ts
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login page test cases', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await expect(page).toHaveURL(/https:\/\/(www\.)?saucedemo\.com/);
  });

  test('User with valid credentials should login successfully', async ({ page, browserName }) => {
    //arrange: verify current page is login page
    await expect(loginPage.submitButton).toBeVisible();
    //act: fill inputs 
    await loginPage.fillLoginForm(validUser.username, validUser.password);
    //act (click) + assert 
    //await loginPage.clickSubmitButton();
    await executeActionOnElem(browserName,loginPage.submitButton)
    await expect(loginPage.succesfulLoginLocator).toBeVisible();
    await expect(page).toHaveURL(/inventory\.html$/i);
  });

  test('User with valid username and invalid password should fail to login', async ({ browserName }) => {
    //arrange: verify current page is login page
    await expect(loginPage.submitButton).toBeVisible();
    //act: fill inputs 
    await loginPage.fillLoginForm(invalidPasswordUser.username, invalidPasswordUser.password);
    //act (click) + assert 
    //await loginPage.clickSubmitButton();
    await executeActionOnElem(browserName,loginPage.submitButton)
    await expect(loginPage.failedLoginLocator).toBeVisible();
  });

  test('User with invalid username and valid password should fail to login', async ({ browserName }) => {
    //arrange: verify current page is login page
    await expect(loginPage.submitButton).toBeVisible();
    //act: fill inputs 
    await loginPage.fillLoginForm(invalidUsernameUser.username, invalidUsernameUser.password);
    //act (click) + assert
    await executeActionOnElem(browserName, loginPage.submitButton)
    //await loginPage.clickSubmitButton();
    await expect(loginPage.failedLoginLocator).toBeVisible();
  });

  test('user with both wrong username and password should fail to login', async ({ browserName }) => {
    //arrange: verify current page is login page
    await expect(loginPage.submitButton).toBeVisible();
    //act: fill inputs 
    await loginPage.fillLoginForm(invalidCredentialsUser.username, invalidCredentialsUser.password);
    //act (click) + assert
    await executeActionOnElem(browserName,loginPage.submitButton)
    //await loginPage.clickSubmitButton();
    await expect(loginPage.failedLoginLocator).toBeVisible();
  });


  test('Valid user should be able to log out', async ({ page, browserName }) => {

    //arrange: go to login page and perform a succesful login
    await expect(loginPage.submitButton).toBeVisible();
    await loginPage.fillLoginForm(validUser.username, validUser.password);
    await executeActionOnElem(browserName,loginPage.submitButton)
    await expect(page).toHaveURL(/inventory\.html$/i);
    await expect(loginPage.succesfulLoginLocator).toBeVisible();

    //act: click on home's top left menu to make logout element appear
    await executeActionOnElem(browserName,loginPage.homeTopLeftMenu);
    //await loginPage.openHomeTopLeftMenu(browserName);
    //act: get logout element and click on it
    await executeActionOnElem(browserName,loginPage.logoutLocator);
    //await loginPage.getLogoutElemAndClick(browserName);
    //assert: actual url matches (expected) login page URL
    await expect(page).toHaveURL(/https:\/\/(www\.)?saucedemo\.com/);

  });

});
