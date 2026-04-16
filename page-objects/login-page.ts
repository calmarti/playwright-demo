import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly failedLoginLocator: Locator;

    //TODO: update locators to use getByTestId
    constructor(page: Page) {
      this.page = page;
      this.usernameInput = page.getByPlaceholder('Username');
      this.passwordInput = page.getByPlaceholder('Password');
      this.submitButton = page.locator('[data-test="login-button"]');
      this.failedLoginLocator = page.getByTestId('error');
    }

    async navigateToLoginPage() { 
      await this.page.goto('/');
    }

    async fillLoginForm(username: string, password: string) {
      await this.usernameInput.fill(username);
      await expect(this.usernameInput, 'username input should be filled').toHaveValue(username);
      await this.passwordInput.fill(password);
      await expect(this.passwordInput, 'password input should be filled').toHaveValue(password);
    }

    async clickSubmitButton() {
      await this.submitButton.click();
    }

  } 