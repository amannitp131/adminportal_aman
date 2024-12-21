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

export const Addproject = ({ handleClose, modal }) => {
    const [session, loading] = useSession()
    const refreshData = useRefreshData(false)
    const initialState = {
        project: '',
        sponsor: '',
        amount: '',
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

        // let start = new Date(content.start);
        // let end = new Date(content.end);
        // start = start.getTime();
        // end = end.getTime();

        let data = {
            ...content,
            id: Date.now(),
            email: session.user.email,
        }
        // data.attachments = JSON.stringify(data.attachments);

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
                        Add Your Project
                    </DialogTitle>
                    <DialogContent>
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
                            id="sponsor"
                            label="Sponsoring Agency"
                            name="sponsor"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.sponsor}
                        />
                        <TextField
                            margin="dense"
                            id="amount"
                            label="Amount"
                            name="amount"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.amount}
                        />
                        <TextField
                            margin="dense"
                            id="labelprojectS"
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
                            id="labelprojectE"
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
                  views={["year", "month"]}
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

export const Editproject = ({ handleClose, modal, values }) => {
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

        // let start = new Date(content.start);
        // let end = new Date(content.end);
        // start = start.getTime();
        // end = end.getTime();

        let data = {
            ...content,
            id: values.id,
            email: session.user.email,
        }
        // data.attachments = JSON.stringify(data.attachments);

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
                        Edit Project
                    </DialogTitle>
                    <DialogContent>
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
                            id="sponsor"
                            label="Sponsoring Agency"
                            name="sponsor"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.sponsor}
                        />
                        <TextField
                            margin="dense"
                            id="amount"
                            label="Amount"
                            name="amount"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.amount}
                        />
                        <TextField
                            margin="dense"
                            id="labelprojectS"
                            label="Start Date  (format - 15/05/2003 )"
                            name="start"
                            type="text"
                            fullWidth
                            required
                            onChange={(e) => handleChange(e)}
                            value={content.start}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            margin="dense"
                            id="labelprojectE"
                            label="End Date (format - 08/06/2004 )"
                            name="end"
                            type="text"
                            fullWidth
                            required
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
                  views={["year", "month"]}
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
