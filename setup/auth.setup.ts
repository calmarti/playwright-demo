//This file will be run for spec files that require an authenticated context

import { test as setup, expect } from '@playwright/test';
import { users } from '../test-data/users';
import path from 'node:path';

const { validUser } = users;

const authJson = path.join(__dirname, 'auth.json');

setup('authentication', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill(validUser.username);
    await page.getByPlaceholder('Password').fill(validUser.password);
    await page.locator('[data-test="login-button"]').click();   
    await expect(page).toHaveURL(/inventory\.html$/i);

    await page.context().storageState({ path: authJson });
})
