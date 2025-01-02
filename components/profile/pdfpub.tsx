import React, { useState } from 'react';
import {
  Button,
  DialogContent,
  Dialog,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import useRefreshData from '@/custom-hooks/refresh';
import { ConfirmDelete } from './delete';

interface UploadResponse {
  id: string;
  name: string;
  webViewLink: string;
}

interface PubPdfProps {
  pdf: string | null;
  session: { user: { email: string } };
}

const PubPdf: React.FC<PubPdfProps> = ({ pdf, session }) => {
  const [pubPdf, setPubPdf] = useState<File | null>(null);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const refreshData = useRefreshData(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPubPdf(file || null);
  };

  const handleClose = () => setModal(false);
  const handleCloseDeleteModal = () => setDeleteModal(false);
  const openDeleteModal = () => setDeleteModal(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!pubPdf) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('files', pubPdf);

      const res = await fetch('/api/gdrive/uploadfiles', {
        method: 'POST',
        body: formData,
      });

      const [fileData]: UploadResponse[] = await res.json();
      const webViewLink = fileData.webViewLink;

      const data = {
        email: session.user.email,
        pdf: webViewLink,
      };

      await fetch('/api/create/pub-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      setModal(false);
      refreshData();
    } catch (err) {
      console.error('Error uploading file:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async () => {
    if (!pdf) return;

    const fileId = pdf.split('/')[5];
    try {
      const res = await fetch('/api/gdrive/deletefiles', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([fileId]),
      });

      const result = await res.json();
      console.log('Delete result:', result);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  return (
    <React.Fragment>
      {pdf ? (
        <div style={{ margin: '1rem 0' }}>
          <a href={pdf} target="_blank" rel="noopener noreferrer">
            View Publication
          </a>
          <IconButton aria-label="delete" onClick={openDeleteModal}>
            <Delete />
          </IconButton>
          <ConfirmDelete
            handleClose={handleCloseDeleteModal}
            modal={deleteModal}
            id={pdf.split('/')[5]}
            del="pub-pdf"
            callback={handleDeleteFile}
          />
        </div>
      ) : (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModal(true)}
            style={{ marginTop: '1rem' }}
          >
            Upload Publications
          </Button>
          <Dialog open={modal} onClose={handleClose}>
            <DialogTitle>Upload Publication PDF</DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleChange}
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading || !pubPdf}
                  style={{ marginTop: '1rem' }}
                >
                  {loading ? 'Uploading...' : 'Upload PDF'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </React.Fragment>
  );
};

export default PubPdf;
