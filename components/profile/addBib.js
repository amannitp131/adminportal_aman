import { Button, DialogContent, Dialog, DialogTitle } from '@material-ui/core'
import React, { useState } from 'react'
import useRefreshData from '@/custom-hooks/refresh'

export default function Bib({ published }) {
    const [bibFile, setBibFile] = useState(null)
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const refreshData = useRefreshData(false)

    const handleChange = (e) => {
        setBibFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        console.log(bibFile)
        let data = new FormData()
        data.append('bib-file', bibFile)
        let method_ = published.length ? 'PUT' : 'POST'
        try {
            let res = await fetch('/api/bib2json', {
                method: method_,
                body: data,
            })
            res = await res.json()
            console.log(res)
            setLoading(false)
            setModal(false)
            refreshData()
        } catch (err) {
            console.log(err)
        }
    }
    const handleClose = () => {
        setModal(false)
    }

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setModal(!modal)}
                style={{ marginTop: `1rem` }}
            >
                Upload BIB file
            </Button>
            <Dialog open={modal} onClose={handleClose}>
                <DialogTitle id="alert-dialog-title">
                    Upload BIB File
                </DialogTitle>

                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <input
                            name="bib-file"
                            id="contained-button-file"
                            onChange={handleChange}
                            type="file"
                        />

                        <label>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={loading}
                            >
                                Upload BIB
                            </Button>
                        </label>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
