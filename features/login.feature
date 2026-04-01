Feature: Login Page

    As a user 
    I want to test
    All basic scenarios for login Page    

    Scenario: Login with valid credentials
      Given I am on the login screen
      When I fill the login form with username "standard_user" and password "secret_sauce"
      And I click on submit button
      Then I should be able to see the home screen  

    Scenario: Login using invalid credentials
      Given I am on the login screen
      When I fill the login form with username "unknown_user" and password "unknown_password"
      And I click on submit button
      Then I should see error "Epic sadface: Username and password do not match any user in this service"

    Scenario: Login using empty credentials
      Given I am on the login screen
      When I fill the login form with username "" and password ""
      And I click on submit button
      Then I should see error "Epic sadface: Username is required"
    
    Scenario: Login using valid user but invalid password
      Given I am on the login screen
      When I fill the login form with username "standard_user" and password "wrong_pass"
      And I click on submit button
      Then I should see error "Epic sadface: Username and password do not match any user in this service"

    Scenario: Login using invalid user but valid password
      Given I am on the login screen
      When I fill the login form with username "unknown_user" and password "secret_sauce"
      And I click on submit button
      Then I should see error "Epic sadface: Username and password do not match any user in this service"
