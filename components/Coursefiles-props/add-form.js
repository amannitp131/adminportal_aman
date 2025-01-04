import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

export const AddForm = ({ handleClose, modal }) => {
    const { data: session, status } = useSession();
    const [content, setContent] = useState({
        course_code: '',
        title: '',
        remark: '',
        drive_link: '',
        semester: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleChange = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const now = Date.now();
        const data = {
            ...content,
            id: now,
            timestamp: now,
            author: session.user.name,
        };

        try {
            const response = await fetch('/api/create/course', {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setSnackbarMessage('Course added successfully!');
                setSnackbarSeverity('success');
                // Reset form fields
                setContent({
                    course_code: '',
                    title: '',
                    remark: '',
                    drive_link: '',
                    semester: '',
                });
                
            } else {
                setSnackbarMessage('Error: ' + result.message || 'Failed to add course.');
                setSnackbarSeverity('error');
            }
        } catch (error) {
            setSnackbarMessage('Network error occurred.');
            setSnackbarSeverity('error');
            console.error('Error occurred:', error);
        } finally {
            setSubmitting(false);
            setOpenSnackbar(true);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <Dialog open={modal} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle disableTypography style={{ fontSize: `2rem` }}>
                        Add Course
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="course_code"
                            label="Course Code"
                            name="course_code"
                            type="text"
                            required
                            fullWidth
                            placeholder="Course Code"
                            onChange={handleChange}
                            value={content.course_code}
                        />
                        <TextField
                            margin="dense"
                            id="title"
                            label="Title"
                            name="title"
                            type="text"
                            required
                            fullWidth
                            placeholder="Title"
                            onChange={handleChange}
                            value={content.title}
                        />
                        <TextField
                            margin="dense"
                            id="remark"
                            label="Remark"
                            name="remark"
                            type="text"
                            fullWidth
                            placeholder="Remark"
                            onChange={handleChange}
                            value={content.remark}
                        />
                        <TextField
                            margin="dense"
                            id="drive_link"
                            label="Drive Link"
                            name="drive_link"
                            type="text"
                            fullWidth
                            placeholder="Google Drive Link"
                            onChange={handleChange}
                            value={content.drive_link}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="semester-label">Semester</InputLabel>
                            <Select
                                labelId="semester-label"
                                id="semester"
                                name="semester"
                                value={content.semester}
                                onChange={handleChange}
                                required
                            >
                                {[...Array(12).keys()].map((i) => (
                                    <MenuItem key={i + 1} value={i + 1}>
                                        Semester {i + 1}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" color="primary" disabled={submitting}>
                            {submitting ? 'Submitting' : 'Submit'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};
