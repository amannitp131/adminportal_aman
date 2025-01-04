import { NextApiHandler } from 'next';
import { query } from '../../../lib/db';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {

    const params = req.body;
    let session =params.session;
    console.log("req.body in update", req.body);

    if (session) {
        const { type } = req.query; // Extract the type from the query parameters
        console.log("type in update", type);
        try {
            const params = req.body; // Get the request body

            // Check user roles and permissions
            if (
                session.user.role === 1 ||
                ((session.user.role === 2 || session.user.role === 3 || session.user.role === 4 || session.user.role === 5) &&
                session.user.email === params.email)
            ) {
                // Handle course updates
                if (type === 'course') {
                    const result = await query(
                        `UPDATE courses SET 
            course_code=?, 
            title=?, 
            remark=?, 
            drive_link=?, 
            
            semester=?, 
            timestamp=? 
        WHERE id=?`,
        [
            params.course_code,
            params.title,
            params.remark,
            params.drive_link,
             // Assuming you want to update the user who made the change
            params.semester,
            new Date(), // Current timestamp
            params.id,
        ]
        
                    );
                    
                    console.log('Update result:', result);
                    return res.json(result);
                }

                // Handle notice updates
                if (type === 'notice') {
                    params.attachments = JSON.stringify(params.attachments);
                    let result = await query(
                        `UPDATE notices SET title=?, updatedAt=?, openDate=?, closeDate=?, important=?, attachments=?, notice_link=?, isVisible=?, updatedBy=?, notice_type=? WHERE id=?`,
                        [
                            params.title,
                            params.timestamp,
                            params.openDate,
                            params.closeDate,
                            params.important,
                            params.attachments,
                            params.notice_link,
                            params.isVisible,
                            params.email,
                            params.notice_type,
                            params.id,
                        ]
                    );
                    return res.json(result);
                }

                // Handle other types (event, innovation, etc.)
                if (type === 'event') {
                    params.attachments = JSON.stringify(params.attachments);
                    let result = await query(
                        `UPDATE events SET title=?, updatedAt=?, openDate=?, closeDate=?, venue=?, event_link=?, doclink=?, attachments=?, updatedBy=?, eventStartDate=?, eventEndDate=? WHERE id=?`,
                        [
                            params.title,
                            params.timestamp,
                            params.openDate,
                            params.closeDate,
                            params.venue,
                            params.event_link,
                            params.doclink,
                            params.attachments,
                            params.email,
                            params.eventStartDate,
                            params.eventEndDate,
                            params.id,
                        ]
                    );
                    return res.json(result);
                }

                // Handle innovation updates
                if (type === 'innovation') {
                    params.image = JSON.stringify(params.image);
                    let result = await query(
                        `UPDATE innovation SET title=?, updatedAt=?, openDate=?, closeDate=?, description=?, image=?, author=?, updatedBy=? WHERE id=?`,
                        [
                            params.title,
                            params.timestamp,
                            params.openDate,
                            params.closeDate,
                            params.description,
                            params.image,
                            params.author,
                            params.email,
                            params.id,
                        ]
                    );
                    return res.json(result);
                }

                // Handle news updates
                if (type === 'news') {
                    params.image = JSON.stringify(params.image);
                    params.add_attach = JSON.stringify(params.add_attach);
                    let result = await query(
                        `UPDATE news SET title=?, updatedAt=?, openDate=?, closeDate=?, description=?, image=?, attachments=?, author=?, updatedBy=? WHERE id=?`,
                        [
                            params.title,
                            params.timestamp,
                            params.openDate,
                            params.closeDate,
                            params.description,
                            params.image,
                            params.add_attach,
                            params.author,
                            params.email,
                            params.id,
                        ]
                    );
                    return res.json(result);
                }
            }

            // User-specific updates
            if (type === 'user' && (session.user.role === 1 || session.user.email === params.email)) {
                if (params.update_social_media_links) {
                    console.log("params in update request", params);
                    
                    // Debugging: Check if session email matches the one being passed
                    console.log("Session email:", session.user.email);
                    
                    try {
                        let result = await query(
                            'UPDATE users SET linkedin=?, google_scholar=?, personal_webpage=?, scopus=?, vidwan=?, orcid=? WHERE email=?',
                            [
                                params.linkedin || '', // Using params.linkedin instead of params.Linkedin
                                params.google_scholar || '', // Adjust key names to match the request
                                params.personal_webpage || '',
                                params.scopus || '',
                                params.vidwan || '',
                                params.orcid || '',
                                session.user.email, // Use session user email for matching
                            ]
                        );
                
                        console.log('Database update result:', result);
                        
                        // Check if any rows were affected
                        if (result.affectedRows === 0) {
                            console.log('No rows updated, check if the email exists and data is different');
                        }
                
                        return res.json(result);
                    } catch (error) {
                        console.log('Error during update:', error);
                        return res.status(500).json({ error: 'Failed to update user data' });
                    }
                }
                 else {
                    let result = await query(
                        `UPDATE users SET name=?, email=?, role=?, department=?, designation=?, ext_no=?, administration=?, research_interest=? WHERE id=?`,
                        [
                            params.name,
                            params.email,
                            params.role,
                            params.department,
                            params.designation,
                            params.ext_no,
                            params.administration,
                            params.research_interest,
                            params.id,
                        ]
                    );
                    return res.json(result);
                }
            }

            if (session.user.email == params.email) {
                if (type == 'image') {
                    // let result = await query(
                    //   `REPLACE INTO users (email,image) values (`+
                    //     `'${params.email}','${params.image[0].url}')`
                    // );
                    let result = await query(
                        `UPDATE users SET	image='${params.image[0].url}' WHERE email='${params.email}'`
                    )
                    return res.json(result)
                } else if (type == 'workexperience') {
                    let result = await query(
                        `UPDATE work_experience SET work_experiences=?,institute=?,start=?,end=? WHERE email=? AND id=?`,
                        [
                            params.work_experiences,
                            params.institute,
                            params.start,
                            params.end,
                            params.email,
                            params.id,
                        ]
                    ).catch((e) => {
                        console.log(e)
                    })
                    return res.json(result)
                } else if (type == 'current-responsibility') {
                    let result = await query(
                        `UPDATE curr_admin_responsibility SET curr_responsibility=?,start=? WHERE email=? AND id=?`,
                        [
                            params.curr_responsibility,
                            params.start,
                            params.email,
                            params.id,
                        ]
                    )
                    return res.json(result)
                } else if (type == 'memberships') {
                    let result = await query(
                        `UPDATE memberships SET membership_id=?,membership_society=?,start=?,end=? WHERE email=? AND id=?`,
                        [
                            params.membership_id,
                            params.membership_society,
                            params.start,
                            params.end,
                            params.email,
                            params.id,
                        ]
                    )
                    return res.json(result)
                } else if (type == 'past-responsibility') {
                    let result = await query(
                        `UPDATE past_admin_responsibility SET past_responsibility=?,start=?,end=? WHERE email=? AND id=?`,
                        [
                            params.past_responsibility,
                            params.start,
                            params.end,
                            params.email,
                            params.id,
                        ]
                    )
                    return res.json(result)
                } else if (type == 'subjects') {
                    let result = await query(
                        `UPDATE subjects_teaching SET code=?,name=?,start=?,end=? WHERE email=? AND id=?;`,
                        [
                            params.code,
                            params.name,
                            params.start,
                            params.end,
                            params.email,
                            params.id,
                        ]
                    ).catch((e) => {
                        console.log(e)
                    })
                    return res.json(result)
                } else if (type == 'publications') {
                    console.log("data to be modified in db:", params.new_data);
                    params.data = JSON.stringify(params.new_data);
                    
                    let result = await query(
                        `INSERT INTO publications (email, publications) 
                         VALUES (?, ?) 
                         ON DUPLICATE KEY UPDATE publications = ?`,
                        [params.email, params.data, params.data]
                    ).catch((err) => console.log(err));
                
                    return res.json(result);
                }
                 else if (type == 'project') {
                    let result = await query(
                        `UPDATE project SET project=?,sponsor=?,amount=?,start=?,end=? WHERE email=? AND id=?`,
                        [
                            params.project,
                            params.sponsor,
                            params.amount,
                            params.start,
                            params.end,
                            params.email,
                            params.id,
                        ]
                    )
                    return res.json(result)
                } else if (type == 'professionalservice') {
                    let result = await query(
                        `UPDATE professional_service SET services=? WHERE email=? AND id=?`,
                        [params.services, params.email, params.id]
                    )
                    return res.json(result)
                } else if (type == 'education') {
                    let result = await query(
                        `UPDATE education SET certification=?,institution=?,passing_year=? WHERE email=? AND id=?`,
                        [
                            params.certification,
                            params.institution,
                            params.passing_year,
                            params.email,
                            params.id,
                        ]
                    )
                    return res.json(result)
                } else if (type == 'phdcandidates') {
                    let result = await query(
                        `UPDATE phd_candidates SET phd_student_name=?,thesis_topic=?,start_year=?,completion_year=? WHERE email=? AND id=?`,
                        [
                            params.phd_student_name,
                            params.thesis_topic,
                            params.start_year,
                            params.completion_year,
                            params.email,
                            params.id,
                        ]
                    )
                    return res.json(result)
                } else if (type == 'pg_ug_projects') {
                    let result = await query(
                        `UPDATE pg_ug_projects SET student_name=?,student_program=?,project_topic=?,start_year=?,completion_year=? WHERE email=? AND id=?`,
                        [
                            params.student_name,
                            params.student_program,
                            params.project_topic,
                            params.start_year,
                            params.completion_year,
                            params.email,
                            params.id,
                        ]
                    )
                    return res.json(result)
                }
    
                
            } else {
                res.json({ message: 'Could not find matching requests' });
            }
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    } else {
        res.status(403).json({ message: 'You are not authorized' });
    }
};

export default handler;
