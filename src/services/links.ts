import { launch } from 'puppeteer'

const googleLink = 'https://images.google.com/'
// const imageSrc = 'https://ae04.alicdn.com/kf/S80b264e07d8842c49bb5ba59cc11bd83c/MOC.jpg_640x640.jpg';
const modalSelector = '[aria-label="Поиск по картинке"]';
const inputSelector = '[placeholder="Вставьте ссылку на изображение"]';
const linkSelector = 'https://aliexpress.ru/item/';

export const getLinks = async (imageSrc: string): Promise<string[] | unknown> => {
    const browser = await launch({ headless: false });

    try {
        const page = await browser.newPage();
        await page.goto(googleLink);

        await page.click(modalSelector);
        await page.evaluate((inputSelector, imageSrc) => {
            const input: HTMLInputElement | null = document.querySelector(inputSelector);
            const button = input?.nextElementSibling as HTMLElement;
            if (input && button) {
                input.value = imageSrc;
                button.click?.();
            }
        }, inputSelector, imageSrc);

        await page.waitForNavigation();

        return await page.evaluate((linkSelector) => Array.from(
            document.querySelectorAll<HTMLAnchorElement>(`a[href^="${linkSelector}"]`),
            (element) => {

                const src = element.querySelector('img')?.src;
                return {href: element.href, name: element.ariaLabel, src }
            }
        ), linkSelector);
    } catch (e) {
        return e;
    } finally {
        await browser.close();
    }
}
