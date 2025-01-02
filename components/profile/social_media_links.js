import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import { useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import useRefreshData from '@/custom-hooks/refresh'

export const AddSocialMediaForm = ({ handleClose, modal, links, session, result }) => {

    const refreshData = useRefreshData(false)

    // Initialize the state based on the links or previous values from result.profile
    const [content, setContent] = useState({
        linkedin: links?.linkedin || result?.profile?.linkedin || '',
        google_scholar: links?.google_scholar || result?.profile?.google_scholar || '',
        personal_webpage: links?.personal_webpage || result?.profile?.personal_webpage || '',
        scopus: links?.scopus || result?.profile?.scopus || '',
        vidwan: links?.vidwan || result?.profile?.vidwan || '',
        orcid: links?.orcid || result?.profile?.orcid || ''
    })

    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        setContent({
            linkedin: links?.linkedin || result?.profile?.linkedin || '',
            google_scholar: links?.google_scholar || result?.profile?.google_scholar || '',
            personal_webpage: links?.personal_webpage || result?.profile?.personal_webpage || '',
            scopus: links?.scopus || result?.profile?.scopus || '',
            vidwan: links?.vidwan || result?.profile?.vidwan || '',
            orcid: links?.orcid || result?.profile?.orcid || ''
        })
    }, [links, result])

    // Handle input change
    const handleChange = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value })
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        // Prepare the data to send for update
        let data = {
            email: session.user.email,
            session: session,
            update_social_media_links: true
        }

        // Add all fields to data object, even if they were not modified.
        // If a field is empty, we send it as null
        for (let key in content) {
            data[key] = content[key] || null // If the field is empty, set it as null
        }

        // Submit data to the API
        let response = await fetch('/api/update/user', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(data),
        })

        response = await response.json()

        if (response instanceof Error) {
            console.log('Error Occurred')
        }

        // Reset and refresh data
        handleClose()
        refreshData()
        setSubmitting(false)
        setContent({
            linkedin: links?.linkedin || result?.profile?.linkedin || '',
            google_scholar: links?.google_scholar || result?.profile?.google_scholar || '',
            personal_webpage: links?.personal_webpage || result?.profile?.personal_webpage || '',
            scopus: links?.scopus || result?.profile?.scopus || '',
            vidwan: links?.vidwan || result?.profile?.vidwan || '',
            orcid: links?.orcid || result?.profile?.orcid || ''
        })
        window.location.reload() // Optional, could be replaced with state change for better UX
    }

    return (
        <Dialog open={modal} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                <DialogTitle disableTypography style={{ fontSize: `2rem` }}>
                    Add Social Media Links
                </DialogTitle>
                <DialogContent>
                    {Object.keys(content).map((key, index) => {
                        return (
                            <TextField
                                key={index}
                                type="url"
                                name={key}
                                label={key.replace(/_/g, ' ')} // Replaces underscores with spaces for label
                                value={content[key] || ''} // Show value from state
                                onChange={handleChange}
                                margin="normal"
                                fullWidth
                            />
                        )
                    })}
                </DialogContent>
                <DialogActions>
                    <Button type="submit" color="primary" disabled={submitting}>
                        {submitting ? 'Submitting' : 'Submit'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
