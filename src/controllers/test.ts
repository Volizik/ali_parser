import {Request, Response} from "express";
import { launch } from 'puppeteer'

export const test = async (req: Request, res: Response) => {
    const googleLink = 'https://www.google.com/imghp?hl=en';
    const buttonSelector = '[aria-label="Search by image"]';

    const browser = await launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    });

    try {
        const page = await browser.newPage();
        await page.goto(googleLink);

        const html = await page.$eval('html', (element) => {
            return element.innerHTML
        })
        res.send(html)
    } catch (e) {

    } finally {
        await browser.close();
    }
}
