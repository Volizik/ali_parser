import {Request, Response} from "express";

import {stringifyQueryString} from "../utils";
import { GooglePhotoSearch } from "../services/google_photo_search";

export const links = async (req: Request, res: Response) => {
    const imgSrc = stringifyQueryString(req.query.img);
    if (!imgSrc) {
        res.json({
            success: false,
            error: 'Send me product image link you want to find',
        })
        return;
    }
    const googlePhotoSearch = new GooglePhotoSearch();
    const links = await googlePhotoSearch.getSimilarLinks(imgSrc);

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
