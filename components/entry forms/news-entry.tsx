import { useState } from 'react'
import Router from 'next/router'
import { Button } from '@material-ui/core'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import FilledInput from '@material-ui/core/FilledInput'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

export default function EntryForm() {
    const [content, setContent] = useState({
        title: '',
        description: '',
        openDate: null,
        closeDate: null,
        venue: '',
        attachments: [],
    })
    const [submitting, setSubmitting] = useState(false)

    async function submitHandler(e) {
        setSubmitting(true)
        e.preventDefault()
        try {
            const res = await fetch('/api/create-entry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                }),
            })
            setSubmitting(false)
            const json = await res.json()
            if (!res.ok) throw Error(json.message)
            Router.push('/')
        } catch (e) {
            throw Error(e.message)
        }
    }

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
        >
            <Grid item xs={3}>
                <Paper className="Modal">
                    <Typography color="textPrimary">
                        Enter details for News
                    </Typography>
                    <form onSubmit={submitHandler}>
                        <div>
                            <TextField
                                id="title"
                                type="text"
                                name="title"
                                label="title"
                                value={content.title}
                                onChange={(e) =>
                                    setContent({
                                        ...content,
                                        [e.target.name]: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <TextField
                                className="shadow border resize-none focus:shadow-outline w-full h-48"
                                id="description"
                                name="description"
                                label="Description"
                                multiline
                                value={content.description}
                                onChange={(e) =>
                                    setContent({
                                        ...content,
                                        [e.target.name]: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <TextField
                                className="shadow border resize-none focus:shadow-outline w-full h-48"
                                id="openDate"
                                name="openDate"
                                type="date"
                                label="Open Date"
                                multiline
                                value={content.openDate}
                                onChange={(e) =>
                                    setContent({
                                        ...content,
                                        [e.target.name]: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <TextField
                                className="shadow border resize-none focus:shadow-outline w-full h-48"
                                id="closeDate"
                                name="closeDate"
                                label="Close Date"
                                type="date"
                                multiline
                                value={content.openDate}
                                onChange={(e) =>
                                    setContent({
                                        ...content,
                                        [e.target.name]: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <TextField
                                id="venue"
                                type="text"
                                name="venue"
                                label="venue"
                                value={content.venue}
                                onChange={(e) =>
                                    setContent({
                                        ...content,
                                        [e.target.name]: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <Button disabled={submitting} type="submit">
                            {submitting ? 'Creating ...' : 'Create'}
                        </Button>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    )
}
