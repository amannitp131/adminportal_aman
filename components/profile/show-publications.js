import React, { useEffect, useState } from 'react'
import { DataGrid } from '@material-ui/data-grid'
import { Button } from '@material-ui/core'
import { useSession } from 'next-auth/react'

const ShowPublications = ({ publications, setPublications, session }) => {
    const [articles, setArticles] = useState([])
    const [books, setBooks] = useState([])
    const [conferences, setConferences] = useState([])
    const [patents, setPatents] = useState([])
    const deleteSelected = async (idArr ,session) => {
        let new_pubs = [...publications];
        new_pubs = new_pubs.filter((entry) => !idArr.includes(entry.id));
        let data = { new_data: new_pubs, email: session.user.email, session: session };
    
        try {
            let res = await fetch('/api/update/publications', {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(data),
            });
    
            // Check if the response is OK (status 2xx)
            if (!res.ok) {
                throw new Error(`Error: ${res.status} - ${res.statusText}`);
            }
    
            // Check if response has body and parse as JSON
            const responseBody = await res.text();
            const responseJson = responseBody ? JSON.parse(responseBody) : {};
            
            console.log(responseJson);
    
            setPublications(new_pubs);
        } catch (err) {
            console.error('Error:', err);
        }
    };
    

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
                        session={session}
                    />
                </div>
            )}
            {books.length > 0 && (
                <div style={{ marginTop: `50px`, marginBottom: `50px` }}>
                    <Books books={books} deleteSelected={deleteSelected} session={session}/>
                </div>
            )}
            {conferences.length > 0 && (
                <div style={{ marginTop: `50px`, marginBottom: `50px` }}>
                    <Conferences
                        conferences={conferences}
                        deleteSelected={deleteSelected}
                        session={session}
                    />
                </div>
            )}
            {patents.length > 0 && (
                <div style={{ marginTop: `50px`, marginBottom: `50px` }}>
                    <Patents
                        patents={patents}
                        deleteSelected={deleteSelected}
                        session={session}
                    />
                </div>
            )}
        </>
    );
};

// Articles Component
const Articles = ({ articles, deleteSelected,session }) => {
    const [selectionModel, setSelectionModel] = React.useState([]);
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'title', headerName: 'Title', width: 300 },
        { field: 'authors', headerName: 'Authors', width: 300 },
        { field: 'journal_name', headerName: 'Journal Name', width: 250 },
        { field: 'year', headerName: 'Year', type: 'number', width: 130 },
        { field: 'citation_key', headerName: 'Citation Key', width: 150 },
    ];
    const rows = articles;

    return (
        <>
            <h1>Articles</h1>
            {selectionModel.length > 0 && (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        deleteSelected(selectionModel, session); // Pass selectionModel here
                        setSelectionModel([]); // Clear the selection
                    }}
                >
                    Delete Selected
                </Button>
            )}
            <div style={{ width: '95%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    pagination
                    autoHeight
                    rowsPerPageOptions={false}
                    onSelectionModelChange={(newSelection) => {
                        setSelectionModel(newSelection.selectionModel);
                    }}
                    selectionModel={selectionModel}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        </>
    );
};

// Books Component
const Books = ({ books, deleteSelected,session }) => {
    const [selectionModel, setSelectionModel] = React.useState([]);
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'title', headerName: 'Title', width: 300 },
        { field: 'authors', headerName: 'Authors', width: 300 },
        { field: 'editors', headerName: 'Editors', width: 200 },
        { field: 'publisher', headerName: 'Publisher', width: 200 },
        { field: 'year', headerName: 'Year', type: 'number', width: 130 },
        { field: 'citation_key', headerName: 'Citation Key', width: 150 },
    ];
    const rows = books;

    return (
        <>
            <h1>Books</h1>
            {selectionModel.length > 0 && (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        deleteSelected(selectionModel, session); // Pass selectionModel here
                        setSelectionModel([]); // Clear the selection
                    }}
                >
                    Delete Selected
                </Button>
            )}
            <div style={{ width: '95%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    pagination
                    autoHeight
                    rowsPerPageOptions={false}
                    onSelectionModelChange={(newSelection) => {
                        setSelectionModel(newSelection.selectionModel);
                    }}
                    selectionModel={selectionModel}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        </>
    );
};

// Conferences Component
const Conferences = ({ conferences, deleteSelected,session }) => {
    const [selectionModel, setSelectionModel] = React.useState([]);
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'title', headerName: 'Title', width: 300 },
        { field: 'authors', headerName: 'Authors', width: 300 },
        { field: 'booktitle', headerName: 'Book Title', width: 250 },
        { field: 'year', headerName: 'Year', type: 'number', width: 130 },
        { field: 'citation_key', headerName: 'Citation Key', width: 150 },
    ];
    const rows = conferences;

    return (
        <>
            <h1>Conferences</h1>
            {selectionModel.length > 0 && (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        deleteSelected(selectionModel, session); // Pass selectionModel here
                        setSelectionModel([]); // Clear the selection
                    }}
                >
                    Delete Selected
                </Button>
            )}
            <div style={{ width: '95%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    pagination
                    autoHeight
                    rowsPerPageOptions={false}
                    onSelectionModelChange={(newSelection) => {
                        setSelectionModel(newSelection.selectionModel);
                    }}
                    selectionModel={selectionModel}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        </>
    );
};

// Patents Component
const Patents = ({ patents, deleteSelected ,session}) => {
    const [selectionModel, setSelectionModel] = React.useState([]);
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'year', headerName: 'Year', type: 'number', width: 130 },
        { field: 'yearfiled', headerName: 'Year Filed', type: 'number', width: 180 },
        { field: 'nationality', headerName: 'Nationality', width: 300 },
        { field: 'number', headerName: 'Number', width: 130 },
        { field: 'citation_key', headerName: 'Citation Key', width: 150 },
        {field:'publication_id', headerName:'Publication ID', width: 150}
    ];
    const rows = patents;

    return (
        <>
            <h1>Patents</h1>
            {selectionModel.length > 0 && (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        deleteSelected(selectionModel, session); // Pass selectionModel here
                        setSelectionModel([]); // Clear the selection
                    }}
                >
                    Delete Selected
                </Button>
            )}
            <div style={{ width: '95%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    pagination
                    autoHeight
                    rowsPerPageOptions={false}
                    onSelectionModelChange={(newSelection) => {
                        setSelectionModel(newSelection.selectionModel);
                    }}
                    selectionModel={selectionModel}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        </>
    );
};

export default ShowPublications;
