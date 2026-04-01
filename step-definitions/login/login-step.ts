import { LoginPage } from '../../page-objects/login-page';


Given('I am on the login screen', async function(this: CustomWorld) {
  const loginPage = new LoginPage(this.page!); 
  await loginPage.navigateToLoginPage(this.BASE_URL);
  await loginPage.verifyLoginPageIsDisplayed();
});

When('I fill the login form with username {string} and password {string}', 
  async function(this: CustomWorld, username:string, password:string) { 
  const loginPage = new LoginPage(this.page!);
  await loginPage.fillLoginForm(username, password);
}); 

When('I click on submit button', async function(this: CustomWorld) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.clickSubmitButton();
});

Then('I should be able to see the home screen', async function(this: CustomWorld) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.verifySuccesfulLogin();
}); 

Then('I should see error {string}', async function(this: CustomWorld, errorMsg:string) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.verifyErrorMsg(errorMsg);
}); 




  

  
  