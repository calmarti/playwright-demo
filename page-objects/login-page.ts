import { expect, Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly succesfulLoginLocator: Locator;
  readonly failedLoginHeadingLocator: Locator;
  readonly failedLoginMessage: Locator;
  

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.getByRole('button', { name: 'Log In' });
    this.succesfulLoginLocator = page.getByText(/Welcome/i);
    this.failedLoginHeadingLocator = page.getByRole('heading', { name: /Error/i})
    this.failedLoginMessage = page.getByText(/The username and password could not be verified\./i);
  }

  async navigateToLoginPage() {
    await this.page.goto('/');
  }

  async fillLoginForm(username: string, password: string) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await expect(this.usernameInput).toHaveValue(username);

    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await expect(this.passwordInput).toHaveValue(password);
  }

  async clickSubmitButton() {
    await expect(this.submitButton).toBeVisible();
    await this.submitButton.click();
  }

/*   async verifyErrorMsg(errorMsg: string) {
    await expect(this.loginError).toBeVisible();
    await expect(this.loginError).toHaveText(errorMsg);
  } */

}