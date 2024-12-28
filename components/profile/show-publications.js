import React, { useEffect, useState } from 'react'
import { DataGrid } from '@material-ui/data-grid'
import { Button } from '@material-ui/core'
import { useSession } from 'next-auth/react'

const ShowPublications = ({ publications, setPublications, session }) => {
    const [articles, setArticles] = useState([])
    const [books, setBooks] = useState([])
    const [conferences, setConferences] = useState([])
    const [patents, setPatents] = useState([])

    // Deleting selected publications
    const deleteSelected = async (selectedPublicationIds) => {
        let new_pubs = [...publications];
        console.log("selectedPublicationIds:", selectedPublicationIds);

        // Filter out the selected publications using their publication_id
        new_pubs = new_pubs.filter((entry) => !selectedPublicationIds.includes(entry.publication_id));

        const data = {
            new_data: new_pubs, 
            email: session.user.email,
            selectedPublicationIds,  // Include the array of selected publication IDs
            session: session
        };

        // Send the delete request to the server
        let res = await fetch('/api/delete/publications', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.user?.token}`, // Optional: if using authorization
            },
            body: JSON.stringify(data),
        }).catch((err) => console.log(err));

        res = await res.json();
        console.log(res);
        setPublications(new_pubs);  // Update the local state with the filtered publications
        console.log(new_pubs);
    };

    useEffect(() => {
        let _articles = [], _books = [], _conferences = [], _patents = [];

        // Categorizing publications by type
        console.log("publications:", publications);
        publications.forEach((entry, idx) => {
            entry.id = idx; // Existing id assignment
        
            // Ensure we keep the original publication_id
            const publication_id = publications.publication_id;

            // Add the publication_id to each entry when pushing to respective arrays
            if (entry.type === 'article') {
                _articles.push({ ...entry, publication_id });
            } else if (entry.type === 'book') {
                _books.push({ ...entry, publication_id });
            } else if (entry.type === 'conference') {
                _conferences.push({ ...entry, publication_id });
            } else if (entry.type === 'patent') {
                _patents.push({ ...entry, publication_id });
            }
            console.log("entry:", entry);
        });

        setArticles(_articles)
        setConferences(_conferences)
        setBooks(_books)
        setPatents(_patents)
    }, [publications]);

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
    );
};

// Articles Component
const Articles = ({ articles, deleteSelected }) => {
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
                        deleteSelected(selectionModel); // Pass selectionModel here
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
const Books = ({ books, deleteSelected }) => {
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
                        deleteSelected(selectionModel); // Pass selectionModel here
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
const Conferences = ({ conferences, deleteSelected }) => {
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
                        deleteSelected(selectionModel); // Pass selectionModel here
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
const Patents = ({ patents, deleteSelected }) => {
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
                        deleteSelected(selectionModel); // Pass selectionModel here
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
