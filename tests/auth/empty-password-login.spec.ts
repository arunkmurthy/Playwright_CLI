// spec: specs/saucedemo-login.md (scenario 1.4)
import { test, expect } from '../../src/fixtures/base';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import users from '../data/users.json';

test.describe('Login', () => {
  test('login-with-empty-password-shows-error @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Precondition: fresh landing page, both fields empty, no error banner
    await loginPage.goto();
    await expect(loginPage.usernameInput).toBeEmpty();
    await expect(loginPage.passwordInput).toBeEmpty();
    await expect(loginPage.errorAlert).toBeHidden();

    // 1. Type standard_user into the Username field
    await loginPage.usernameInput.fill(users.standard.username);
    await expect(loginPage.usernameInput).toHaveValue(users.standard.username);

    // 2. Leave the Password field empty
    await expect(loginPage.passwordInput).toBeEmpty();

    // 3. Click the Login button
    await loginPage.loginButton.click();
    await expect(loginPage.errorAlert).toHaveText('Epic sadface: Password is required');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.usernameInput).toHaveValue(users.standard.username);
    await expect(loginPage.passwordInput).toBeEmpty();
    await expect(inventoryPage.title).toBeHidden();
  });
});
