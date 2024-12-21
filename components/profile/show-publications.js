import React, { useEffect, useState } from 'react'
import { DataGrid } from '@material-ui/data-grid'
import { Button } from '@material-ui/core'
import { useSession } from 'next-auth/client'

const ShowPublications = ({ publications, setPublications }) => {
    const [session, loading] = useSession()

    const [articles, setArticles] = useState([])
    const [books, setBooks] = useState([])
    const [conferences, setConferences] = useState([])
    const [patents, setPatents] = useState([])
    // const [selected, setSelected] = useState([]);
    const deleteSelected = async (idArr) => {
        let new_pubs = [...publications]
        new_pubs = new_pubs.filter((entry) => !idArr.includes(entry.id))
        let data = { new_data: new_pubs, email: session.user.email }
        let res = await fetch('/api/delete/publications', {
            method: 'DELETE',
            body: JSON.stringify(data),
        }).catch((err) => console.log(err))

        res = await res.json()
        console.log(res)
        setPublications(new_pubs)
        console.log(new_pubs)
    }

    useEffect(() => {
        let _articles = [],
            _books = [],
            _conferences = [],
            _patents = []

        publications.forEach((entry, idx) => {
            entry.id = idx
            if (entry.type == 'article') _articles.push(entry)
            else if (entry.type == 'book') _books.push(entry)
            else if (entry.type == 'conference') _conferences.push(entry)
            else if (entry.type == 'patent') _patents.push(entry)
        })

        setArticles(_articles)
        setConferences(_conferences)
        setBooks(_books)
        setPatents(_patents)
    }, [publications])

    return (
        <>
            {articles.length > 0 && (
                <div style={{ marginTop: `50px`, marginBottom: `50px` }}>
                    <Articles
                        articles={articles}
                        deleteSelected={deleteSelected}
                    />
                </div>
            )}
            {books.length > 0 && (
                <div style={{ marginTop: `50px`, marginBottom: `50px` }}>
                    <Books books={books} deleteSelected={deleteSelected} />
                </div>
            )}
            {conferences.length > 0 && (
                <div style={{ marginTop: `50px`, marginBottom: `50px` }}>
                    <Conferences
                        conferences={conferences}
                        deleteSelected={deleteSelected}
                    />
                </div>
            )}
            {patents.length > 0 && (
                <div style={{ marginTop: `50px`, marginBottom: `50px` }}>
                    <Patents
                        patents={patents}
                        deleteSelected={deleteSelected}
                    />
                </div>
            )}
        </>
    )
}

const Articles = ({ articles, deleteSelected }) => {
    const [selectionModel, setSelectionModel] = React.useState([])
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },

        { field: 'title', headerName: 'Title', width: 300 },
        { field: 'authors', headerName: 'Authors', width: 300 },
        {
            field: 'journal_name',
            headerName: 'Journal Name',
            sortable: false,
            width: 250,
        },
        { field: 'year', headerName: 'Year', type: 'number', width: 130 },
        { field: 'citation_key', headerName: 'Citation Key', width: 150 },
    ]

    const rows = articles

    return (
        <>
            <h1>Articles</h1>
            {selectionModel.length > 0 && (
                <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={() => {
                        deleteSelected(selectionModel)
                        setSelectionModel([])
                    }}
                >
                    Delete Selected
                </Button>
            )}
            <div
                style={{
                    width: '95%',
                }}
            >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    pagination
                    autoHeight
                    rowsPerPageOptions={false}
                    onSelectionModelChange={(newSelection) => {
                        setSelectionModel(newSelection.selectionModel)
                    }}
                    selectionModel={selectionModel}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        </>
    )
}

const Books = ({ books, deleteSelected }) => {
    const [selectionModel, setSelectionModel] = React.useState([])
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'title', headerName: 'Title', width: 300 },
        { field: 'authors', headerName: 'Authors', width: 300 },
        {
            field: 'editors',
            headerName: 'Editors',
            sortable: false,
            width: 200,
        },
        {
            field: 'publisher',
            headerName: 'Publisher',
            sortable: false,
            width: 200,
        },
        { field: 'year', headerName: 'Year', type: 'number', width: 130 },
        { field: 'citation_key', headerName: 'Citation Key', width: 150 },
    ]
    const rows = books

    return (
        <>
            <div
                style={{
                    width: '95%',
                }}
            >
                <h1>Books</h1>
                {selectionModel.length > 0 && (
                    <Button
                        variant="contained"
                        color="secondary"
                        type="button"
                        onClick={() => {
                            deleteSelected(selectionModel)
                            setSelectionModel([])
                        }}
                    >
                        Delete Selected
                    </Button>
                )}
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    pagination
                    autoHeight
                    rowsPerPageOptions={false}
                    onSelectionModelChange={(newSelection) => {
                        setSelectionModel(newSelection.selectionModel)
                    }}
                    selectionModel={selectionModel}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        </>
    )
}

const Conferences = ({ conferences, deleteSelected }) => {
    const [selectionModel, setSelectionModel] = React.useState([])
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'title', headerName: 'Title', width: 300 },
        { field: 'authors', headerName: 'Authors', width: 300 },
        {
            field: 'booktitle',
            headerName: 'BookTitle',
            sortable: false,
            width: 250,
        },
        { field: 'year', headerName: 'Year', type: 'number', width: 130 },
        { field: 'citation_key', headerName: 'Citation Key', width: 150 },
    ]
    const rows = conferences

    return (
        <>
            <h1>Conferences</h1>
            <div
                style={{
                    width: '95%',
                }}
            >
                {selectionModel.length > 0 && (
                    <Button
                        variant="contained"
                        color="secondary"
                        type="button"
                        onClick={() => {
                            deleteSelected(selectionModel)
                            setSelectionModel([])
                        }}
                    >
                        Delete Selected
                    </Button>
                )}
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    pagination
                    autoHeight
                    rowsPerPageOptions={false}
                    onSelectionModelChange={(newSelection) => {
                        setSelectionModel(newSelection.selectionModel)
                    }}
                    selectionModel={selectionModel}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        </>
    )
}

const Patents = ({ patents, deleteSelected }) => {
    const [selectionModel, setSelectionModel] = React.useState([])
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'year', headerName: 'Year', type: 'number', width: 130 },
        {
            field: 'yearfiled',
            headerName: 'Year Filed',
            type: 'number',
            width: 180,
        },
        { field: 'nationality', headerName: 'Nationality', width: 300 },
        { field: 'number', headerName: 'Number', width: 130 },
        { field: 'citation_key', headerName: 'Citation Key', width: 150 },
    ]
    const rows = patents

    return (
        <>
            <h1>Patents</h1>
            <div
                style={{
                    width: '95%',
                }}
            >
                {selectionModel.length > 0 && (
                    <Button
                        variant="contained"
                        color="secondary"
                        type="button"
                        onClick={() => {
                            deleteSelected(selectionModel)
                            setSelectionModel([])
                        }}
                    >
                        Delete Selected
                    </Button>
                )}
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    pagination
                    autoHeight
                    rowsPerPageOptions={false}
                    onSelectionModelChange={(newSelection) => {
                        setSelectionModel(newSelection.selectionModel)
                    }}
                    selectionModel={selectionModel}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        </>
    )
}

export default ShowPublications
