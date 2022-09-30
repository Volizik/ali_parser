import {Request, Response} from "express";

import {stringifyQueryString} from "../utils";
import { getLinks } from "../services/links";

export const links = async (req: Request, res: Response) => {
    const imgSrc = stringifyQueryString(req.query.img);
    if (!imgSrc) {
        res.json({
            success: false,
            error: 'Send me product image link you want to find',
        })
        return;
    }
    const links = await getLinks(imgSrc);

    if (!Array.isArray(links)) {
        res.json({
            success: false,
            error: 'Something went wrong: check if you enter correct image link',
        })
        return;
    }

    res.json({
        success: true,
        data: links,
    })
}
