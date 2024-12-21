import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import { useSession } from 'next-auth/client'
import React, { useState } from 'react'
import { AddAttachments } from './../common-props/add-attachment'
import useRefreshData from '@/custom-hooks/refresh'

export const AddProj = ({ handleClose, modal }) => {
    const [session, loading] = useSession()
    const refreshData = useRefreshData(false)
    const initialState = {
        student_name: '',
        student_program: '',
        project_topic: '',
        start_year: '',
        completion_year: '',
    }

    const [content, setContent] = useState(initialState)
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value })
        //console.log(content)
    }

    const handleSubmit = async (e) => {
        setSubmitting(true)
        e.preventDefault()
        let data = {
            ...content,
            id: Date.now(),
            email: session.user.email,
        }
        // data.attachments = JSON.stringify(data.attachments);

        let result = await fetch('/api/create/pg_ug_projects', {
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
                <form
                    onSubmit={(e) => {
                        handleSubmit(e)
                    }}
                >
                    <DialogTitle disableTypography style={{ fontSize: `2rem` }}>
                        Add PG/UG Projects
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="label"
                            label="Student Name"
                            name="student_name"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.student_name}
                        />
                        <TextField
                            margin="dense"
                            id="label"
                            label="Student's Program"
                            name="student_program"
                            type="text"
                            required
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.student_program}
                        />
                        <TextField
                            margin="dense"
                            id="label"
                            label="Project Topic"
                            name="project_topic"
                            type="text"
                            required
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.project_topic}
                        />
                        <TextField
                            margin="dense"
                            id="label"
                            label="start_year"
                            name="start_year"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.start_year}
                        />
                        <TextField
                            margin="dense"
                            id="label"
                            label="completion_year"
                            name="completion_year"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.completion_year}
                        />
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

export const EditProj = ({ handleClose, modal, values }) => {
    const [session, loading] = useSession()
    const refreshData = useRefreshData(false)

    const [content, setContent] = useState(values)
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value })
        //console.log(content)
    }

    const handleSubmit = async (e) => {
        setSubmitting(true)
        e.preventDefault()
        let data = {
            ...content,
            id: values.id,
            email: session.user.email,
        }
        // data.attachments = JSON.stringify(data.attachments);

        let result = await fetch('/api/update/pg_ug_projects', {
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
    }

    return (
        <>
            <Dialog open={modal} onClose={handleClose}>
                <form
                    onSubmit={(e) => {
                        handleSubmit(e)
                    }}
                >
                    <DialogTitle disableTypography style={{ fontSize: `2rem` }}>
                        Edit PG/UG Project
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="label"
                            label="Student Name"
                            name="student_name"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.student_name}
                        />
                        <TextField
                            margin="dense"
                            id="label"
                            label="Student's Program"
                            name="student_program"
                            type="text"
                            required
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.student_program}
                        />
                        <TextField
                            margin="dense"
                            id="label"
                            label="Project Topic"
                            name="project_topic"
                            type="text"
                            required
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.project_topic}
                        />
                        <TextField
                            margin="dense"
                            id="label"
                            label="start_year"
                            name="start_year"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.start_year}
                        />
                        <TextField
                            margin="dense"
                            id="label"
                            label="completion_year"
                            name="completion_year"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.completion_year}
                        />
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
