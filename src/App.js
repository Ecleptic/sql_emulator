import React, { Component, Fragment } from 'react'
import styled from 'styled-components'

import MyTable from './MyTable'
import parse from './parser'

const TextArea = styled.textarea`
    /* display: flex; */
    width: 600px;
    height: 200px;
    /* justify-self: center;
    align-self: center; */
    font-size: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 3rem;
    display: inline-block;
`

const SubmitButton = styled.button`
    margin: 1rem;
    border: 1px solid #cccccc;
    border-color: #0293f8;
    color: #ffffff;
    background-color: #0293f8;
    padding: 20px;

    &:hover {
        background: rgba(1, 42, 71, 0.8);
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2),
            0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
`

const ErrorHeader = styled.h1`
    color: red;
`

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
            <Container>
                {this.state.sqlError && (
                    <div>
                        <ErrorHeader>SQL Error</ErrorHeader>
                    </div>
                )}
                <div>
                    <h3>Currently Supported Commands:</h3>
                    <ul>
                        <li>create</li>
                        <li>delete</li>
                        <li>drop</li>
                        <li>select</li>
                        <li>truncate</li>
                        <li>update</li>
                        <li>insert</li>
                    </ul>
                </div>
                <TextArea
                    value={this.state.sqlInput}
                    onChange={event => {
                        this.inputUpdate(event)
                        this.setState({ sqlInput: event.target.value })
                    }}
                />
                <SubmitButton
                    onClick={() => {
                        try {
                            const db = parse(this.state.sqlInput)
                            this.setState({ db })
                        } catch (error) {
                            this.setState({ sqlError: true })
                        }
                    }}
                >
                    Run
                </SubmitButton>
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
            </Container>
        )
    }
}
