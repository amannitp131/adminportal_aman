import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useSession } from 'next-auth/react';
import React, { useState, useCallback } from 'react';

export const EditForm = ({ data, handleClose, modal }) => {
    const [session] = useSession();
    const [content, setContent] = useState({
        id: data.id,
        course_code: data.course_code,
        title: data.title,
        remark: data.remark,
        drive_link: data.drive_link,
        semester: data.semester,
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = useCallback((e) => {
        setContent((prevContent) => ({ ...prevContent, [e.target.name]: e.target.value }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setSubmitting(true);
    
        const now = Date.now();
        const finalData = {
            ...content,
            timestamp: now,
            email: session.user.email,
        };
    
        const result = await fetch(`/api/update/course?type=course`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(finalData),
        });
    
        if (!result.ok) {
            const errorData = await result.json();
            console.error('Error occurred:', errorData);
        } else {
            // Optionally handle successful update
            console.log('Update successful:', await result.json());
        }
    
        setSubmitting(false); // Don't forget to reset the submitting state
        window.location.reload();
    }, [content, session]);

    return (
        <Dialog open={modal} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                <DialogTitle disableTypography style={{ fontSize: '2rem' }}>
                    Edit Course
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
    );
};
