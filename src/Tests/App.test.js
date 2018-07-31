import React from 'react'
import ReactDOM from 'react-dom'
import App from '../Components/App'
import {
    getIndexOfString,
    splitStrings,
    filterFromParams
} from '../Scripts/utilityFuncs'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<App />, div)
    ReactDOM.unmountComponentAtNode(div)
})

const query = [
    'UPDATE',
    'Customers',
    'SET',
    'ContactName',
    '=',
    "'Alfred",
    "Schmidt',",
    'City=',
    "'Frankfurt'",
    'WHERE',
    'CustomerID',
    '=',
    '1'
]

describe('string index', () => {
    test('getSet', () => {
        expect(getIndexOfString('set', query)).toEqual(2)
        expect(getIndexOfString('SET', query)).toEqual(2)
        expect(getIndexOfString('Set', query)).toEqual(2)
    })
    test('getwhere', () => {
        expect(getIndexOfString('where', query)).toEqual(9)
        expect(getIndexOfString('WHERE', query)).toEqual(9)
        expect(getIndexOfString('wHeRe', query)).toEqual(9)
    })
    test('shouldFail', () => {
        expect(getIndexOfString('weer', query)).toEqual(-1)
        expect(getIndexOfString('--', query)).toEqual(-1)
        expect(getIndexOfString('city', query)).toEqual(-1)
    })
})

describe('correctly parse strings', () => {
    test('correctly parse update', () => {
        expect(
            splitStrings(`UPDATE Customers
SET ContactName = 'Alfred Schmidt', City= 'Frankfurt'
WHERE CustomerID = 1
`)
        ).toEqual([
            'UPDATE',
            'Customers',
            'SET',
            'ContactName',
            '=',
            'Alfred Schmidt',
            'City',
            '=',
            'Frankfurt',
            'WHERE',
            'CustomerID',
            '=',
            '1'
        ])

        expect(
            splitStrings(
                `UPDATE EXAMPLETABLE1 SET users = 'Bugs' WHERE id >= 4`
            )
        ).toEqual([
            'UPDATE',
            'EXAMPLETABLE1',
            'SET',
            'users',
            '=',
            'Bugs',
            'WHERE',
            'id',
            '>=',
            '4'
        ])

        expect(
            splitStrings(`UPDATE Customers
SET ContactName='Juan'
WHERE Country='Mexico'`)
        ).toEqual([
            'UPDATE',
            'Customers',
            'SET',
            'ContactName',
            '=',
            'Juan',
            'WHERE',
            'Country',
            '=',
            'Mexico'
        ])
        expect(splitStrings(`select * from *`)).toEqual([
            'select',
            '*',
            'from',
            '*'
        ])
        expect(
            splitStrings(`UPDATE Customers
    SET ContactName='Juan'`)
        ).toEqual(['UPDATE', 'Customers', 'SET', 'ContactName', '=', 'Juan'])
        expect(
            splitStrings(
                `SELECT column1, column2 FROM table_name WHERE condition1 AND condition2 AND condition3`
            )
        ).toEqual([
            'SELECT',
            'column1',
            'column2',
            'FROM',
            'table_name',
            'WHERE',
            'condition1',
            'AND',
            'condition2',
            'AND',
            'condition3'
        ])
        expect(
            splitStrings(`CREATE TABLE Persons (
        PersonID int,
        LastName varchar(255),
        FirstName varchar(255),
        Address varchar(255),
        City varchar(255)
    )`)
        ).toEqual([
            'CREATE',
            'TABLE',
            'Persons',
            'PersonID',
            'int',
            'LastName',
            'varchar(255)',
            'FirstName',
            'varchar(255)',
            'Address',
            'varchar(255)',
            'City',
            'varchar(255)'
        ])
        expect(
            splitStrings(`UPDATE EXAMPLETABLE1 SET users = 'Bugs Bunny ', places = '     Albuquerque' WHERE users = 'Doctor'
`)
        ).toEqual([
            'UPDATE',
            'EXAMPLETABLE1',
            'SET',
            'users',
            '=',
            'Bugs Bunny',
            'places',
            '=',
            'Albuquerque',
            'WHERE',
            'users',
            '=',
            'Doctor'
        ])
    })
})

describe('correctly Filter values from parameters', () => {
    const table = {
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
    const table1 = {
        id: 1,
        users: [
            'Cameron',
            'Green',
            'Stian',
            'Bing',
            'Bugs Bunny',
            'Keith',
            'Cameron'
        ],
        places: [
            'Boston',
            'Dallas',
            'New York',
            'Seoul',
            'Albuquerque',
            'Tokyo',
            'Boston'
        ],
        DataTypes: {
            users: 'STRING',
            places: 'STRING'
        }
    }
    const table2 = {
        id: 1,
        users: [
            'Cameron',
            'hello',
            'Stian',
            'Bing',
            'Doctor',
            'Keith',
            'Cameron'
        ],
        places: [
            'Boston',
            'world',
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
    const table3 = {
        id: 1,
        users: [
            'Bugs Bunny',
            'Green',
            'Stian',
            'Bing',
            'Doctor',
            'Keith',
            'Bugs Bunny'
        ],
        places: [
            'Albuquerque',
            'Dallas',
            'New York',
            'Seoul',
            'Shanghai',
            'Tokyo',
            'Albuquerque'
        ],
        DataTypes: {
            users: 'STRING',
            places: 'STRING'
        }
    }
    const table4 = {
        id: 1,
        users: ['Bugs', 'Bugs', 'Bugs', 'Bugs', 'Doctor', 'Keith', 'Cameron'],
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
    const table5 = {
        id: 1,
        users: ['Bugs', 'Bugs', 'Bugs', 'Bugs', 'Bugs', 'Keith', 'Cameron'],
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
    const table6 = {
        id: 1,
        users: ['Cameron', 'Green', 'Stian', 'Bing', 'Doctor', 'Bugs', 'Bugs'],
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
    const table7 = {
        id: 1,
        users: ['Cameron', 'Green', 'Stian', 'Bing', 'Bugs', 'Bugs', 'Bugs'],
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

    test('will return id/index correctly', () => {
        expect(
            filterFromParams(['id', '=', '1'], table, [
                'users',
                '=',
                'hello',
                'places',
                '=',
                'world'
            ])
        ).toEqual(table2)
    })
    test('will return users/object names correctly', () => {
        expect(
            filterFromParams(['users', '=', 'Doctor'], table, [
                'users',
                '=',
                'Bugs Bunny',
                'places',
                '=',
                'Albuquerque'
            ])
        ).toEqual(table1)
        expect(
            JSON.stringify(
                filterFromParams(['users', '=', 'Cameron'], table, [
                    'users',
                    '=',
                    'Bugs Bunny',
                    'places',
                    '=',
                    'Albuquerque'
                ])
            )
        ).toEqual(JSON.stringify(table3))

        expect(
            filterFromParams(['id', '<', '4'], table, ['users', '=', 'Bugs'])
        ).toEqual(table4)
        expect(
            filterFromParams(['id', '<=', '4'], table, ['users', '=', 'Bugs'])
        ).toEqual(table5)
        expect(
            filterFromParams(['id', '>', '4'], table, ['users', '=', 'Bugs'])
        ).toEqual(table6)
        expect(
            filterFromParams(['id', '>=', '4'], table, ['users', '=', 'Bugs'])
        ).toEqual(table7)
    })
})
