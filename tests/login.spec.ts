import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login-page';
import { users } from '../test-data/users';

const { validUser, invalidPasswordUser, invalidUsernameUser, invalidCredentialsUser } = users;

test.describe('Login page test cases', () => {
  let loginPage: LoginPage; 

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);   
  })
  
  test('user with valid credentials should login successfully', async ({ page }) => {

    await test.step('Given user is on the login page', async () => {
      await loginPage.navigateToLoginPage();
      await expect(page, 'Login page URL')
      .toHaveURL(/^https:\/\/parabank\.parasoft\.com\/parabank(?:\/index\.htm)?(?:;jsessionid=.*)?$/);
      await expect(page, 'Login page title').toHaveTitle(/'ParaBank | Welcome | Online Banking'/i);
      //const title = await page.title();
      //expect(title).toMatch(/Accounts Overview/i);
    });

    await test.step('When user fills username and password inputs with valid credentials', async () => {
      await loginPage.fillLoginForm(validUser.username, validUser.password);
    });

    await test.step('When user clicks on the submit button', async () => {
      await loginPage.clickSubmitButton();  
    });

    await test.step('Then user logs in successfully: she/he is redirected to Accounts Dashboard page', async () => {
      await expect(page, 'Accounts Dashboard URL').toHaveURL('https://parabank.parasoft.com/parabank/overview.htm');
      await expect(loginPage.succesfulLoginLocator, 'Succesful login locator').toBeVisible();
    });

  });

  test('user with valid username and invalid password should fail to login', async ({ page }) => {

    await test.step('Given user is on the login page', async () => {
      await loginPage.navigateToLoginPage();
      await expect(page, 'Login page URL')
      .toHaveURL(/^https:\/\/parabank\.parasoft\.com\/parabank(?:\/index\.htm)?(?:;jsessionid=.*)?$/);
      await expect(page, 'Login page title').toHaveTitle(/'ParaBank | Welcome | Online Banking'/i);
    });

    await test.step('When user fills username and password inputs with valid username but invalid password', async () => {
      await loginPage.fillLoginForm(invalidPasswordUser.username, invalidPasswordUser.password);
    });

    await test.step('When user clicks on the submit button', async () => {
      await loginPage.clickSubmitButton();  
    });

    await test.step('Then login fails and an error message is shown' , async () => {
      await expect(loginPage.failedLoginHeadingLocator, 'Failed login heading').toBeVisible();    
      await expect(loginPage.failedLoginMessage, 'Failed login message').toBeVisible();
    });

  });

  test.skip('user with invalid username and valid password should fail to login', async ({ page }) => {

  });

  test.skip('user with both invalid username and password should fail to login', async ({ page }) => {

  });

});
