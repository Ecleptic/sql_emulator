
let db = {
    TABLE1: {
        id: 1,
        users: ['Cameron', 'Green', 'Stian', 'Bing', 'Doctor', 'Keith'],
        places: ['Boston', 'Dallas', 'New York', 'Seoul', 'Shanghai', 'Tokyo'],
        DataTypes: { users: 'STRING', places: 'STRING' }
    },
    DATA2: { id: 2, DataTypes: {} },
    DATA3: { id: 3, DataTypes: {} },
    DATA1: {
        id: 5,
        users: [
            'Cameron',
            'Green',
            'Stian',
            'Cronje',
            'Bing',
            'Doctor',
            'Keith'
        ],
        DataTypes: {}
    },
    DATA4: { id: 4 }
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
    const query = firstInput[0].split(' ').filter(val => val)

    console.log(
        '%cQuery:',
        'background: #222; color: #deaeae; font-size:1rem;',
        query
    )
    if (tokenList.includes(query[0].toUpperCase())) {
        console.log('First Word:', query[0].toUpperCase())
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
                console.error('not select')
                break
        }
    }
    return db
}
function deleteTable(query) {
    // DELETE FROM `TABLENAME` WHERE `CONDITION`;
    const tableName = getTableName(query)
    const wherePlace = query.indexOf('WHERE')
    const sliced = query.slice(3, wherePlace).join(' ')

    const whereToSlice = query.slice(wherePlace + 1).join(' ')
    const whereToSliceColumnName = whereToSlice.split('=')[0].trim()

    // Assuming a number
    let whereToSlicePlace = db[tableName][whereToSliceColumnName].indexOf(
        whereToSlice
            .split('=')[1]
            .replace(/'/gm, '')
            .trim()
    )

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
function getTable(query) {
    const final = query
        .join(' ')
        .toUpperCase()
        .split(' ')
        .indexOf('FROM')

    const currentTable = query[final + 1]
    let table = {}
    console.log(final)
    if (final < 2) {
        console.error('error, final < 2')
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
                // console.log(tuple)
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
            for (let i = 1; i < final; i++) {
                query[i] = query[i].replace(/[^\w\\\-]+/g, '')
                if (table[query[i].toLowerCase()] === null) {
                    console.error('error')
                    return 'error'
                } else {
                    dataQueue[query[i]] = table[query[i].toLowerCase()]
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
function getTableName(query) {
    const fromPlace = query
        .join(' ')
        .toUpperCase()
        .split(' ')
        .indexOf('FROM')
    const tableName = fromPlace !== -1 ? query[fromPlace + 1] : query[1]
    return tableName
}
function createTable(query) {
    if (query[1].toUpperCase() !== 'TABLE') {
        return null
        // createDB(query)
    }
    const prompt = `
    CREATE TABLE Persons (
        PersonID int,
        LastName varchar(255),
        FirstName varchar(255),
        Address varchar(255),
        City varchar(255)
    );
`
    const name = query[2].toUpperCase()

    // const name = newTableName.toUpperCase()
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
    const dataTypesToAdd = query
        .slice(3)
        .join(' ')
        .split(',')

    // remove leading and trailing parenthesis.
    dataTypesToAdd[0] = dataTypesToAdd[0].slice(1)
    dataTypesToAdd[dataTypesToAdd.length - 1] = dataTypesToAdd[
        dataTypesToAdd.length - 1
    ].slice(0, -1)

    // console.log('dataTypesToAdd', dataTypesToAdd)

    dataTypesToAdd.forEach(element => {
        const values = element.split(' ').filter(val => val)
        const dataParam = values[0]
        const type = values[1]

        db[name]['DataTypes'][dataParam] = type
        db[name][dataParam] = []
    })

    console.log(
        '%cDB Now:',
        'background: #222; color: #bada55; font-size:1.5rem;',
        db
    )
}
function updateTable(query) {
    // "UPDATE TABLE1 SET users = 'Alfred Schmidt', places = 'Frankfurt' WHERE id = 1;"
    // console.log('update', query)
    const tableName = getTableName(query)
    const wherePlace = query.indexOf('WHERE')
    const sliced = query.slice(3, wherePlace).join(' ')

    const whereToSlice = query.slice(wherePlace + 1).join(' ')
    const whereToSliceColumnName = whereToSlice.split('=')[0].trim()

    // Assuming a number
    let whereToSlicePlace = whereToSlice
        .split('=')[1]
        .replace(/'/gm, '')
        .trim()

    sliced.split(',').forEach(element => {
        const column = element
            .split('=')[0]
            .trim()
            .toLowerCase()
        const replacement = element
            .split('=')[1]
            .replace(/'/gm, '')
            .trim()
        if (isNaN(whereToSlicePlace)) {
            whereToSlicePlace = db[tableName][whereToSliceColumnName].indexOf(
                whereToSlicePlace
            )
        }
        db[tableName][column][whereToSlicePlace] = replacement
    })

    console.log(
        '%cDB Now:',
        'background: #222; color: #bada55; font-size:1.5rem;',
        db
    )
}
