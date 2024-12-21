import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import { useSession } from 'next-auth/client'
import React, { useState } from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import Grid from '@material-ui/core/Grid'
import useRefreshData from '@/custom-hooks/refresh'

export const AddSociety = ({ handleClose, modal }) => {
    const [session, loading] = useSession()
    const refreshData = useRefreshData(false)
    const initialState = {
        membership_id: '',
        membership_society: '',
        start: undefined,
        end: undefined,
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
        console.log(content.start)
        let result = await fetch('/api/create/memberships', {
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
                        Add Society
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="label"
                            label="Membership Id"
                            name="membership_id"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.membership_id}
                        />
                        <TextField
                            margin="dense"
                            id="label"
                            label="Society"
                            name="membership_society"
                            type="text"
                            required
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.membership_society}
                        />
                        <TextField
                            margin="dense"
                            id="societyStart"
                            label="Start Date"
                            name="start"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.start}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            margin="dense"
                            id="societyEnd"
                            label="End Date"
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
                  name="start"
                  format="MM/yyyy"
                  views={["year", "month"]}
                  label="Start-Date"
                  value={content.start}
                  onChange={(e) => setContent({ ...content, start: e })}
                />
              </Grid>
            </MuiPickersUtilsProvider>

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="flex-start">
                <DatePicker
                  openTo="year"
                  name="end"
                  format="MM/yyyy"
                  views={[ "month","year"]}
                  label="End-Date"
                  value={content.end}
                  onChange={(e) => setContent({ ...content, end: e })}
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

export const EditSociety = ({ handleClose, modal, values }) => {
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
        console.log(data)
        let result = await fetch('/api/update/memberships', {
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
                        Edit Society
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="label"
                            label="Membership Id"
                            name="membership_id"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.membership_id}
                        />
                        <TextField
                            margin="dense"
                            id="label"
                            label="Society"
                            name="membership_society"
                            type="text"
                            required
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.membership_society}
                        />
                        <TextField
                            margin="dense"
                            id="societyStart"
                            label="Start Date"
                            name="start"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.start}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            margin="dense"
                            id="societyEnd"
                            label="End Date"
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
                  name="start"
                  format="MM/yyyy"
                  views={["year", "month"]}
                  label="Start-Date"
                  value={content.start}
                  onChange={(e) => setContent({ ...content, start: e })}
                />
              </Grid>
            </MuiPickersUtilsProvider>

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="flex-start">
                <DatePicker
                  openTo="year"
                  name="end"
                  format="MM/yyyy"
                  views={[ "month","year"]}
                  label="End-Date"
                  value={content.end}
                  onChange={(e) => setContent({ ...content, end: e })}
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
