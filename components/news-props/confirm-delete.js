import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

export const ConfirmDelete = ({
    handleClose,
    modal,
    id,
    attachments = [],
    add_attach = [],
    delArray = [],
    session,
    setSubmitting,
    onDeleteSuccess,
}) => {
    const deleteEvent = async () => {
        try {
            const deleteArray = [
                ...delArray,
                ...attachments.filter((el) => el.url).map((el) => el.url.split('/')[5]),
                ...add_attach.filter((el) => el.url).map((el) => el.url.split('/')[5]),
            ];

            if (deleteArray.length) {
                const fileDeleteResponse = await fetch('/api/gdrive/deletefiles', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(deleteArray),
                });
                if (!fileDeleteResponse.ok) {
                    throw new Error('File deletion failed.');
                }
            }

            const newsDeleteResponse = await fetch('/api/delete/news', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session, id: id.toString() }),
            });
            if (!newsDeleteResponse.ok) {
                throw new Error('News deletion failed.');
            }

            console.log('Deletion successful.');
            onDeleteSuccess();
        } catch (error) {
            console.error('Deletion error:', error);
        } finally {
            setSubmitting && setSubmitting(false);
        }
    };

    return (
        <Dialog open={modal} onClose={handleClose}>
            <DialogTitle id="alert-dialog-title">
                {'Do you want to Delete This News ?'}
            </DialogTitle>
            <DialogActions>
                <Button variant="contained" onClick={deleteEvent} color="secondary">
                    Delete
                </Button>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ConfirmDelete.propTypes = {
    handleClose: PropTypes.func.isRequired,
    modal: PropTypes.bool.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    attachments: PropTypes.array,
    add_attach: PropTypes.array,
    delArray: PropTypes.array,
    session: PropTypes.object.isRequired,
    setSubmitting: PropTypes.func,
    onDeleteSuccess: PropTypes.func.isRequired,
};
