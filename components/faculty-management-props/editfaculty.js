import { FormControl } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import { Delete } from '@material-ui/icons'
// import { useSession } from "next-auth/client";
import React, { useState } from 'react'
import { ConfirmDelete } from './confirm-delete'
import { administrationList, depList } from '../../lib/const.js'

export const EditFaculty = ({ data, handleClose, modal }) => {
    // const [session, loading] = useSession();
    const [submitting, setSubmitting] = useState(false)

    const [content, setContent] = useState({ ...data })
    const handleChange = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value })
        // console.log(content);
    }
    const [verifyDelete, setVerifyDelete] = useState(false)

    const handleDelete = () => {
        setVerifyDelete(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        let result = await fetch('/api/update/user', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(content),
        })
        result = await result.json()
        if (result instanceof Error) {
            console.log('Error Occured')
            console.log(result)
        }
        console.log(result)
        window.location.reload()
    }
    return (
        <>
            <Dialog open={modal} onClose={handleClose}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <DialogTitle
                        disableTypography
                        style={{ fontSize: `2rem`, position: `relative` }}
                    >
                        Edit Faculty Details
                        <i
                            style={{
                                position: `absolute`,
                                right: `15px`,
                                cursor: `pointer`,
                            }}
                        >
                            <Delete
                                type="button"
                                onClick={() => setVerifyDelete(true)}
                                style={{ height: `2rem`, width: `auto` }}
                                color="secondary"
                            />
                        </i>
                    </DialogTitle>
                    <ConfirmDelete
                        modal={verifyDelete}
                        handleClose={handleDelete}
                        email={content.email}
                    />
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="label"
                            label="Name"
                            name="name"
                            type="text"
                            required
                            fullWidth
                            placeholder="Name"
                            onChange={(e) => handleChange(e)}
                            value={content.name}
                        />
                        <TextField
                            margin="dense"
                            id="email"
                            label="Email"
                            name="email"
                            type="email"
                            required
                            fullWidth
                            placeholder="Email"
                            onChange={(e) => handleChange(e)}
                            value={content.email}
                        />

                        <TextField
                            margin="dense"
                            id="designation"
                            label="Designation"
                            type="text"
                            fullWidth
                            placeholder="Designation"
                            name="designation"
                            onChange={(e) => handleChange(e)}
                            value={content.designation}
                        />
                        {/* <TextField
							margin="dense"
							id="department"
							label="Department"
							fullWidth
							placeholder="Department"
							name="department"
							type="text"
							onChange={(e) => handleChange(e)}
							value={content.department}
						/> */}
                        <FormControl
                            style={{ margin: `10px auto`, width: `100%` }}
                            required
                        >
                            <InputLabel id="demo-dialog-select-label">
                                Role
                            </InputLabel>

                            <Select
                                labelId="demo-dialog-select-label"
                                id="demo-dialog-select"
                                name="role"
                                value={content.role}
                                onChange={(e) => handleChange(e)}
                                input={<Input />}
                            >
                                <MenuItem value={1}>Super Admin</MenuItem>
                                <MenuItem value={2}>Admin</MenuItem>
                                <MenuItem value={3}>Faculty</MenuItem>
                                <MenuItem value={4}>Section Admin</MenuItem>
                            </Select>
                        </FormControl>

                        {content.role === 4 && (
                            <FormControl
                                style={{ margin: `10px auto`, width: `100%` }}
                                required
                            >
                                <InputLabel id="demo-dialog-select-label2">
                                    Administration Type
                                </InputLabel>

                                <Select
                                    labelId="demo-dialog-select-label2"
                                    id="demo-dialog-select2"
                                    name="administration"
                                    fullWidth
                                    value={content.administration}
                                    onChange={(e) => handleChange(e)}
                                    input={<Input />}
                                >
                                    <MenuItem value={'NULL'}>NULL</MenuItem>
                                    {[...administrationList].map(
                                        ([key, value]) => {
                                            return (
                                                <MenuItem value={key}>
                                                    {value}
                                                </MenuItem>
                                            )
                                        }
                                    )}
                                </Select>
                            </FormControl>
                        )}

                        <FormControl
                            style={{ margin: `10px auto`, width: `100%` }}
                            required
                        >
                            <InputLabel id="department">Department</InputLabel>
                            <Select
                                labelId="branch"
                                autoWidth
                                id="branch"
                                name="department"
                                value={content.department}
                                onChange={(e) => handleChange(e)}
                                input={<Input />}
                            >
                                {[...depList].map(([key, value]) => (
                                    <MenuItem value={value}>{value}</MenuItem>
                                ))}
                                <MenuItem value="Developer">Developer</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            margin="dense"
                            id="ext-no"
                            label="Ext No."
                            type="text"
                            fullWidth
                            placeholder="Ext No."
                            name="ext_no"
                            onChange={(e) => handleChange(e)}
                            value={content.ext_no}
                        />
                    </DialogContent>
                    <DialogActions>
                        {submitting ? (
                            <Button color="primary" disabled>
                                Submitting
                            </Button>
                        ) : (
                            <Button type="submit" color="primary">
                                Submit
                            </Button>
                        )}
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}
