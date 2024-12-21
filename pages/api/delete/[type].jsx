import { NextApiHandler } from 'next'
import { query } from '../../../lib/db'
import { getSession } from 'next-auth/client'

const handler = async (req, res) => {
    const session = await getSession({ req });

    if (session) {
        const { type } = req.query;
        try {
            let params = req.body;

            if (session.user.role === 1 || session.user.role === 2 || session.user.role === 4) {
                if (type == 'notice') {
                    let result = await query(
                        `DELETE FROM notices WHERE id = ?`, [params]
                    );
                    return res.json(result);
                }
                
            }
            if (session.user.role === 1 || session.user.role === 2 ||session.user.role === 3 || session.user.role === 4) {
                
                if (type === 'course') {
                    // Handling for course deletion
                    const result = await query(`DELETE FROM courses WHERE id = ?`, [params]);
                    return res.json(result);
                }
            }

            if (session.user.role == 1) {
                if (type == 'user') {
                    let array = [
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
                    for (let i = 0; i < array.length; i++) {
                        let element = array[i];
                        await query(
                            `DELETE FROM ${element} WHERE email = ?`, [params]
                        ).catch((e) => {
                            console.log(e);
                        });
                    }
                    return res.json({ message: 'USER DELETED SUCCESSFULLY.' });
                } else if (type == 'event') {
                    let result = await query(
                        `DELETE FROM events WHERE id = ?`, [params]
                    );
                    return res.json(result);
                } else if (type == 'innovation') {
                    let result = await query(
                        `DELETE FROM innovation WHERE id = ?`, [params]
                    );
                    return res.json(result);
                } else if (type == 'news') {
                    let result = await query(
                        `DELETE FROM news WHERE id = ?`, [params]
                    );
                    return res.json(result);
                } else if (type == 'course') {
                    // Handling for course deletion
                    let result = await query(
                        `DELETE FROM courses WHERE id = ?`, [params]
                    );
                    return res.json(result);
                }
            }

            params = JSON.parse(req.body);
            if (session.user.email == params.email) {
                if (type == 'memberships') {
                    let result = await query(
                        `DELETE FROM memberships WHERE id = ?`, [params.id]
                    );
                    return res.json(result);
                } else if (type == 'image') {
                    let result = await query(
                        `DELETE FROM faculty_image WHERE email = ?`, [params.email]
                    );
                    return res.json(result);
                } else if (type == 'current-responsibility') {
                    let result = await query(
                        `DELETE FROM curr_admin_responsibility WHERE id = ?`, [params.id]
                    );
                    return res.json(result);
                } else if (type == 'past-responsibility') {
                    let result = await query(
                        `DELETE FROM past_admin_responsibility WHERE id = ?`, [params.id]
                    );
                    return res.json(result);
                } else if (type == 'workexperience') {
                    let result = await query(
                        `DELETE FROM work_experience WHERE id = ?`, [params.id]
                    );
                    return res.json(result);
                } else if (type == 'subjects') {
                    let result = await query(
                        `DELETE FROM subjects_teaching WHERE id = ?`, [params.id]
                    );
                    return res.json(result);
                } else if (type == 'publications') {
                    let data = JSON.stringify(params.new_data);
                    let result = await query(
                        `UPDATE publications SET publications = ? WHERE email = ?`,
                        [data, params.email],
                    );
                    return res.json(result);
                } else if (type == 'pub-pdf') {
                    let result = await query(
                        `UPDATE publications SET pub_pdf = '' WHERE email = ?`, [params.email]
                    );
                    return res.json(result);
                } else if (type == 'project') {
                    let result = await query(
                        `DELETE FROM project WHERE id = ?`, [params.id]
                    );
                    return res.json(result);
                } else if (type == 'professionalservice') {
                    let result = await query(
                        `DELETE FROM Professional_Service WHERE id = ?`, [params.id]
                    );
                    return res.json(result);
                } else if (type == 'education') {
                    let result = await query(
                        `DELETE FROM education WHERE id = ?`, [params.id]
                    );
                    return res.json(result);
                } else if (type == 'patent') {
                    let result = await query(
                        `DELETE FROM patents WHERE id = ?`, [params.id]
                    );
                    return res.json(result);
                } else if (type == 'phdcandidates') {
                    let result = await query(
                        `DELETE FROM phd_candidates WHERE id = ?`, [params.id]
                    );
                    return res.json(result);
                }
            } else {
                return res.json({ message: 'Could not find matching requests' });
            }
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    } else {
        res.status(403).json({ message: 'You are not authorized' });
    }
};

export default handler;
