import { expect, Page, Locator }  from '@playwright/test';

class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submit_button: Locator;
  readonly home_unique_selector: Locator;
  readonly error: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("#user-name");
    this.passwordInput = page.locator("#password");
    this.submit_button = page.locator("#login-button");
    this.home_unique_selector = page.locator("#shopping_cart_container");
    this.error = page.locator("[data-test=\"error\"]");
  } 
  async navigateToLoginPage(url:string) {
    await this.page.goto(url);
  }

  async verifyLoginPageIsDisplayed() {
    await expect(this.page).toHaveURL(/.*saucedemo\.com\/?/);
    const title = await this.page.title();
    await expect(title).toMatch(/Swag Labs/i);
  }

  async fillLoginForm(username:string, password:string) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await expect(this.usernameInput).toHaveValue(username);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await expect(this.passwordInput).toHaveValue(password);   
  } 
  
  async clickSubmitButton() {
    await expect(this.submit_button).toBeVisible();
    await this.submit_button.click();
  }

  async verifySuccesfulLogin() {
    await expect(this.page).toHaveURL(/.*saucedemo\.com\/inventory\.html\/?$/);
    await expect(this.home_unique_selector).toBeVisible();
  }

  async verifyErrorMsg(errorMsg:string) {
    await expect(this.error).toBeVisible();
    await expect(this.error).toHaveText(errorMsg);
  }

}

export { LoginPage };