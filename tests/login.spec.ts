import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login-page';
import { users } from '../test-data/users';
import { ProductsPage } from '../page-objects/products-page';

const { validUser, invalidPasswordUser, invalidUsernameUser, invalidCredentialsUser } = users;

//this overrides storageState set in global.setup.ts
//test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login page test cases', () => {
  let loginPage: LoginPage; 

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await expect(page).toHaveURL(/https:\/\/(www\.)?saucedemo\.com/);
  });
  
  test('user with valid credentials should login successfully', async ({ page }) => {

    await test.step('Given user is on the login page', async () => {
      await expect(loginPage.submitButton).toBeVisible();
    });  

    await test.step('When user fills username and password inputs with valid credentials', async () => {
      await loginPage.fillLoginForm(validUser.username, validUser.password);
    });

    await test.step('When user clicks on the submit button', async () => {
      await loginPage.clickSubmitButton();  
    });

    await test.step('Then user logs in successfully: she/he is redirected to Home', async () => {
      await expect(page)
      .toHaveURL(/inventory\.html$/i);
      await expect(loginPage.succesfulLoginLocator, 'Succesful login locator should be visible')
      .toBeVisible();
    });

  });

  test('User with valid username and invalid password should fail to login', async ({ page }) => {

    await test.step('Given user is on the login page', async () => {
      await expect(loginPage.submitButton).toBeVisible();
    });

    await test.step('When user fills username and password inputs with valid username but invalid password', async () => {
      await loginPage.fillLoginForm(invalidPasswordUser.username, invalidPasswordUser.password);
    });

    await test.step('When user clicks on the submit button', async () => {
      await loginPage.clickSubmitButton();  
    });

    await test.step('Then login fails and an error message is shown' , async () => {
      await expect(loginPage.failedLoginLocator).toBeVisible();     
    });

  });

  test('user with invalid username and valid password should fail to login', async ({ page }) => {

    await test.step('Given user is on the login page', async () => {
      await expect(loginPage.submitButton).toBeVisible();
    });

    await test.step('When user fills username and password inputs with invalid username and valid password', async () => {
      await loginPage.fillLoginForm(invalidUsernameUser.username, invalidUsernameUser.password);
    });

    await test.step('When user clicks on the submit button', async () => {
      await loginPage.clickSubmitButton();  
    });

    await test.step('Then login fails and an error message is shown' , async () => {
      await expect(loginPage.failedLoginLocator).toBeVisible();     
    });

  });

  test('user with both wrong username and password should fail to login', async ({ page }) => {
      await test.step('Given user is on the login page', async () => {
       await expect(loginPage.submitButton).toBeVisible();
    });

    await test.step('When user fills username and password inputs with both wrong username and password', async () => {
      await loginPage.fillLoginForm(invalidCredentialsUser.username, invalidCredentialsUser.password);
    });

    await test.step('When user clicks on the submit button', async () => {
      await loginPage.clickSubmitButton();  
    });

    await test.step('Then login fails and an error message is shown' , async () => {
      await expect(loginPage.failedLoginLocator).toBeVisible();     
    });
  });

  test.only('Valid user should be able to log out', async ({ page }) => {
    //arrange: go to login page and perform a succesful login
    await expect(loginPage.submitButton).toBeVisible();
    await loginPage.fillLoginForm(validUser.username, validUser.password);
    await loginPage.clickSubmitButton(); 
    await expect(page).toHaveURL(/inventory\.html$/i);
    await expect(loginPage.succesfulLoginLocator).toBeVisible(); 
    //act: find open menu locator and click on it so that logout option appears
    await loginPage.openTopLeftMenuLocator.click();
    //act: find logout locator and click on it
    await page.getByRole('link', { name: /Logout/i }).click();
    //assert: actual url matches (expected) login page URL
    await expect(page).toHaveURL(/https:\/\/(www\.)?saucedemo\.com/);
  })
  
});
