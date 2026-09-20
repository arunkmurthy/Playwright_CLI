import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly items: Locator;
  readonly addToCartButtons: Locator;
  readonly emptyCartButton: Locator;
  readonly menuButton: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    this.emptyCartButton = page.getByRole('button', { name: 'Cart, empty' });
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.sortDropdown = page.getByRole('combobox', { name: 'Sort products' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }
}
