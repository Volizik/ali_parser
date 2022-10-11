import { launch } from 'puppeteer'

//     private googleLink = 'https://images.google.com/';
//     private modalSelector = '[aria-label="Поиск по картинке"]';
//     private inputSelector = '[placeholder="Вставьте ссылку на изображение"]';
//     private linkSelector = 'https://aliexpress.ru/item/';

export class GooglePhotoSearch {
    private googleLink = 'https://www.google.com/imghp?hl=en';
    private buttonSelector = '[aria-label="Search by image"]';
    private inputSelector = '[placeholder="Paste image link"]';
    private linkSelector = 'https://www.aliexpress.com/i';

    public async getSimilarLinks(imageSrc: string) {
        const browser = await launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ]
        });

        try {
            const page = await browser.newPage();
            await page.goto(this.googleLink);

            await page.click(this.buttonSelector);
            await page.evaluate((inputSelector, imageSrc) => {
                const input: HTMLInputElement | null = document.querySelector(inputSelector);
                const button = input?.nextElementSibling as HTMLElement;
                if (input && button) {
                    input.value = imageSrc;
                    button.click?.();
                }
            }, this.inputSelector, imageSrc);

            await page.waitForNavigation();

            return await page.evaluate((linkSelector) => Array.from(
                document.querySelectorAll<HTMLAnchorElement>(`a[href^="${linkSelector}"]`),
                (element) => element.href
            ), this.linkSelector);
        } catch (e) {
            return e;
        } finally {
            await browser.close();
        }
    }
}
