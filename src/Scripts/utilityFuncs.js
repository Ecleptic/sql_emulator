'use-strict'

export function getTableName(query) {
    const fromPlace = query
        .join(' ')
        .toUpperCase()
        .split(' ')
        .indexOf('FROM')
    console.log(fromPlace)
    const tableName = fromPlace !== -1 ? query[fromPlace + 1] : query[1]
    return tableName
}

export function getIndexOfString(string, query) {
    let place = -1
    const capsQuery = query.map(str => str.toUpperCase())
    place = capsQuery.indexOf(string.toUpperCase())

    return place
}

export function splitStrings(input) {
    const equalsAccountedFor = input.split('=').join(' = ')
    const commaAccountedFor = equalsAccountedFor.split(',').join(' ')
    const newlineAccountedFor = commaAccountedFor.split(/\n/).join(' ')
    const varcharAccountedFor = newlineAccountedFor
        .split(' ')
        .reduce((obj, item) => {
            if (item.length > 0) {
                if (item.includes('varchar')) {
                    item = '"' + item + '"'
                }
                obj = obj +" "+ item
            }
            return obj
        }, '')

    const stringsAccountedFor = varcharAccountedFor.match(
        /\w+|"[^"]*"|=|\*|'[^']*'|`[^`]*`/g
    )

    const removedQuotes = stringsAccountedFor
        .join('^&*==') // there... might be a better way somewhere.
        .split("'")
        .join('^&*==')
        .split('"')
        .join('^&*==')
        .split('^&*==')

    const final = removedQuotes.filter(val => val)
    return final
}

export function isSelect(input) {
    const split = splitStrings(input)
    const index = getIndexOfString('select', split)
    if (index === 0) {
        return true
    }
    return false
}
