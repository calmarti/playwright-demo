import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly homeTopLeftMenu: Locator;
  readonly succesfulLoginLocator: Locator;
  readonly failedLoginLocator: Locator;
  readonly logoutLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.submitButton = page.locator('[data-test="login-button"]');
    this.homeTopLeftMenu = page.getByRole('button', { name: /Open Menu/i })
    this.succesfulLoginLocator = page.getByTestId('title');
    this.failedLoginLocator = page.getByTestId('error');
    this.logoutLocator = page.getByRole('link', { name: /Logout/i });
  }

  async navigateToLoginPage() {
    await this.page.goto('/');
  }

  async fillLoginForm(username: string, password: string) {
    await expect(this.usernameInput, 'username input should be visible').toBeVisible();
    await this.usernameInput.fill(username);
    await expect(this.usernameInput, 'username input should be filled').toHaveValue(username);

    await expect(this.passwordInput, 'password input should be visible').toBeVisible();
    await this.passwordInput.fill(password);
    await expect(this.passwordInput, 'password input should be filled').toHaveValue(password);
  }

  //IMPORTANT: This action logic was refactored into a executeActionOnElem in utils.ts 

  /*   async clickSubmitButton() {
    await this.submitButton.click();
  } */

/*   async openHomeTopLeftMenu(){
    await this.homeTopLeftMenu.click();
  } */
  
/*   async getLogoutElemAndClick(){
    await this.logoutLocator.click();
  } */

}