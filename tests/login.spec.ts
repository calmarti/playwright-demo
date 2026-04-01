import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login-page.ts';
import { users } from '../test-data/users.ts';
const { validUser, invalidUsernameUser, invalidPasswordUser, invalidCredentialsUser } = users;

test.describe('Login page test cases', () => {
  let loginPage: LoginPage; 

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);   
  })
  
  test('user with valid credentials is able to login successfully', async ({ page }) => {
    
    await test.step('Given I\'m on the login page', async () => {
      await loginPage.navigateToLoginPage();
      await expect(page, 'Login page has unexpected URL').toHaveURL(/.*saucedemo\.com\/?/);
      //const title = await page.title();
      //expect(title).toMatch(/Swag Labs/i);
      await expect(page, 'Login page has unexpected title').toHaveTitle(/Swag Labs/i);
    });

    await test.step('When I fill the username input with a valid username', async () => {
      await loginPage.fillLoginForm(validUser.username, validUser.password);
    });

    await test.step('When I click on the submit button', async () => {
      await loginPage.clickSubmitButton();  
    });

    await test.step('Then I log in successfully: I\'m redirected to Home page', async () => {
      await expect(page, 'Home page has unexpected URL').toHaveURL(/.*saucedemo\.com\/inventory\.html\/?$/);
      await expect(loginPage.home_unique_locator, 'Home unique locator is not visible').toBeVisible();
    });

  });

});
