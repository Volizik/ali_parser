import {Request, Response} from "express";
import {stringifyQueryString} from "../utils";
import {getProduct} from "../services/product";
import {getLinks} from "../services/links";

export const similar = async (req: Request, res: Response) => {
    const id = stringifyQueryString(req.query.id);
    if (!id) {
        res.json({
            success: false,
            error: 'Send me product id',
        })
        return;
    }
    const product = await getProduct(id);
    console.log('[similar]', product)
    if (!product?.image) {
        res.json({
            success: false,
            error: 'Send me product image link you want to find',
        })
        return;
    }
    const links = await getLinks(product.image);
    console.log(links)
    if (!Array.isArray(links)) {
        res.json({
            success: false,
            error: 'Something went wrong: check if you enter correct image link',
        })
        return;
    }

    // res.json({
    //     success: true,
    //     data: links,
    // })
    res.render('index', { links });
}
