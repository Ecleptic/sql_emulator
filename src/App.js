import React, { Component, Fragment } from 'react'

import MyTable from './MyTable'
import parse from './parser'

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tokens: {
                CREATE: false,
                DELETE: false,
                DROP: false,
                INSERT: false,
                SELECT: false,
                UPDATE: false
            },
            sqlInput: '',
            sqlError: false,
            db: {},
            viewedInfo: {}
        }
    }
    componentDidMount = () => {
        const db = parse('CREATE TABLE hello;')
        this.setState({ db })
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
                <button
                    onClick={() => {
                        const db = parse(this.state.sqlInput)
                        this.setState({ db })
                    }}
                >
                    Run
                </button>
                <br />
                <h3>TABLES:</h3>
                <ul>
                    {Object.keys(this.state.db).map(table => {
                        return (
                            <li key={table}>
                                <button
                                    onClick={() => {
                                        const viewedInfo = {
                                            data: this.state.db[table],
                                            table
                                        }
                                        this.setState({ viewedInfo })
                                    }}
                                >
                                    {table}
                                </button>
                            </li>
                        )
                    })}
                </ul>
                {this.state.viewedInfo.table ? (
                    <Fragment>
                        <h4>Table Name: {this.state.viewedInfo.table}</h4>
                        <MyTable data={this.state.viewedInfo.data} />
                    </Fragment>
                ) : null}
            </div>
        )
    }
}
