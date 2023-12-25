import { test, expect } from '@playwright/test';
import { chromium, Browser, Page, BrowserContext } from 'playwright';
import { JDoodlePage } from '../pages/JDoodlePage.ts';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let jdoodlePage: JDoodlePage;

test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    jdoodlePage = new JDoodlePage(page);

    await jdoodlePage.navigate();
});

test.afterAll(async () => {
    await browser.close();
});

test.describe('JDoodle Test Suite', () => {
    test('Test Case 1: Input code into the editor', async () => {
        await jdoodlePage.clearCodeEditor();
        await jdoodlePage.inputCode('public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}');
    });

    test('Test Case 2: Click the Run button', async () => {
        await jdoodlePage.clickRunButton();
    });

    test('Test Case 3: Verify the output', async () => {
        const output = await jdoodlePage.getOutputText();
        expect(output).toContain('Hello, World!');
    });

    test('Test Case 4: Validate Save (to local file)', async () => {
        await jdoodlePage.initiateDownload();
        const downloadCompleteText = await jdoodlePage.getdownloadStatus();
        expect(downloadCompleteText).toContain('Downloaded Successfully!');
    });

    test('Test Case 5: Validate Instant Share (No Login/Save required)', async () => {
        const statusText = await jdoodlePage.clickShareLink();
        expect(statusText).toContain('Copied to clipboard!');
        const link = await jdoodlePage.getsharedlink();
        console.log("share link: ", link);
    });




});