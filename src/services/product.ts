import { launch } from 'puppeteer'

const dataSelector = '#__AER_DATA__'

export const getProduct = async (id: string): Promise<any> => {
    const link = `https://aliexpress.ru/item/${id}.html`;
    const browser = await launch({ headless: false });

    try {
        const page = await browser.newPage();
        await page.goto(link);

        // await page.waitForSelector(dataSelector)
        const script = await page.$(dataSelector);
        const value = await page.evaluate(el => el?.textContent, script);
        const parsedValue = JSON.parse(value || '{}');

        if (!parsedValue?.widgets[1]?.props) throw new Error('No info');

        const props = parsedValue.widgets[1].props;
        const id = props.id;
        const name = props.name;
        const image = props.skuInfo?.propertyList[0]?.values[0]?.imageMainUrl;
        console.log({ id, name, image })
        return { id, name, image };
    } catch (e) {
        console.log(e)
        return e;
    } finally {
        await browser.close();
    }
}
