import { chromium, FullConfig, expect } from "@playwright/test";
import { users } from "../test-data/users";
import path from "node:path";
const { validUser } = users; 

const authJson = path.join(__dirname, 'auth.json');

export default async function globalSetup(config: FullConfig) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    //define a baseline project to get baseURL from it
    const baselineProject = config.projects.find(project => project.name==='chromium');    
    const baseURL = baselineProject?.use.baseURL || undefined;
    if (baseURL === undefined) throw new Error ("Base URL is undefined!");
    
    await page.goto(`${baseURL}/inventory.html`);
    await page.getByPlaceholder('Username').fill(validUser.username);
    await page.getByPlaceholder('Password').fill(validUser.password);
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/inventory\.html$/i);

    //persist browser state (cookies)) 
    await page.context().storageState({ path: authJson });
}