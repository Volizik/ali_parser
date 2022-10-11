import {Request, Response} from "express";

import {stringifyQueryString} from "../utils";
import { AliProductParser } from "../services/ali_product_parser";

export const product = async (req: Request, res: Response) => {
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

    res.json({
        success: info !== null,
        data: info,
    });
}
