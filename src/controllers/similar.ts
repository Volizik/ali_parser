import {Request, Response} from "express";

import {stringifyQueryString} from "../utils";
import { AliProductParser } from "../services/ali_product_parser";
import {GooglePhotoSearch} from "../services/google_photo_search";

export const similar = async (req: Request, res: Response) => {
    const id = stringifyQueryString(req.query.id);
    if (!id) {
        res.json({
            success: false,
            error: 'Send me product id',
        })
        return;
    }
    const parser = new AliProductParser();
    const info = await parser.getInfo(id);
    const image = info?.imageModule?.imagePathList?.[0];

    if (!image) {
        res.json({
            success: false,
            error: 'Can\'t find image',
        })
        return;
    }

    const googlePhotoSearch = new GooglePhotoSearch();
    const links = await googlePhotoSearch.getSimilarLinks(image);
    console.log(`[Links]: `, links)

    if (!Array.isArray(links)) {
        res.json({
            success: false,
            error: 'Something went wrong: check if you enter correct image link',
        })
        return;
    }

    const regexp = /(?<=aliexpress\.com\/|aliexpress\.ru\/).*(?=\.html)/
    const ids = links.map((link) => link.match(regexp))

    const products: Promise<any>[] = []
    ids.forEach((id) => {
        products.push(parser.getInfo(id));
    });

    const items = await Promise.all(products);

    const cards = items.map((item) => ({
        src: item?.imageModule?.imagePathList?.[0],
        href: item?.storeModule?.detailPageUrl,
        name: item?.titleModule?.subject,
        price: item?.priceModule?.formatedPrice,
    })).filter((item) => item.name);

    // res.json({
    //     success: true,
    //     data: cards,
    // });
    res.render('index', { cards });
}
