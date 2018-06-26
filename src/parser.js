const testInput1 = "select * from data1"
const testInput2 = "select users from data1"
let db = {}
const idealData = {
    tablesList: [
        {
            id: 1,
            name: "data1",
            users: ["Cameron", "Green", "Stian", "Bing", "Doctor", "Keith"]
        },
        { id: 2, name: "data2" },
        { id: 3, name: "data3" },
        { id: 4, name: "data4" }
    ]
}
const tokenList = [
    "SELECT",
    "UPDATE",
    "DELETE",
    "INSERT",
    "CREATE",
    "ALTER",
    "CREATE",
    "ALTER",
    "DROP",
    "CREATE",
    "DROP"
]
// stuff = [
//     "SELECT",
//     "FROM",
//     "DELETE FROM",
//     "INSERT INTO",
//     "UPDATE",
//     "JOIN",
//     "LEFT JOIN",
//     "RIGHT JOIN",
//     "INNER JOIN",
//     "ORDER BY",
//     "GROUP BY",
//     "HAVING",
//     "WHERE",
//     "LIMIT",
//     "VALUES",
//     "SET"
// ]

// export default function parse(input) {
//     const query = input.toLowerCase().split(" ")
//     if (tokenList.includes(query[0].toUpperCase())) {
//         return query[0].toUpperCase()
//     }
// }
// parse(testInput)

function a(input) {
    // only parse the first command for now.
    const firstInput = input.toUpperCase().split(";")
    const query = firstInput[0].split(" ")
    console.log("QUERY:", query)
    if (tokenList.includes(query[0]))
        switch (query[0].toUpperCase()) {
            case "SELECT":
                // console.log("SELECT!!!")
                getTable(query)
                break
            default:
                console.log("not select")
        }
}

function getTable(query) {
    const final = query.indexOf("FROM")
    const currentTable = final + 1
    let table = console.log(final)
    if (final < 2) {
        console.error("error")
        return "error"
    } else {
        // get all of the Table Data:
        table = idealData.tablesList.filter(arr => {
            return arr.name.toUpperCase() === query[currentTable]
        })
    }
    if (query[1] === "*") {
        console.log("return *:", ...table)
        return table[0]
    } else {
        console.log("else")
        let dataQueue = []
        for (let i = 1; i < final; i++) {
            console.log("returning:",query[i].toLowerCase())
            dataQueue.push(table[0][query[i].toLowerCase()])
        }
        console.log(...dataQueue)
    }
}
function getTableInfo(item, table) {
    return table.item
}

a(testInput1)
a(testInput2)
