
//置き換えテキスト
export interface ReplaceText {
    before: string
    after: string
}

/**
 * テキストの置き換え
 */
export default (query: string, replaceOption: Array<ReplaceText>) => {
    let replacedQuery: string = query;

    replaceOption.forEach((elem) => {
        replacedQuery = replacedQuery.replaceAll(elem.before, elem.after);
    })

    return replacedQuery;
}