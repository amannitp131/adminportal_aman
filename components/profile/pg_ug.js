import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import useRefreshData from '@/custom-hooks/refresh'

export const AddProj = ({ handleClose, modal, session }) => {
    console.log("Session data:", session);
    const refreshData = useRefreshData(false)
    const initialState = {
        program: '',
        project_thesis_ug: '',
        project_thesis_pg: '',
        project: '',
        roll_numbers: '',
        student_names: '',
        other_supervisors: '',
        external_supervisors: '',
        start:'',
        end: '',
        isOngoing: false, // New field for checkbox
    }

    const [content, setContent] = useState(initialState)
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value })
    }

    const handleCheckboxChange = (e) => {
        setContent({ ...content, isOngoing: e.target.checked, end: undefined }) // Reset end date if ongoing
    }

    const handleSubmit = async (e) => {
        setSubmitting(true)
        e.preventDefault()
       
        let data = {
            ...content,
            id: Date.now(),
            email: session.user.email,
            session: session,
        }

        let result = await fetch('/api/create/project', {
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
        }

        handleClose()
        refreshData()
        setSubmitting(false)
        setContent(initialState)
    }

    return (
        <Dialog open={modal} onClose={handleClose}>
            <form onSubmit={(e) => handleSubmit(e)}>
                <DialogTitle disableTypography style={{ fontSize: `2rem` }}>
                    Add Your Project
                </DialogTitle>
                <DialogContent>
                    {/* New Field: Program Selection */}
                    <TextField
                        margin="dense"
                        id="program"
                        label="Select Program"
                        name="program"
                        select
                        fullWidth
                        value={content.program}
                        onChange={(e) => handleChange(e)}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">Select Program</option>
                        <option value="UG">UG (B.Tech)</option>
                        <option value="PG">PG (M.Tech/MCA/MBA)</option>
                    </TextField>

                    {/* Conditionally render based on program selection */}
                    {content.program === 'UG' && (
                        <TextField
                            margin="dense"
                            id="project_thesis_ug"
                            label="Project and Thesis Supervised UG B.Tech"
                            name="project_thesis_ug"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.project_thesis_ug}
                        />
                    )}

                    {content.program === 'PG' && (
                        <TextField
                            margin="dense"
                            id="project_thesis_pg"
                            label="Project and Thesis Supervised PG/M.Tech/MCA/MBA"
                            name="project_thesis_pg"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.project_thesis_pg}
                        />
                    )}
                    <TextField
                        margin="dense"
                        id="title"
                        label="Title"
                        name="project"
                        type="text"
                        required
                        fullWidth
                        onChange={(e) => handleChange(e)}
                        value={content.project}
                    />
                    <TextField
                        margin="dense"
                        id="roll_numbers"
                        label="Roll Numbers (separated by commas)"
                        name="roll_numbers"
                        type="text"
                        fullWidth
                        onChange={(e) => handleChange(e)}
                        value={content.roll_numbers}
                    />
                    <TextField
                        margin="dense"
                        id="student_names"
                        label="Names of Students (separated by commas)"
                        name="student_names"
                        type="text"
                        fullWidth
                        onChange={(e) => handleChange(e)}
                        value={content.student_names}
                    />

                    {/* New Fields */}
                    <TextField
                        margin="dense"
                        id="other_supervisors"
                        label="Other Supervisors"
                        name="other_supervisors"
                        type="text"
                        fullWidth
                        onChange={(e) => handleChange(e)}
                        value={content.other_supervisors}
                    />
                    <TextField
                        margin="dense"
                        id="external_supervisors"
                        label="External Supervisors"
                        name="external_supervisors"
                        type="text"
                        fullWidth
                        onChange={(e) => handleChange(e)}
                        value={content.external_supervisors}
                    />
                    <TextField
                        margin="dense"
                        id="start"
                        label="Start Date"
                        name="start"
                        type="date"
                        fullWidth
                        onChange={(e) => handleChange(e)}
                        value={content.start}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    {/* New Checkbox to toggle Ongoing */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={content.isOngoing}
                                onChange={handleCheckboxChange}
                                name="isOngoing"
                                color="primary"
                            />
                        }
                        label="Project is Ongoing"
                    />
                    {/* Conditionally render End Date field based on Ongoing */}
                    {!content.isOngoing && (
                        <TextField
                            margin="dense"
                            id="end"
                            label="End Date"
                            name="end"
                            type="date"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.end}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button type="submit" color="primary" disabled={submitting}>
                        {submitting ? 'Submitting' : 'Submit'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export const EditProj = ({ handleClose, modal, values }) => {
    const { data: session, status } = useSession()
    const loading = status === 'loading'
    const refreshData = useRefreshData(false)

    const initialState = {
        program: values.program || '',
        project_thesis_ug: values.project_thesis_ug || '',
        project_thesis_pg: values.project_thesis_pg || '',
        project: values.project || '',
        roll_numbers: values.roll_numbers || '',
        student_names: values.student_names || '',
        other_supervisors: values.other_supervisors || '',
        external_supervisors: values.external_supervisors || '',
        start: values.start || undefined,
        end: values.end || undefined,
        isOngoing: values.isOngoing || false, 
    }

    const [content, setContent] = useState(initialState)
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value })
    }

    const handleCheckboxChange = (e) => {
        setContent({ ...content, isOngoing: e.target.checked, end: undefined }) // Reset end date if ongoing
    }

    const handleSubmit = async (e) => {
        setSubmitting(true)
        e.preventDefault()

        let data = {
            ...content,
            id: values.id, 
            email: session.user.email,
            session: session,
        }

        let result = await fetch('/api/update/project', {
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
        }

        handleClose()
        refreshData()
        setSubmitting(false)
    }

    return (
        <Dialog open={modal} onClose={handleClose}>
            <form onSubmit={(e) => handleSubmit(e)}>
                <DialogTitle disableTypography style={{ fontSize: `2rem` }}>
                    Edit Project
                </DialogTitle>
                <DialogContent>
                    {/* New Field: Program Selection */}
                    <TextField
                        margin="dense"
                        id="program"
                        label="Program"
                        name="program"
                        select
                        fullWidth
                        value={content.program}
                        onChange={(e) => handleChange(e)}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">Select Program</option>
                        <option value="UG">UG (B.Tech)</option>
                        <option value="PG">PG (M.Tech/MCA/MBA)</option>
                    </TextField>

                    {/* Conditionally render based on program selection */}
                    {content.program === 'UG' && (
                        <TextField
                            margin="dense"
                            id="project_thesis_ug"
                            label="Project and Thesis Supervised UG B.Tech"
                            name="project_thesis_ug"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.project_thesis_ug}
                        />
                    )}

                    {content.program === 'PG' && (
                        <TextField
                            margin="dense"
                            id="project_thesis_pg"
                            label="Project and Thesis Supervised PG/M.Tech/MCA/MBA"
                            name="project_thesis_pg"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.project_thesis_pg}
                        />
                    )}
                    <TextField
                        margin="dense"
                        id="title"
                        label="Title"
                        name="project"
                        type="text"
                        required
                        fullWidth
                        onChange={(e) => handleChange(e)}
                        value={content.project}
                    />
                    <TextField
                        margin="dense"
                        id="roll_numbers"
                        label="Roll Numbers (separated by commas)"
                        name="roll_numbers"
                        type="text"
                        fullWidth
                        onChange={(e) => handleChange(e)}
                        value={content.roll_numbers}
                    />
                    <TextField
                        margin="dense"
                        id="student_names"
                        label="Names of Students (separated by commas)"
                        name="student_names"
                        type="text"
                        fullWidth
                        onChange={(e) => handleChange(e)}
                        value={content.student_names}
                    />
                    
                    {/* New Fields */}
                    <TextField
                        margin="dense"
                        id="other_supervisors"
                        label="Other Supervisors"
                        name="other_supervisors"
                        type="text"
                        fullWidth
                        onChange={(e) => handleChange(e)}
                        value={content.other_supervisors}
                    />
                    <TextField
                        margin="dense"
                        id="external_supervisors"
                        label="External Supervisors"
                        name="external_supervisors"
                        type="text"
                        fullWidth
                        onChange={(e) => handleChange(e)}
                        value={content.external_supervisors}
                    />
                    <TextField
                        margin="dense"
                        id="start"
                        label="Start Date"
                        name="start"
                        type="date"
                        fullWidth
                        onChange={(e) => handleChange(e)}
                        value={content.start}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    {/* New Checkbox to toggle Ongoing */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={content.isOngoing}
                                onChange={handleCheckboxChange}
                                name="isOngoing"
                                color="primary"
                            />
                        }
                        label="Project is Ongoing"
                    />
                    {/* Conditionally render End Date field based on Ongoing */}
                    {!content.isOngoing && (
                        <TextField
                            margin="dense"
                            id="end"
                            label="End Date"
                            name="end"
                            type="date"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.end}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button type="submit" color="primary" disabled={submitting}>
                        {submitting ? 'Submitting' : 'Submit'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
