import { Locator } from "@playwright/test"

//this fixes firefox issue with 'click' action
export async function executeActionOnElem(browserName: string, elem: Locator){
    switch (browserName) {
        case 'chromium':
            await elem.click();
            break;
        case 'webkit':
            await elem.click();
            break;
        case 'firefox':
            await elem.press('Enter');
            break;
        default:
            await elem.click();
    }
};
