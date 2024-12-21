import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import { useSession } from 'next-auth/client'
import React, { useState } from 'react'
import { AddAttachments } from '../common-props/add-attachment'
import Grid from '@material-ui/core/Grid'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import useRefreshData from '@/custom-hooks/refresh'

export const AddForm = ({ handleClose, modal }) => {
    const [session, loading] = useSession()
    const initialState = {
        code: '',
        name: '',
        start: undefined,
        end: undefined,
    }
    const [content, setContent] = useState(initialState)
    const refreshData = useRefreshData(false)
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

        let result = await fetch('/api/create/subjects', {
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
                        Add Subjects
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="labelcode"
                            label="Subject_Code"
                            name="code"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.code}
                        />
                        <TextField
                            margin="dense"
                            id="labelname"
                            label="Subject_Name"
                            name="name"
                            type="text"
                            required
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.name}
                        />
                        {/* <TextField
              margin="dense"
              id="labelsession"
              label="Session Start Date"
              name="start"
              type="text"
              fullWidth
              onChange={(e) => handleChange(e)}
              value={content.start}
              InputLabelProps={{
								shrink: true,
							}}
            /> */}

                        <InputLabel id="select" shrink={true} margin="dense">
                            Session
                        </InputLabel>
                        <Select
                            variant="outlined"
                            labelId="select"
                            id="simple-select"
                            name="start"
                            value={content.start}
                            onChange={(e) => handleChange(e)}
                        >
                            <MenuItem value={'Spring'}>Spring</MenuItem>
                            <MenuItem value={'Summer'}>Summer</MenuItem>
                            <MenuItem value={'Autumn'}>Autumn</MenuItem>
                        </Select>
                        <TextField
                            margin="dense"
                            id="labelsession"
                            label="Year"
                            name="end"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.end}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="flex-start">
                <DatePicker
                  openTo="year"
                  name="end"
                  format="yyyy"
                  views={["year"]}
                  label="Year"
                  value={content.end}
                  onChange={(e) => setContent({ ...content, end: e})}
                />
              </Grid>
            </MuiPickersUtilsProvider> */}
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

export const EditSubject = ({ handleClose, modal, values }) => {
    const [session, loading] = useSession()

    const [content, setContent] = useState(values)
    const refreshData = useRefreshData(false)
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

        let result = await fetch('/api/update/subjects', {
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
                        Edit Subject
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="labelcode"
                            label="Subject_Code"
                            name="code"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.code}
                        />
                        <TextField
                            margin="dense"
                            id="labelname"
                            label="Subject_Name"
                            name="name"
                            type="text"
                            required
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.name}
                        />
                        {/* <TextField
              margin="dense"
              id="labelsession"
              label="Session Start Date"
              name="start"
              type="text"
              fullWidth
              onChange={(e) => handleChange(e)}
              value={content.start}
              InputLabelProps={{
								shrink: true,
							}}
            /> */}

                        <InputLabel id="select" shrink={true} margin="dense">
                            Session
                        </InputLabel>
                        <Select
                            variant="outlined"
                            labelId="select"
                            id="simple-select"
                            name="start"
                            value={content.start}
                            onChange={(e) => handleChange(e)}
                        >
                            <MenuItem value={'Spring'}>Spring</MenuItem>
                            <MenuItem value={'Summer'}>Summer</MenuItem>
                            <MenuItem value={'Autumn'}>Autumn</MenuItem>
                        </Select>
                        <TextField
                            margin="dense"
                            id="labelsession"
                            label="Year"
                            name="end"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.end}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="flex-start">
                <DatePicker
                  openTo="year"
                  name="end"
                  format="yyyy"
                  views={["year"]}
                  label="Year"
                  value={content.end}
                  onChange={(e) => setContent({ ...content, end: e})}
                />
              </Grid>
            </MuiPickersUtilsProvider> */}
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
