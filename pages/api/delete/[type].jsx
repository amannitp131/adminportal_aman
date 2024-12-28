import { query } from '../../../lib/db';

const handler = async (req, res) => {
    try {
        // Parse request body
        const params = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const session = params.session;

        //console.log('Session in delete:', session);

        // Check for a valid session
        if (!session || !session.user) {
            console.log('No session found, redirecting to Sign In.');
            return res.status(403).json({ message: 'You are not authorized' });
        }

        const { type } = req.query;
        const user = session.user;

        //console.log('Type:', type);
        //console.log('Params:', params);

        // Role-based authorization checks
        if (![1, 2, 3, 4].includes(user.role)) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }

       // Handle different delete types
if (type === 'publications') {
    // Validate the request data
    if (!params.email || !params.new_data || !Array.isArray(params.new_data) || params.new_data.length === 0) {
        return res.status(400).json({ message: 'Invalid data: email or new_data is missing or incorrect.' });
    }

    try {
        // Iterate over the publications to be deleted
        for (let i = 0; i < params.new_data.length; i++) {
            console.log("Params:", params)
            const record = params.new_data[i];
            console.log('Record:', record);
            // Check if each publication record contains the necessary fields
            if (!record.publication_id || !record.idArr) {
                return res.status(400).json({ message: 'Invalid data: publication_id or idArr is missing in new_data.' });
            }

            console.log('Attempting to delete record with publication_id:', record.publication_id);

            // Query the database to fetch the publication record based on publication_id and email
            const queryResult = await query(
                `SELECT publications FROM publications WHERE publication_id = ? AND email = ?`,
                [record.publication_id, params.email]
            );

            if (queryResult.length === 0) {
                // Return 404 if no matching publication is found
                return res.status(404).json({ message: 'No publication found with the provided publication_id and email.' });
            }

            // Parse the publications data
            let publicationsData = JSON.parse(queryResult[0].publications);

            // Filter out the publications to delete based on idArr
            publicationsData = publicationsData.filter((pub) => !record.idArr.includes(pub.id)); // Filter out publications to delete

            // If no publications are left, delete the entire record
            if (publicationsData.length === 0) {
                const deleteResult = await query(
                    `DELETE FROM publications WHERE publication_id = ? AND email = ?`,
                    [record.publication_id, params.email]
                );

                console.log('Delete Result:', deleteResult);
                if (deleteResult.affectedRows === 0) {
                    return res.status(404).json({ message: 'No matching publication found to delete.' });
                }
            } else {
                // Otherwise, update the publications data with the new list
                const updateResult = await query(
                    `UPDATE publications SET publications = ? WHERE publication_id = ? AND email = ?`,
                    [JSON.stringify(publicationsData), record.publication_id, params.email]
                );
                console.log('Update Result:', updateResult);
            }
        }

        // Return success message after processing all deletions
        return res.status(200).json({ message: 'Publication records deleted successfully.' });
    } catch (error) {
        // Log and return error details if something goes wrong
        console.error('Error deleting publications:', error);
        return res.status(500).json({ message: 'Failed to delete publications', error: error.message });
    }
}

        
        
        
         else if (type === 'notice') {
            const result = await query(
                `DELETE FROM notices WHERE id = ?`,
                [params.id]
            );
            return res.json(result);
        } else if (type === 'user' && user.role === 1) {
            const tables = [
                'curr_admin_responsibility',
                'education',
                'memberships',
                'past_admin_responsibility',
                'phd_candidates',
                'professional_service',
                'project',
                'publications',
                'subjects_teaching',
                'work_experience',
                'users',
                'patents',
            ];

            for (const table of tables) {
                console.log(`Deleting from table: ${table}`);
                await query(`DELETE FROM ${table} WHERE email = ?`, [params.email]).catch((e) => {
                    console.error(`Error deleting from ${table}:`, e);
                });
            }

            return res.json({ message: 'USER DELETED SUCCESSFULLY.' });
        } else if (type === 'course') {
            const result = await query(
                `DELETE FROM courses WHERE id = ?`,
                [params.id]
            );
            return res.json(result);
        }

        // Fallback for unrecognized types
        return res.status(400).json({ message: 'Invalid delete type' });
    } catch (error) {
        console.error('Error in delete handler:', error);
        return res.status(500).json({ message: error.message });
    }
};

export default handler;
