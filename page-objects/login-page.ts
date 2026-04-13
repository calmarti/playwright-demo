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
    this.failedLoginLocator = page.getByRole('heading', { name: "Epic sadface: Username and password do not match any user in this service"});
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

  async clickSubmitButton(browserName: string) {
      if (browserName === 'firefox') {
    //await this.submitButton.click({ force: true });
    await this.submitButton.focus();
    await this.page.keyboard.press('Enter');
  } else {
    await this.submitButton.click();
  }}

  async openHomeTopLeftMenu(browserName:string){
    if (browserName === 'firefox'){
      await this.homeTopLeftMenu.focus();
      await this.page.keyboard.press('Enter');
    }
    else{
      await this.homeTopLeftMenu.click();
    }

  }
  
  async getLogoutElemAndClick(browserName:string){
     if (browserName === 'firefox'){
      await this.logoutLocator.focus();
      await this.page.keyboard.press('Enter');
    }
    else{
      await this.logoutLocator.click();
    }
  }
}