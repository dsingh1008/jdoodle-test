import { Page, Locator } from 'playwright';

export class JDoodlePage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('/online-java-compiler');
    }

    async inputCode(code: string) {
        await this.page.locator('#code').getByRole('textbox').fill(code);
    }

    async clickRunButton() {
        await this.page.click("//button[contains(text(), 'Execute')]");
    }

    async getOutputText() {
        await this.page.waitForFunction(() => {
            const outputElement = document.querySelector('#output');
            if (outputElement) {
                const textContent = outputElement.textContent || '';
                return !textContent.includes('JDoodle in Action.... Running the program...');
            }
            return true;
        }, { timeout: 5000 });
        const outputElement = await this.page.$('#output');
        if (outputElement) {
            return await outputElement.textContent();
        }
        return '';
    }

    async clearCodeEditor() {
        await this.page.locator('#code').getByRole('textbox').clear();
    }

    async clickShareLink() {
        await this.page.locator('div:nth-child(8) > .btn').first().click();
        await this.page.getByRole('button', { name: 'Create Share URLs' }).click();
        await this.page.locator('button.link-secondary span').first().click();
        const shareMsg = await this.page.locator('.p-xsmall.success:not(.hidden)').last().textContent();
        return shareMsg
    }

    async getsharedlink() {
        const linkFromClipboard = await this.page.evaluate(async () => {
            return await navigator.clipboard.readText();
        });
        return linkFromClipboard;
    }



    async initiateDownload() {
        await this.page.locator('div:nth-child(11) > .btn').first().click();
    }

    async getdownloadStatus() {
        const downloadMsg = await this.page.locator('div:nth-child(11) div > p:nth-child(1)').textContent();
        return downloadMsg
    }
}
