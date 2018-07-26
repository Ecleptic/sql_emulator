;('use-strict')

export function getTableName(query) {
    const fromPlace = query
        .join(' ')
        .toUpperCase()
        .split(' ')
        .indexOf('FROM')
    const tableName = fromPlace !== -1 ? query[fromPlace + 1] : query[1]
    return tableName
}

export function getIndexOfString(string, query) {
    let place = -1
    const capsQuery = query.map(str => str.toUpperCase())
    place = query.indexOf(string.toUpperCase())

    return place
}

export function splitStrings(input) {
    const equalsAccountedFor = input.split('=').join(' = ')
    const commaAccountedFor = equalsAccountedFor.split(',').join(' ')
    const newlineAccountedFor = commaAccountedFor.split(/\n/).join(' ')
    const stringsAccountedFor = newlineAccountedFor.match(
        /\w+|"[^"]*"|=|\*|'[^']*'|`[^`]*`/g
    )
    const removedQuotes = stringsAccountedFor
        .join('^&*==') //there... might be a better way somewhere.
        .split("'")
        .join('^&*==')
        .split('^&*==')

    const final = removedQuotes.filter(val => val)
    return final
}
