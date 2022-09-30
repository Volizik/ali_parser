import { ParsedQs } from 'qs';

export const stringifyQueryString = (query?: string | ParsedQs | string[] | ParsedQs[]): string | undefined => {
    if (Array.isArray(query)) return stringifyQueryString(query[0]);
    if (typeof query === 'object') {
        return stringifyQueryString(Object.values(query)[0]);
    }
    return query;
}
