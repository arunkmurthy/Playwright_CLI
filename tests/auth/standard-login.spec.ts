// spec: specs/saucedemo-login.md (scenario 1.1)
import { test, expect } from '../../src/fixtures/base';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import users from '../data/users.json';

test.describe('Login', () => {
  test('login-with-standard-user-succeeds @smoke @critical', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Precondition: fresh landing page, no error banner
    await loginPage.goto();
    await expect(loginPage.errorAlert).toBeHidden();

    // 1. Type standard_user into the Username field
    await loginPage.usernameInput.fill(users.standard.username);
    await expect(loginPage.usernameInput).toHaveValue(users.standard.username);

    // 2. Type secret_sauce into the Password field
    await loginPage.passwordInput.fill(users.standard.password);
    await expect(loginPage.passwordInput).toHaveValue(users.standard.password);
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    // 3. Click the Login button
    await loginPage.loginButton.click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveTitle('Swag Labs');
    await expect(loginPage.errorAlert).toBeHidden();
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(6);
    await expect(inventoryPage.addToCartButtons).toHaveCount(6);
    await expect(inventoryPage.emptyCartButton).toBeVisible();
    await expect(inventoryPage.menuButton).toBeVisible();
    await expect(inventoryPage.sortDropdown).toBeVisible();
    await expect(inventoryPage.sortDropdown).toHaveValue('az');
    await expect(loginPage.loginButton).toBeHidden();
  });
});
