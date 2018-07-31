import React, { Component, Fragment } from 'react'
import styled from 'styled-components'

import MyTable from './MyTable'
import parse, { getDbFromParser, getTable } from '../Scripts/parser'
import { isSelect, getTableName, splitStrings } from '../Scripts/utilityFuncs'

const TextArea = styled.textarea`
    width: 600px;
    height: 200px;
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
            sqlInput: '',
            sqlError: false,
            db: {},
            viewedInfo: {}
        }
    }
    componentDidMount = () => {
        const db = getDbFromParser()
        this.setState({ db })
    }
    inputUpdate = event => {
        this.setState(prevState => {
            return {
                switched: !prevState.switched
            }
        })
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
                        <li>create table</li>
                        <li>
                            delete
                            <ul>
                                <li>- Can only delete on index in table</li>
                            </ul>
                        </li>
                        <li>drop</li>
                        <li>
                            select
                            <ul>
                                <li>- Can't add parameters yet ☹️</li>
                            </ul>
                        </li>
                        {/* <li>truncate</li> */}
                        <li>
                            update
                            <ul>
                                <li>
                                    - can't update off of multiple parameters
                                </li>
                                <li>- can't use booleans</li>
                            </ul>
                        </li>
                        <li>
                            insert
                            <ul>
                                <li>- keys are still case sensitive</li>
                            </ul>
                        </li>
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
                        this.setState({
                            viewedInfo: {}
                        })
                        try {
                            if (isSelect(this.state.sqlInput)) {
                                const data = getTable(this.state.sqlInput)
                                const table = getTableName(
                                    splitStrings(this.state.sqlInput)
                                )
                                const viewedInfo = { data, table }
                                this.setState({ viewedInfo })
                            } else {
                                const db = parse(this.state.sqlInput)
                                this.setState({ db })
                            }
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

                <div>
                    <h3>Example Commands:</h3>
                    <ul>
                        <li>
                            <pre>
                                CREATE TABLE Persons ( PersonID int, LastName
                                varchar(255), FirstName varchar(255), Address
                                varchar(255), City varchar(255) );
                            </pre>
                        </li>
                        <li>
                            <pre>
                                INSERT INTO Persons (PersonID, LastName,
                                FirstName, Address, City) VALUES (1234,
                                'Erichsen', 'Ted', '4006 Norway Drive', 'New
                                York');
                            </pre>
                        </li>
                        <li>
                            <pre>
                                INSERT INTO Persons (PersonID='1234',
                                LastName='Erichsen', FirstName='Ted',
                                Address='4006 Norway Drive', City='New York');
                            </pre>
                        </li>
                        <li>
                            <pre>
                                SELECT * from EXAMPLETABLE1 where USERS = Bing
                            </pre>
                        </li>
                        <li>
                            <pre>
                                UPDATE EXAMPLETABLE1 SET users = 'Bugs' WHERE id
                                >= 4
                            </pre>
                        </li>
                        <li>
                            <pre>
                                UPDATE EXAMPLETABLE1 SET users = 'Alfred
                                Schmidt', places = 'Frankfurt' WHERE id = 1
                            </pre>
                        </li>
                        <li>
                            <pre>
                                UPDATE EXAMPLETABLE1 SET users = 'Bugs Bunny ',
                                places = 'Albuquerque' WHERE users = 'Doctor'
                            </pre>
                        </li>
                        <li>
                            <pre>delete from exampletable1 where id = 1</pre>
                        </li>
                    </ul>
                </div>
            </Container>
        )
    }
}
