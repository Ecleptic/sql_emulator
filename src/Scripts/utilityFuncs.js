'use-strict'

export function getTableName(query) {
    const fromIndex = getIndexOfString('from', query)
    const intoIndex = getIndexOfString('into', query)

    const tableName =
        fromIndex !== -1 // if not negative 1, it exists
            ? query[fromIndex + 1]
            : intoIndex !== -1 // if not negative 1, it exists
                ? query[intoIndex + 1]
                : query[1]

    return tableName
}

export function getIndexOfString(string, query) {
    let place = -1
    const capsQuery = query.map(str => str.toUpperCase())
    place = capsQuery.indexOf(string.toUpperCase())

    return place
}

export function splitStrings(input) {
    const equalsAccountedFor = input.replace(/(<=) |(>=) |=/g, ' $& ')
    const commaAccountedFor = equalsAccountedFor.split(',').join(' ')
    const newlineAccountedFor = commaAccountedFor.split(/\n/).join(' ')
    const varcharAccountedFor = newlineAccountedFor
        .split(' ')
        .reduce((obj, item) => {
            if (item.length > 0) {
                if (item.includes('varchar')) {
                    item = '"' + item + '"'
                }
                obj = obj + ' ' + item
            }
            return obj
        }, '')

    const stringsAccountedFor = varcharAccountedFor.match(
        /\w+|"[^"]*"|=|>=|<=|<|>|\*|'[^']*'|`[^`]*`/g
    )

    const removedQuotes = stringsAccountedFor
        .join('^&*==') // there... might be a better way somewhere.
        .split("'")
        .join('^&*==')
        .split('"')
        .join('^&*==')
        .split('^&*==')

    const final = removedQuotes.filter(val => val)
    return final.map(s => s.trim())
}

export function isSelect(input) {
    const split = splitStrings(input)
    const index = getIndexOfString('select', split)
    if (index === 0) {
        return true
    }
    return false
}

/**
 * take the parameters, and table data, filter it so it only returns what is in the params.
 *  ex: if id = 0, return only things with the index/ id of 0
 * @param {array} params object holding the parameters
 * @param {object} table full table object
 * @returns {object}
 */
export function filterFromParams(params, table, replacement) {
    let newTable = objectClone(table)

    for (const key in newTable) {
        if (key === params[0]) {
            const index =
                params[0].toLowerCase() === 'id' ||
                params[0].toLowerCase() === 'index'
                    ? params[2]
                    : getAllIndexes(params[2], newTable[key])

            // console.log(index)
            // console.log(typeof(index))
            if (typeof index === 'object')
                for (
                    let indexArray = 0;
                    indexArray < index.length;
                    indexArray++
                ) {
                    const indexElement = index[indexArray]

                    if (params[1] === '=') {
                        for (let j = 0; j < replacement.length; j += 3) {
                            newTable[replacement[j]][indexElement] =
                                replacement[j + 2]
                        }
                    } else if (params[1] === '<') {
                    } else if (params[1] === '<=') {
                    } else if (params[1] === '>') {
                    } else if (params[1] === '>=') {
                    }
                }
            if (params[1] === '=') {
                for (let j = 0; j < replacement.length; j += 3) {
                    newTable[replacement[j]][index] = replacement[j + 2]
                }
            } else if (params[1] === '<') {
                for (let j = 0; j < replacement.length; j += 3) {
                    for (let k = 0; k < index; k++) {
                        newTable[replacement[j]][k] = replacement[j + 2]
                    }
                }
            } else if (params[1] === '<=') {
                for (let j = 0; j < replacement.length; j += 3) {
                    for (let k = 0; k <= index; k++) {
                        newTable[replacement[j]][k] = replacement[j + 2]
                    }
                }
            } else if (params[1] === '>') {
                for (let j = 0; j < replacement.length; j += 3) {
                    for (
                        let k = newTable[replacement[j]].length - 1;
                        k > index;
                        k--
                    ) {
                        newTable[replacement[j]][k] = replacement[j + 2]
                    }
                }
            } else if (params[1] === '>=') {
                for (let j = 0; j < replacement.length; j += 3) {
                    for (
                        let k = newTable[replacement[j]].length - 1;
                        k >= index;
                        k--
                    ) {
                        newTable[replacement[j]][k] = replacement[j + 2]
                    }
                }
            }
        }
    }
    return newTable
}

export function objectClone(obj) {
    if (obj === null || typeof obj != 'object') return obj

    let temp = new obj.constructor()
    for (let key in obj) temp[key] = objectClone(obj[key])

    return temp
}

export function getAllIndexes(val, arr) {
    let indexes = []
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].toLowerCase() === val.toLowerCase()) {
            indexes.push(i)
        }
    }
    return indexes
}
