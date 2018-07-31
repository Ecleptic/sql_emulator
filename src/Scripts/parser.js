import {
    getTableName,
    getIndexOfString,
    splitStrings,
    filterFromParams
} from './utilityFuncs'
let db = {
    EXAMPLETABLE1: {
        id: 1,
        users: [
            'Cameron',
            'Green',
            'Stian',
            'Bing',
            'Doctor',
            'Keith',
            'Cameron'
        ],
        places: [
            'Boston',
            'Dallas',
            'New York',
            'Seoul',
            'Shanghai',
            'Tokyo',
            'Boston'
        ],
        DataTypes: {
            users: 'STRING',
            places: 'STRING'
        }
    }
}

const tokenList = [
    'ALTER',
    'CREATE',
    'DELETE',
    'DROP',
    'INSERT',
    'SELECT',
    'UPDATE'
]
const KEYWORDS = [
    'ALTER',
    'DELETE FROM',
    'FROM',
    'GROUP BY',
    'HAVING',
    'INNER JOIN',
    'INSERT INTO',
    'JOIN',
    'LEFT JOIN',
    'LIMIT',
    'ORDER BY',
    'RIGHT JOIN',
    'SELECT',
    'SET',
    'UPDATE',
    'VALUES',
    'WHERE'
]

export default function parse(input) {
    // only parse the first command for now.
    const firstInput = input.split(';')

    const query = splitStrings(firstInput[0])

    console.log(
        '%cQuery:',
        'background: #222; color: #deaeae; font-size:1rem;',
        query
    )
    if (tokenList.includes(query[0].toUpperCase())) {
        // console.log('First Word:', query[0].toUpperCase())
        switch (query[0].toUpperCase()) {
            case 'CREATE':
                createTable(query)
                break
            case 'DELETE':
                deleteTable(query)
                break
            case 'DROP':
                dropTable(query)
                break
            case 'INSERT':
                insertTable(query)
                break
            case 'SELECT':
                getTable(query)
                break
            case 'TRUNCATE':
                truncateTable(query)
                break
            case 'UPDATE':
                updateTable(query)
                break
            default:
                console.error('Unknown Command')
                throw 'unknown command'
                break
        }
    }
    return db
}

function deleteTable(query) {
    const unCasedTableName = getTableName(query)
    const tableName = Object.keys(db).reduce(table => {
        if (table.toLowerCase() === unCasedTableName.toLowerCase()) return table
    })
    const whereIndex = getIndexOfString('where', query)

    const spliceHere = query[whereIndex + 3]


    for (const key in db[tableName]) {
        if (
            db[tableName].hasOwnProperty(key) &&
            Array.isArray(db[tableName][key])
        ) {
            const element = db[tableName][key]
            db[tableName][key].splice(spliceHere, 1)
        }
    }
    console.log(
        '%cDB Now:',
        'background: #222; color: #bada55; font-size:1.5rem;',
        db
    )
}

function oldDeleteTable(query) {
    // DELETE FROM `TABLENAME` WHERE `CONDITION`;
    /**

    delete from EXAMPLETABLE1 where id = 1

    delete * from EXAMPLETABLE1

     */
    const unCasedTableName = getTableName(query)
    const tableName = Object.keys(db).reduce(table => {
        if (table.toLowerCase() === unCasedTableName.toLowerCase()) return table
    })
    const whereIndex = getIndexOfString('where', query)
    if (whereIndex === -1) {
        console.error("cannot find 'where' in query")
        throw "cannot find 'where' in query"
    }

    const whereToSlice = query.slice(whereIndex + 1).join(' ')
    const whereToSliceColumnName = whereToSlice.split('=')[0].trim()

    // Assuming a number
    let whereToSlicePlace = whereIndex + 3
    db[tableName][whereToSliceColumnName].splice(whereToSlicePlace, 1)

    console.log(
        '%cDB Now:',
        'background: #222; color: #bada55; font-size:1.5rem;',
        db
    )
}

function dropTable(query) {
    // DROP TABLE  `TABLENAME`;
    if (query[1].toUpperCase() !== 'TABLE') {
        throw 'error'
    }

    delete db[query[2]]
    console.log(
        '%cDB Now:',
        'background: #222; color: #bada55; font-size:1.5rem;',
        db
    )
}
function truncateTable(query) {
    // TRUNCATE TABLE  `TABLENAME`;
    if (query[1].toUpperCase() !== 'TABLE') {
        throw 'error'
    }

    db[query[2]] = {}
    console.log(
        '%cDB Now:',
        'background: #222; color: #bada55; font-size:1.5rem;',
        db
    )
}
function createTable(query) {
    if (query[1].toUpperCase() !== 'TABLE') {
        return null
        // createDB(query)
    }

    const name = query[2].toUpperCase()

    if (!db[name]) {
        db[name] = {}
        db[name].id = Object.keys(db).length
        db[name].DataTypes = {}
    } else {
        console.error("Can't create.")
    }
    if (query.length < 4) {
        return
    }
    // removing "create table <TABLENAME>"
    const dataTypesToAdd = query.slice(3)


    for (let index = 0; index < dataTypesToAdd.length; index += 2) {
        const key = dataTypesToAdd[index]
        const val = dataTypesToAdd[index + 1]

        db[name]['DataTypes'][key] = val
        db[name][key] = []
    }

    console.log(
        '%cDB Now:',
        'background: #222; color: #bada55; font-size:1.5rem;',
        db
    )
}
function updateTable(query) {
    const unCasedTableName = getTableName(query)
    const tableName = Object.keys(db).reduce(table => {
        if (table.toLowerCase() === unCasedTableName.toLowerCase()) return table
    })

    const setIndex = getIndexOfString('set', query)
    const whereIndex = getIndexOfString('where', query)

    if (whereIndex === -1) {
        console.error("cannot find 'where' in query")
        throw 'cannot find "where" in query'
    }

    const paramValues = query.slice(whereIndex + 1)
    const replacementValues = query.slice(setIndex + 1, whereIndex)

    const newTable = filterFromParams(
        paramValues,
        db[tableName.toUpperCase()],
        replacementValues
    )

    db[tableName.toUpperCase()] = newTable

    console.log(
        '%cDB Now:',
        'background: #222; color: #bada55; font-size:1.5rem;',
        db
    )
}
function insertTable(query) {
    const unCasedTableName = getTableName(query)
    const tableName = Object.keys(db).reduce(
        table =>
            table.toLowerCase() === unCasedTableName.toLowerCase()
                ? table
                : unCasedTableName
    )

    const valuesIndex = getIndexOfString('values', query)

    if (valuesIndex === -1) {
        //         const ok = `
        //         INSERT INTO Persons (PersonID='1234', LastName='Erichsen', FirstName='Ted', Address='4006 Norway Drive', City='New York');
        // `
        for (let index = 3; index < query.length; index += 3) {
            const key = query[index]
            const val = query[index + 2]
            // console.log('tablename', tableName)
            db[tableName.toUpperCase()][key].push(val)
        }
    } else {
        const keysArray = query.slice(3, valuesIndex)
        const valsArray = query.slice(valuesIndex + 1)

        // console.log(keysArray, valsArray)

        for (let index = 0; index < keysArray.length; index++) {
            const key = keysArray[index]
            const val = valsArray[index]

            db[tableName.toUpperCase()][key].push(val)
        }
    }

    console.log(
        '%cDB Now:',
        'background: #222; color: #bada55; font-size:1.5rem;',
        db
    )
}
function removeParens(input) {
    if (input[0][0] === '(') {
        input[0] = input[0].slice(1)
    }

    if (input[input.length - 1][input[input.length - 1].length - 1] === ')') {
        input[input.length - 1] = input[input.length - 1].slice(0, -1)
    }
    if (input[0][0] === "'" || input[0][0] === '"') {
        input[0] = input[0].slice(1)
    }

    if (
        input[input.length - 1][input[input.length - 1].length - 1] === '"' ||
        input[input.length - 1][input[input.length - 1].length - 1] === "'"
    ) {
        input[input.length - 1] = input[input.length - 1].slice(0, -1)
    }

    input = input.join(' ').split(', ')

    return input
}

export function getTable(input) {
    const query = splitStrings(input)
    const fromIndex = getIndexOfString('from', query)
    const whereIndex = getIndexOfString('where', query)

    let paramValues = {}
    // TODO: gotta get the params
    if (whereIndex > 1) {
        for (let param = whereIndex + 1; param < query.length - 1; param += 3) {
            const obj = {
                val: query[param + 2],
                bool: query[param + 1]
            }
            paramValues[query[param]] = obj
        }
    }

    const currentTable = query[fromIndex + 1].toUpperCase()
    let table = {}
    if (fromIndex < 2) {
        console.error('error, fromIndex < 2')
        return 'error'
    } else {
        // get all of the Table Data:

        if (db[currentTable.toUpperCase()] !== null) {
            table = db[currentTable.toUpperCase()]
        }
        if (query[1] === '*') {
            let returnedTable = {}
            // parse out ID in return
            for (let tuple in table) {
                if (table.hasOwnProperty(tuple) && tuple !== 'id') {
                    returnedTable[tuple] = table[tuple]
                }
            }

            console.log(
                '%cDB Now:',
                'background: #222; color: #bada55; font-size:1.5rem;',
                db
            )
            return returnedTable
        } else {
            let dataQueue = {}
            for (let i = 1; i < fromIndex; i++) {
                if (table[query[i].toLowerCase()] === null) {
                    console.error('error')
                    throw 'error'
                } else {
                    for (const type in table) {
                        if (type.toLowerCase() === query[i].toLowerCase()) {
                            dataQueue[type] = table[type]
                        }
                    }
                }
            }
            console.log(
                '%cDB Now:',
                'background: #222; color: #bada55; font-size:1.5rem;',
                db
            )
            return dataQueue
        }
        console.log(
            '%cDB Now:',
            'background: #222; color: #bada55; font-size:1.5rem;',
            db
        )
    }
}

function getTableInfo(item, table) {
    return table.item
}

export function getDbFromParser() {
    return db
}
