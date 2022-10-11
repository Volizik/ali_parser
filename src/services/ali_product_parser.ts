import axios from "axios";
import { load } from 'cheerio';
import useragent from 'random-useragent';

export class AliProductParser {
    private region = 'HE'
    private cookies = [
        'xman_t=HgkbMmpnhwmLgsenxlUl+de2hA7dLnD790+Nf5/VKeUxOlI1ApbGfvZ5nWJ49VKn',
        'xman_us_f=x_locale=en_US&x_l=0&x_c_chg=0&x_c_synced=0&acs_rt=90304f96696b4ed9bda271f255d51979',
        'xman_f=sldmgNOy8BMU/+8FBiz0WXEHEL20/JJy1hsi1ysNKajUw6qON+uW4scCOwCplD9k4FPZHWTUYiMi5gpVBeT12WCUPzwwqx7ioyO/9LuTKpeHfOkoFFPJ9NYaVFJTpY7pku9cg+gFuQIMeWPx3tPloiRlSWzUb/8MFejmQk+br87K4HAFczI9mhYZ3MHZ7mZnQa4OTLh/o7RKjDmIFm/tVzCFjqWgccWMYxf9BAkhvQ89ua/ykY66PSsWFeZHhe7heTEcjF8s522CQ2Z7sHuQVaI6jM7pHAKX8pq6G3mv6bbLaSe+U8JWrltJ5fCK5qscYzt1NQRddRBTD5I+Vtp8hNou7gn0AAb2ZG/QSq4AvisCOyZW3dDRgAnDRmZhNkC8IMXB1GSIaE/x+Hd0QZzQQH7zngQdVo3b7FvBbwGz1nygfHs/sABwRdYyxJFQXsgq9+IiaetGHDY=',
        'cna=etkIF8jU3lICAV1RjQ/hz6ET',
        `aep_usuc_f=site=glo&c_tp=USD&x_alimid=1943995510&isb=y&region=${this.region}&b_locale=en_US`,
    ]

    private getUrl(id: string) {
        return `https://www.aliexpress.com/item/${id}.html`
    }

    private getUserAgent() {
        return useragent.getRandom();
    }

    private getHeaders(id: string) {
        const url = this.getUrl(id);

        return {
            'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Encoding' : 'gzip, deflate, br',
            'Accept-Language' : 'en-US,en;q=0.9,en-US;q=0.8,en;0.7',
            'Host' : 'www.aliexpress.com',
            'Cache-Control' : 'no-cache',
            'Connection' : 'keep-alive',
            'Upgrade-Insecure-Requests' : '1',
            'Referer' : url,
            'Pragma' : 'no-cache',
            'Sec-Fetch-Mode' : 'navigate',
            'Sec-Fetch-Site' : 'same-origin',
            'sec-Fetch-User' : '?1',
            'Cookie' : this.cookies.join(';'),
            'User-Agent' : this.getUserAgent(),
        }
    }

    public async getInfo(id: string): Promise<Record<string, any> | null> {
        const url = this.getUrl(id);
        const headers = this.getHeaders(id);

        try {
            const res = await axios.get(url, { headers });
            const $ = load(res.data);
            const selector = $('body > script').filter(function() {
                return $(this).text().trim().includes('window.runParams');
            });
            const regexp = /window.runParams[\n\r\s]+=[\n\r\s]+{[\n\r\s]+data:[\n\r\s]+(.*?),[\n\r\s]+csrfToken/s;
            const selectedString = (selector.text().match(regexp) || [])[1];
            return selectedString ? JSON.parse(selectedString.replace(/\n\r\s/g, '')) : null;
        } catch (e: any) {
            console.log(e?.message)
            return null
        }
    }
}
