import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

export const ConfirmDelete = ({
    handleClose,
    modal,
    id,
    main_event,
    attachments,
    delArray,
}) => {
    const deleteEvent = async () => {
        


        // Delete the event from the database
        const result = await fetch('/api/delete/course', {
            method: 'DELETE',
            body: id.toString(),
        });
        const jsonResult = await result.json();
        if (jsonResult instanceof Error) {
            console.log('Error Occurred');
            console.log(jsonResult);
        }
        console.log(jsonResult);

        // Reload the page after deletion
        window.location.reload();
    };

    return (
        <Dialog open={modal} onClose={handleClose}>
            <DialogTitle id="alert-dialog-title">
                {'Do you want to delete this Course Data?'}
            </DialogTitle>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={deleteEvent}
                    color="secondary"
                >
                    Delete
                </Button>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};
