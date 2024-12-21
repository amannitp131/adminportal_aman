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

export const AddProf = ({ handleClose, modal }) => {
    const [session, loading] = useSession()
    const refreshData = useRefreshData(false)
    const initialState = {
        services: '',
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

        let result = await fetch('/api/create/professionalservice', {
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
                        Add Professional Services
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="label"
                            label="Professional Services"
                            name="services"
                            type="text"
                            required
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.services}
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

export const EditProf = ({ handleClose, modal, values }) => {
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

        let result = await fetch('/api/update/professionalservice', {
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
                        Edit Professional Services
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="label"
                            label="Professional Services"
                            name="services"
                            type="text"
                            required
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.services}
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
