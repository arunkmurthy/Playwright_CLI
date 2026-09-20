// spec: specs/saucedemo-login.md (scenario 1.2)
import { test, expect } from '../../src/fixtures/base';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import users from '../data/users.json';

test.describe('Login', () => {
  test('login-with-locked-out-user-shows-error @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Precondition: fresh landing page, no error banner
    await loginPage.goto();
    await expect(loginPage.errorAlert).toBeHidden();

    // 1. Type locked_out_user into the Username field
    await loginPage.usernameInput.fill(users.locked.username);
    await expect(loginPage.usernameInput).toHaveValue(users.locked.username);

    // 2. Type secret_sauce into the Password field
    await loginPage.passwordInput.fill(users.locked.password);
    await expect(loginPage.passwordInput).toHaveValue(users.locked.password);

    // 3. Click the Login button
    await loginPage.loginButton.click();
    await expect(loginPage.errorAlert).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    await expect(loginPage.dismissErrorButton).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.loginButton).toBeVisible();
    await expect(inventoryPage.title).toBeHidden();
    await expect(loginPage.usernameInput).toHaveValue(users.locked.username);
    await expect(loginPage.passwordInput).toHaveValue(users.locked.password);
  });
});
