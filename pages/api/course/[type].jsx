import { query } from '../../../lib/db';

const handler = async (req, res) => {
    const { method } = req;
    const { type, email, courseCode, semester } = req.query; // Extracting from URL query parameters

    try {
        let results;

        // Handle GET requests
        if (method === 'GET') {
            if (type === 'byEmail' && email) {
                // Fetch courses by instructor (email)
                results = await query(
                    `SELECT * FROM courses WHERE email = ? ORDER BY timestamp DESC`,
                    [email]
                );
            } else if (type === 'byCourseCode' && courseCode) {
                // Fetch courses by course code
                results = await query(
                    `SELECT * FROM courses WHERE course_code = ? ORDER BY timestamp DESC`,
                    [courseCode]
                );
            } else if (type === 'bySemester' && semester) {
                // Fetch courses by semester
                results = await query(
                    `SELECT * FROM courses WHERE semester = ? ORDER BY timestamp DESC`,
                    [semester]
                );
            } else {
                return res.status(400).json({ message: 'Invalid query parameters' });
            }

            // Parse results if necessary
            const array = JSON.parse(JSON.stringify(results));
            array.forEach((element) => {
                if (element.attachments) {
                    element.attachments = JSON.parse(element.attachments);
                }
            });

            return res.status(200).json(array);
        } else {
            // If the request method is not GET
            res.setHeader('Allow', ['GET']);
            return res.status(405).json({ message: `Method ${method} Not Allowed` });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

export default handler;
