// spec: specs/saucedemo-login.md (scenario 1.3)
import { test, expect } from '../../src/fixtures/base';
import { LoginPage } from '../../src/pages/LoginPage';
import users from '../data/users.json';

test.describe('Login', () => {
  test('login-with-empty-username-shows-error @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Precondition: fresh landing page, both fields empty, no error banner
    await loginPage.goto();
    await expect(loginPage.usernameInput).toBeEmpty();
    await expect(loginPage.passwordInput).toBeEmpty();
    await expect(loginPage.errorAlert).toBeHidden();

    // 1. Leave the Username field empty
    await expect(loginPage.usernameInput).toBeEmpty();

    // 2. Type secret_sauce into the Password field
    await loginPage.passwordInput.fill(users.standard.password);
    await expect(loginPage.passwordInput).toHaveValue(users.standard.password);

    // 3. Click the Login button
    await loginPage.loginButton.click();
    await expect(loginPage.errorAlert).toHaveText('Epic sadface: Username is required');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.usernameInput).toBeEmpty();
    await expect(loginPage.passwordInput).toHaveValue(users.standard.password);

    // 4. Click the "Dismiss error" button in the alert
    await loginPage.dismissErrorButton.click();
    await expect(loginPage.errorAlert).toBeHidden();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
