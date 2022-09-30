import {Request, Response} from "express";

import {stringifyQueryString} from "../utils";
import {getProduct} from "../services/product";

export const product = async (req: Request, res: Response) => {
    const id = stringifyQueryString(req.query.id);
    if (!id) {
        res.json({
            success: false,
            error: 'Send me product id',
        })
        return;
    }
    const product = await getProduct(id);

    res.json({
        success: true,
        data: product,
    });
}
