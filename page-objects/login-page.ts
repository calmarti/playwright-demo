import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly succesfulLoginLocator: Locator;
  readonly failedLoginLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.submitButton = page.locator('[data-test="login-button"]');
    this.succesfulLoginLocator = page.getByText('Products');
    this.failedLoginLocator = page.getByRole('heading', { name: "Epic sadface: Username and password do not match any user in this service"});
  }

  async navigateToLoginPage() {
    await this.page.goto('/');
    await expect(this.page)
      .toHaveURL(/https:\/\/(www\.)?saucedemo\.com/i);
    await
      expect(this.page)
      .toHaveTitle(/Swag Labs/i);
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

}