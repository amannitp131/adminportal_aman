import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import { useSession } from 'next-auth/client'
import React, { useEffect, useState } from 'react'
import useRefreshData from '@/custom-hooks/refresh'

export const AddPublications = ({ handleClose, modal, published }) => {
    const [session, loading] = useSession()
    const refreshData = useRefreshData(false)
    const initialState = {}
    const [content, setContent] = useState(initialState)
    const [submitting, setSubmitting] = useState(false)
    const [type, setType] = useState('')

    const handleSubmit = async (e) => {
        setSubmitting(true)
        e.preventDefault()
        let new_data = []

        if (published.length) {
            new_data = [...published, { ...content }]
        } else {
            new_data = [{ ...content }]
        }
        let data = {
            data: new_data,
            email: session.user.email,
        }

        console.log(new_data)

        let result = await fetch('/api/create/publications', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(data),
        })
        result = await result.json()
        if (result instanceof Error) {
            console.log('Error Occured')
            // console.log(result)
        }
        // console.log(result)
        handleClose()
        refreshData()
        setSubmitting(false)
        setContent(initialState)
    }

    return (
        <>
            <Dialog open={modal} onClose={handleClose}>
                <DialogTitle disableTypography style={{ fontSize: `2rem` }}>
                    Add Your Publications
                </DialogTitle>

                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <FormControl
                            style={{ margin: `10px auto`, width: `100%` }}
                        >
                            <InputLabel id="demo-simple-select-label">
                                Type of Publication
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                fullWidth
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <MenuItem value={'article'}>Article</MenuItem>
                                <MenuItem value={'book'}>Book</MenuItem>
                                <MenuItem value={'conference'}>
                                    Conference\Proceedings\Inproceedings
                                </MenuItem>
                                <MenuItem value={'patent'}>Patent</MenuItem>
                            </Select>
                        </FormControl>

                        {type == 'article' && (
                            <Article
                                content={content}
                                setContent={setContent}
                            />
                        )}
                        {type == 'patent' && (
                            <Patent content={content} setContent={setContent} />
                        )}
                        {type == 'book' && (
                            <Book content={content} setContent={setContent} />
                        )}
                        {type == 'conference' && (
                            <Conference
                                content={content}
                                setContent={setContent}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            type="submit"
                            color="primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting' : 'Submit'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

const Article = ({ content, setContent }) => {
    useEffect(() => {
        setContent({
            type: 'article',
            title: '',
            authors: '',
            journal_name: '',
            year: '',
            citation_key: '',
        })
    }, [])

    const handleChange = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value })
    }

    return (
        <>
            {['title', 'authors', 'journal_name', 'year', 'citation_key'].map(
                (field, key) => {
                    return (
                        <React.Fragment key={key}>
                            <TextField
                                margin="dense"
                                label={
                                    field.charAt(0).toUpperCase() +
                                    field.slice(1)
                                }
                                type="text"
                                fullWidth
                                name={field}
                                type="text"
                                onChange={(e) => handleChange(e)}
                                value={content.field}
                            />
                        </React.Fragment>
                    )
                }
            )}
        </>
    )
}

const Book = ({ content, setContent }) => {
    useEffect(() => {
        setContent({
            type: 'book',
            title: '',
            authors: '',
            editors: '',
            publisher: '',
            year: '',
            citation_key: '',
        })
    }, [])

    const handleChange = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value })
    }

    return (
        <>
            {[
                'title',
                'authors',
                'editors',
                'publisher',
                'year',
                'citation_key',
            ].map((field, key) => {
                return (
                    <React.Fragment key={key}>
                        <TextField
                            margin="dense"
                            label={
                                field.charAt(0).toUpperCase() + field.slice(1)
                            }
                            type="text"
                            fullWidth
                            name={field}
                            type="text"
                            onChange={(e) => handleChange(e)}
                            value={content.field}
                        />
                    </React.Fragment>
                )
            })}
        </>
    )
}

const Conference = ({ content, setContent }) => {
    useEffect(() => {
        setContent({
            type: 'conference',
            title: '',
            authors: '',
            booktitle: '',
            year: '',
            citation_key: '',
        })
    }, [])

    const handleChange = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value })
    }

    return (
        <>
            {['title', 'authors', 'booktitle', 'year', 'citation_key'].map(
                (field, key) => {
                    return (
                        <React.Fragment key={key}>
                            <TextField
                                margin="dense"
                                label={
                                    field.charAt(0).toUpperCase() +
                                    field.slice(1)
                                }
                                type="text"
                                fullWidth
                                name={field}
                                type="text"
                                onChange={(e) => handleChange(e)}
                                value={content.field}
                            />
                        </React.Fragment>
                    )
                }
            )}
        </>
    )
}

const Patent = ({ content, setContent }) => {
    useEffect(() => {
        setContent({
            type: 'patent',
            year: '',
            yearfiled: '',
            nationality: '',
            number: '',
            citation_key: '',
        })
    }, [])

    const handleChange = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value })
    }

    return (
        <>
            {['year', 'yearfiled', 'nationality', 'number', 'citation_key'].map(
                (field, key) => {
                    return (
                        <React.Fragment key={key}>
                            <TextField
                                margin="dense"
                                label={
                                    field.charAt(0).toUpperCase() +
                                    field.slice(1)
                                }
                                type="text"
                                fullWidth
                                name={field}
                                type="text"
                                onChange={(e) => handleChange(e)}
                                value={content.field}
                            />
                        </React.Fragment>
                    )
                }
            )}
        </>
    )
}
