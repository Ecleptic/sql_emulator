import React, { Component } from "react"

import parse from "./parser"

export class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tokens: {
                SELECT: false,
                UPDATE: false,
                DELETE: false,
                INSERT: false,
                CREATE: false,
                ALTER: false,
                DROP: false
            },
            sqlInput: "",
            sqlError: false
        }
    }
    inputUpdate = event => {
        this.setState(prevState => {
            return {
                switched: !prevState.switched
            }
        })
        let truthyToken = {
            ...this.state.tokens
        }
        const val = parse(event.target.value)
        if (val !== undefined) {
            // console.log(val)
            // console.log(truthyToken[val])
            truthyToken[val] = !truthyToken[val]
            this.setState({ tokens: truthyToken })
        } else {
            for (const i in truthyToken) {
                truthyToken[i] = false
            }
            this.setState({ tokens: truthyToken })
        }

        // this.setState({ tokens: truthyToken })
    }

    render() {
        return (
            <div>
                {this.state.sqlError && (
                    <div>
                        <h1>SQL Error:</h1>
                        <h3>More info will be added later.</h3>
                    </div>
                )}
                <textarea
                    value={this.state.sqlInput}
                    onChange={event => {
                        this.inputUpdate(event)
                        this.setState({ sqlInput: event.target.value })
                    }}
                />
                <br />
                <h3>Which key is in the beginning: </h3>
                <ul>
                    {Object.keys(this.state.tokens).map(token => {
                        return (
                            <li key={token}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={this.state.tokens[token]}
                                    />
                                    {token}
                                </label>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

export default App
