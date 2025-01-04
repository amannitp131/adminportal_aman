import { query } from '../../../lib/db';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
    if (req.method === 'POST') {  // Change method from DELETE to POST
        try {
            console.log("req.body in delete", req.body);  // Log to ensure the body is parsed

            const { id, email, session } = req.body || {};

            if (!session || !session.user) {
                return res.status(403).json({ message: 'Session not found or invalid' });
            }

            const user = session.user;
            const userEmail = user.email;
            const userRole = user.role;

            console.log("id in post", id);
            console.log("userEmail in post", userEmail);
            console.log("userRole in post", userRole);
            console.log("session in post", session);

            // Check if the user is authorized (based on userRole, for example)
            if (userRole !== 1) {  // Only allow for users with role 1
                return res.status(403).json({ message: 'You are not authorized to perform this action' });
            }

            const { type } = req.query;
            let result;

            try {
                // Perform the corresponding delete operation based on the type
                switch (type) {
                    case 'notice':
                        result = await query('DELETE FROM notices WHERE id = ?', [id]);
                        break;
                    case 'event':
                        result = await query('DELETE FROM events WHERE id = ?', [id]);
                        break;
                    case 'innovation':
                        result = await query('DELETE FROM innovation WHERE id = ?', [id]);
                        break;
                    case 'news':
                        result = await query('DELETE FROM news WHERE id = ?', [id]);
                        break;
                    case 'phdcandidates':
                        result = await query('DELETE FROM phd_candidates WHERE id = ?', [id]);
                        break;
                    case 'pg_ug_projects':
                        result = await query('DELETE FROM pg_ug_projects WHERE id = ?', [id]);
                        break;
                    case 'memberships':
                        result = await query('DELETE FROM memberships WHERE id = ?', [id]);
                        break;
                    case 'image':
                        result = await query('DELETE FROM faculty_image WHERE email = ?', [email]);
                        break;
                    case 'current-responsibility':
                        result = await query('DELETE FROM curr_admin_responsibility WHERE id = ?', [id]);
                        break;
                    case 'past-responsibility':
                        result = await query('DELETE FROM past_admin_responsibility WHERE id = ?', [id]);
                        break;
                    case 'workexperience':
                        result = await query('DELETE FROM work_experience WHERE id = ?', [id]);
                        break;
                    case 'subjects':
                        result = await query('DELETE FROM subjects_teaching WHERE id = ?', [id]);
                        break;
                    case 'publications':
                        result = await query('DELETE FROM publications WHERE id = ?', [id]);
                        break;
                    case 'project':
                        result = await query('DELETE FROM project WHERE id = ?', [id]);
                        break;
                    case 'professionalservice':
                        result = await query('DELETE FROM Professional_Service WHERE id = ?', [id]);
                        break;
                    case 'education':
                        result = await query('DELETE FROM education WHERE id = ?', [id]);
                        break;
                    default:
                        return res.json({ message: 'Invalid type' });
                }

                console.log(result);
                return res.json({ message: 'Deleted successfully' });
            } catch (e) {
                console.error('Error during query execution:', e);
                res.status(500).json({ message: e.message });
            }
        } catch (error) {
            console.error('Error parsing body:', error);
            return res.status(400).json({ message: 'Invalid body format or empty body' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handler;
