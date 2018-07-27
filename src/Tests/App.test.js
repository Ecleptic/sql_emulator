import React from 'react'
import ReactDOM from 'react-dom'
import App from '../Components/App'
import { getIndexOfString, splitStrings } from '../Scripts/utilityFuncs'

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
    })
})
