import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import Grid from '@material-ui/core/Grid'
import useRefreshData from '@/custom-hooks/refresh'

export const AddWork = ({ handleClose, modal ,session}) => {
    
    const refreshData = useRefreshData(false)
    const initialState = {
        work_experiences: '',
        institute: '',
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
            session:session,
        }
        // data.attachments = JSON.stringify(data.attachments);

        let result = await fetch('/api/create/workexperience', {
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
                        Add Work Experience
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="label"
                            label="Designation"
                            name="work_experiences"
                            type="text"
                            required
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.work_experiences}
                        />
                        <TextField
                            margin="dense"
                            id="label"
                            label="Institute/Company"
                            name="institute"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.institute}
                        />
                        <TextField
                            margin="dense"
                            id="label"
                            label="Start Date"
                            name="start"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.start}
                        />
                        <TextField
                            margin="dense"
                            id="label"
                            label="End Date"
                            name="end"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.end}
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

export const EditWork = ({ handleClose, modal, values }) => {
    const { data: session, status } = useSession();
    const loading = status === "loading";
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

        let result = await fetch('/api/update/workexperience', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(data),
        })
        console.log('------------------------')
        console.log(result)
        console.log('------------------------')
        if (result instanceof Error) {
            console.log('Error Occured')
            // console.log(result)
        }
        result = await result.json()

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
                        Edit Work Experience
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="label"
                            label="Designation"
                            name="work_experiences"
                            type="text"
                            required
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.work_experiences}
                        />
                        <TextField
                            margin="dense"
                            id="label"
                            label="Institute/Company"
                            name="institute"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.institute}
                        />
                        <TextField
                            margin="dense"
                            id="label"
                            label="Start Date"
                            name="start"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.start}
                        />
                        <TextField
                            margin="dense"
                            id="label"
                            label="End Date"
                            name="end"
                            type="text"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            value={content.end}
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
