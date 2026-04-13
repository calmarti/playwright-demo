import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly succesfulLoginLocator: Locator;
  readonly failedLoginLocator: Locator;
  readonly openTopLeftMenuLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    //TODO: add locator suffix where needed
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.submitButton = page.locator('[data-test="login-button"]');
    this.succesfulLoginLocator = page.getByText('Products');
    this.failedLoginLocator = page.getByRole('heading', { name: "Epic sadface: Username and password do not match any user in this service"});
    this.openTopLeftMenuLocator = page.getByRole('button', { name: /Open Menu/i })
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

  async clickSubmitButton() {
    await this.submitButton.click(); 
  }

  async logout(){
    this.openTopLeftMenuLocator.click();
  }
}