import { NextApiHandler } from 'next';
import { query } from '../../../lib/db';
// import { getSession } from 'next-auth/';

const handler = async (req, res) => {
    const session = req.body.session;

    if (session) {
        const { type } = req.query;
        try {
            const params = req.body;

            if (
                session.user.role === 1 ||
                ((session.user.role === 2 || session.user.role === 3 || session.user.role === 4 || session.user.role === 5) &&
                session.user.email === params.email)
            ) {
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
                            params.semester,
                            new Date(),
                            params.id,
                        ]
                    );
                    return res.json(result);
                }

                if (type === 'notice') {
                    params.attachments = JSON.stringify(params.attachments);
                    const result = await query(
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

                if (type === 'event') {
                    params.attachments = JSON.stringify(params.attachments);
                    const result = await query(
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

                if (type === 'innovation') {
                    params.image = JSON.stringify(params.image);
                    const result = await query(
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

                if (type === 'news') {
                    params.image = JSON.stringify(params.image);
                    params.add_attach = JSON.stringify(params.add_attach);
                    const result = await query(
                        `UPDATE news SET title=?, updatedAt=?, openDate=?, closeDate=?, description=?, image=?, attachments=?, author=?, updatedBy=? WHERE id=?`,
                        [
                            params.data.title,
                            params.data.timestamp,
                            params.data.openDate,
                            params.data.closeDate,
                            params.data.description,
                            params.data.image,
                            params.data.add_attach,
                            params.data.author,
                            params.data.email,
                            params.data.id,
                        ]
                    );
                    return res.json(result);
                }
            }

            if (type === 'user' && (session.user.role === 1 || session.user.email === params.email)) {
                if (params.update_social_media_links) {
                    const result = await query(
                        'UPDATE users SET linkedin=?, google_scholar=?, personal_webpage=?, scopus=?, vidwan=?, orcid=? WHERE email=?',
                        [
                            params.Linkedin ? params.Linkedin : '',
                            params['Google Scholar'] ? params['Google Scholar'] : '',
                            params['Personal Webpage'] ? params['Personal Webpage'] : '',
                            params['Scopus'] ? params['Scopus'] : '',
                            params['Vidwan'] ? params['Vidwan'] : '',
                            params['Orcid'] ? params['Orcid'] : '',
                            session.user.email,
                        ]
                    );
                    return res.json(result);
                } else {
                    const result = await query(
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
                    const result = await query(
                        `UPDATE users SET image='${params.image[0].url}' WHERE email='${params.email}'`
                    );
                    return res.json(result);
                } else if (type == 'workexperience') {
                    const result = await query(
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
                        console.log(e);
                    });
                    return res.json(result);
                } else if (type == 'current-responsibility') {
                    const result = await query(
                        `UPDATE curr_admin_responsibility SET curr_responsibility=?,start=? WHERE email=? AND id=?`,
                        [
                            params.curr_responsibility,
                            params.start,
                            params.email,
                            params.id,
                        ]
                    );
                    return res.json(result);
                } else if (type == 'memberships') {
                    const result = await query(
                        `UPDATE memberships SET membership_id=?,membership_society=?,start=?,end=? WHERE email=? AND id=?`,
                        [
                            params.membership_id,
                            params.membership_society,
                            params.start,
                            params.end,
                            params.email,
                            params.id,
                        ]
                    );
                    return res.json(result);
                } else if (type == 'past-responsibility') {
                    const result = await query(
                        `UPDATE past_admin_responsibility SET past_responsibility=?,start=?,end=? WHERE email=? AND id=?`,
                        [
                            params.past_responsibility,
                            params.start,
                            params.end,
                            params.email,
                            params.id,
                        ]
                    );
                    return res.json(result);
                } else if (type == 'subjects') {
                    const result = await query(
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
                        console.log(e);
                    });
                    return res.json(result);
                } else if (type == 'publications') {
                    params.data = JSON.stringify(params.data);
                    const result = await query(
                        `UPDATE publications SET publications=? WHERE email=? AND publication_id=?`,
                        [params.data, params.email, params.publication_id]
                    ).catch((err) => console.log(err));
                    return res.json(result);
                } else if (type == 'project') {
                    const result = await query(
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
                    );
                    return res.json(result);
                } else if (type == 'professionalservice') {
                    const result = await query(
                        `UPDATE professional_service SET services=? WHERE email=? AND id=?`,
                        [params.services, params.email, params.id]
                    );
                    return res.json(result);
                } else if (type == 'education') {
                    const result = await query(
                        `UPDATE education SET certification=?,institution=?,passing_year=? WHERE email=? AND id=?`,
                        [
                            params.certification,
                            params.institution,
                            params.passing_year,
                            params.email,
                            params.id,
                        ]
                    );
                    return res.json(result);
                } else if (type == 'phdcandidates') {
                    const result = await query(
                        `UPDATE phd_candidates SET phd_student_name=?,thesis_topic=?,start_year=?,completion_year=? WHERE email=? AND id=?`,
                        [
                            params.phd_student_name,
                            params.thesis_topic,
                            params.start_year,
                            params.completion_year,
                            params.email,
                            params.id,
                        ]
                    );
                    return res.json(result);
                } else if (type == 'pg_ug_projects') {
                    const result = await query(
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
                    );
                    return res.json(result);
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
