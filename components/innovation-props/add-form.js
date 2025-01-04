import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { AddAttachments } from './../common-props/add-image';

export const AddForm = ({ handleClose, modal }) => {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [content, setContent] = useState({
        title: '',
        openDate: '',
        closeDate: '',
        description: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [isClient, setIsClient] = useState(false); // For client-side rendering

    useEffect(() => {
        // This will only run once the component mounts (client-side rendering)
        setIsClient(true);
    }, []);

    const handleChange = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        setSubmitting(true);
        e.preventDefault();

        let open = new Date(content.openDate);
        let close = new Date(content.closeDate);
        open = open.getTime();
        close = close.getTime();
        let now = Date.now();

        let data = {
            ...content,
            id: now,
            openDate: open,
            closeDate: close,
            timestamp: now,
            email: session.user.email,
            author: session.user.name,
            image: [...attachments],
        };

        // Process images for upload
        for (let i = 0; i < data.image.length; i++) {
            delete data.image[i].value;

            // Ensure that each image has an alt text
            if (!data.image[i].alt) {
                data.image[i].alt = `Image ${i + 1}`; // Assign default alt text if not provided
            }

            if (data.image[i].url) {
                let file = new FormData();
                file.append('files', data.image[i].url);

                let viewLink = await fetch('/api/gdrive/uploadfiles', {
                    method: 'POST',
                    body: file,
                });

                viewLink = await viewLink.json();
                data.image[i].url = viewLink[0].webViewLink;
            }
        }

        // Send data to server
        let result = await fetch('/api/create/innovation', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(data),
        });

        result = await result.json();
        if (result instanceof Error) {
            console.log('Error Occurred:', result);
        } else {
            console.log(result);
            window.location.reload(); // Reload after successful submission
        }
    };

    // Only render on the client-side
    if (!isClient) return null;

    return (
        <Dialog open={modal} onClose={handleClose}>
            <form
                onSubmit={(e) => {
                    handleSubmit(e);
                }}
            >
                <DialogTitle disableTypography style={{ fontSize: `2rem` }}>
                    Add Innovations
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="label"
                        label="Title"
                        name="title"
                        type="text"
                        required
                        fullWidth
                        placeholder="Title"
                        onChange={(e) => handleChange(e)}
                        value={content.title}
                    />
                    <TextField
                        margin="dense"
                        id="desc"
                        label="Description"
                        type="text"
                        fullWidth
                        placeholder={'Description'}
                        name="description"
                        required
                        onChange={(e) => handleChange(e)}
                        value={content.description}
                    />
                    <TextField
                        margin="dense"
                        id="openDate"
                        label="Open Date"
                        name="openDate"
                        type="date"
                        required
                        value={content.openDate}
                        onChange={(e) => handleChange(e)}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id="closeDate"
                        label="Close Date"
                        name="closeDate"
                        margin="dense"
                        required
                        type="date"
                        onChange={(e) => handleChange(e)}
                        value={content.closeDate}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <h2>Attachments</h2>
                    <AddAttachments
                        attachments={attachments}
                        setAttachments={setAttachments}
                        limit={2}
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
    );
};
