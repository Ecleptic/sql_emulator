const testInput = "select * from table"
let db = {}
const idealData = {
    tableName: [
        { id: 1, name: "data1" },
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

export default function parse(input) {
    const query = input.toLowerCase().split(" ")
    if (tokenList.includes(query[0].toUpperCase())) {
        return query[0].toUpperCase()
    }
}
// parse(testInput)
