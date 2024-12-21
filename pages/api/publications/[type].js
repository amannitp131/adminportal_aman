// pages/api/publications.js

import { query } from '../../../lib/db';
import { sortByYearDesc } from '../../../lib/utils'; // Implement this function to sort publications by year descending

const publicationsHandler = async (req, res) => {
    try {
        const { type } = req.query;

        if (type === 'all') {
            // Retrieve all publications ordered by year descending
            const results = await query(`SELECT * FROM publications ORDER BY JSON_EXTRACT(publications, '$[0].year') DESC`);
            const publications = results.map(result => ({
                publication_id: result.publication_id,
                email: result.email,
                publications: JSON.parse(result.publications),
                pub_pdf: result.pub_pdf
            }));
            return res.status(200).json(publications);
        } else if (type === 'count') {
            // Calculate counts of each publication type
            const counts = await getAllCounts();
            return res.status(200).json(counts);
        } else {
            // Retrieve specific type of publications or count for individual type
            let results;
            switch (type) {
                case 'patents':
                    results = await query(`
                        SELECT * FROM publications 
                        WHERE JSON_CONTAINS(publications, '{"type": "patent"}')
                        ORDER BY JSON_EXTRACT(publications, '$[0].year') DESC
                    `);
                    break;
                case 'books':
                    results = await query(`
                        SELECT * FROM publications 
                        WHERE JSON_CONTAINS(publications, '{"type": "book"}')
                        ORDER BY JSON_EXTRACT(publications, '$[0].year') DESC
                    `);
                    break;
                case 'journals':
                    results = await query(`
                        SELECT * FROM publications 
                        WHERE JSON_CONTAINS(publications, '{"type": "journal"}')
                        ORDER BY JSON_EXTRACT(publications, '$[0].year') DESC
                    `);
                    break;
                case 'conferences':
                    results = await query(`
                        SELECT * FROM publications 
                        WHERE JSON_CONTAINS(publications, '{"type": "conference"}')
                        ORDER BY JSON_EXTRACT(publications, '$[0].year') DESC
                    `);
                    break;
                case 'articles':
                    results = await query(`
                        SELECT * FROM publications 
                        WHERE JSON_CONTAINS(publications, '{"type": "article"}')
                        ORDER BY JSON_EXTRACT(publications, '$[0].year') DESC
                    `);
                    break;
                default:
                    return res.status(400).json({ message: 'Invalid type parameter' });
            }

            const publications = results.map(result => ({
                publication_id: result.publication_id,
                email: result.email,
                publications: JSON.parse(result.publications),
                pub_pdf: result.pub_pdf
            }));

            return res.status(200).json(publications);
        }
    } catch (error) {
        console.error('Error handling publications request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllCounts = async () => {
    try {
        const [patentCountResult] = await query(`
            SELECT COUNT(*) as count FROM publications 
            WHERE JSON_CONTAINS(publications, '{"type": "patent"}')
        `);
        const [bookCountResult] = await query(`
            SELECT COUNT(*) as count FROM publications 
            WHERE JSON_CONTAINS(publications, '{"type": "book"}')
        `);
        const [journalCountResult] = await query(`
            SELECT COUNT(*) as count FROM publications 
            WHERE JSON_CONTAINS(publications, '{"type": "journal"}')
        `);
        const [conferenceCountResult] = await query(`
            SELECT COUNT(*) as count FROM publications 
            WHERE JSON_CONTAINS(publications, '{"type": "conference"}')
        `);
        const [articleCountResult] = await query(`
            SELECT COUNT(*) as count FROM publications 
            WHERE JSON_CONTAINS(publications, '{"type": "article"}')
        `);

        const counts = {
            patents: patentCountResult.count || 0,
            books: bookCountResult.count || 0,
            journals: journalCountResult.count || 0,
            conferences: conferenceCountResult.count || 0,
            articles: articleCountResult.count || 0
        };

        return counts;
    } catch (error) {
        console.error('Error fetching publication counts:', error);
        return { message: 'Failed to fetch publication counts' };
    }
};

export default publicationsHandler;
