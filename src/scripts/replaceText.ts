
import { ReplaceText } from "./interfaces"

export default (query: string, replaceOption: Array<ReplaceText>) => {
    let replacedQuery: string = query;

    replaceOption.forEach((elem) => {
        replacedQuery = replacedQuery.replaceAll(elem.before, elem.after);
    })

    return replacedQuery;
}