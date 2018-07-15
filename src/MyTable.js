import React from 'react'

const MyTable = ({ data }) => {
    this.createHaders = () => {
        let tableNames = []

        Object.keys(data).forEach((key, index) => {
            if (key !== 'id' && key !== 'DataTypes') {
                // tableItems.push(data[key])
                tableNames.push(<th key={index}>{key.toUpperCase()}</th>)
            }
        })
        return tableNames
    }

    this.createTable = () => {
        let table = []

        let tableNames = []
        let tableItems = []

        Object.keys(data).forEach((key, index) => {
            if (key !== 'id' && key !== 'DataTypes') {
                tableItems.push(data[key])
                tableNames.push(key)
            }
        })
        console.log(tableItems)
        if (!tableItems[0]) return null
        // Outer loop to create parent
        for (let i = 0; i < tableItems[0].length; i++) {
            let children = []
            //Inner loop to create children
            for (let j = 0; j < tableNames.length; j++) {
                // console.log(`Table ${tableItems[j][i]}`)
                // children.push(<td key={j}>{`Column ${j + 1}`}</td>)
                children.push(<td key={`${j}${i}`}>{`${tableItems[j][i]}`}</td>)
            }
            //Create the parent and add the children
            table.push(<tr key={`${i}`}>{children}</tr>)
        }
        return table
    }

    if (data) {
        return (
            <table>
                <tbody>
                    <tr>{this.createHaders()}</tr>
                    {this.createTable()}
                </tbody>
            </table>
        )
    } else {
        return null
    }
}

export default MyTable
