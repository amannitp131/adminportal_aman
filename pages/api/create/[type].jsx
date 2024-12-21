import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/client'
import { query } from '../../../lib/db'

const handler = async (req, res) => {
    const session = await getSession({ req })
    // let session = true;

    if (session) {
        const { type } = req.query
        try {
            let params = req.body
            if (session.user.role === 1 || session.user.role === 2 || session.user.role === 3||session.user.role === 4) {
                // Handling for 'course' type
                if (type === 'course') {
                    params.timestamp = new Date().getTime(); // Auto-fetch timestamp
                    let result = await query(
                        `INSERT INTO courses (email, course_code, title, remark, drive_link, timestamp, semester) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [
                            session.user.email,  // User's email from session
                            params.course_code,
                            params.title,
                            params.remark,
                            params.drive_link,
                            new Date(),          // Current timestamp
                            params.semester,
                        ]
                    ).catch((err) => {
                        console.log(err);
                        return res.status(500).json({ message: err.message });
                    });
            
                    return res.json(result);
                }
            }
            
            if (
                session.user.role === 1 ||
                session.user.role === 2 ||
                session.user.role === 4
            ) {
                if (type == 'notice') {
                    params.attachments = JSON.stringify(params.attachments)
                    params.main_attachment = JSON.stringify(
                        params.main_attachment
                    )
                    params.timestamp = new Date().getTime()
                    let result = await query(
                        `INSERT INTO notices (id,title,timestamp,openDate,closeDate,important,attachments,email,isVisible,notice_link,notice_type,department,updatedBy,updatedAt) VALUES ` +
                            `(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                        [
                            params.id,
                            params.title,
                            params.timestamp,
                            params.openDate,
                            params.closeDate,
                            params.important,
                            params.attachments,
                            params.email,
                            params.isVisible,
                            params.main_attachment,
                            params.notice_type,
                            params.department,
                            params.email,
                            params.timestamp,
                        ]
                    ).catch((err) => console.log(err))
                    return res.json(result)
                }
            }

            if (session.user.role == 1) {
                if (session.user.role == 1 && type == 'user') {
                    // let result = await
                    await query(
                        `INSERT INTO users (name,email,role,department,designation,administration,ext_no,research_interest) values (` +
                            `?,?,?,?,?,?,?,?)`,
                        [
                            params.name,
                            params.email,
                            params.role,
                            params.department,
                            params.designation,
                            params.administration,
                            params.ext_no,
                            params.research_interest,
                        ]
                    )
                        .then((result) => {
                            return res.json(result)
                        })
                        .catch((err) => {
                            console.log(err)
                            return res.json({
                                message: err.message,
                                type: 'error',
                            })
                        })
                    return res.end()
                } else if (type == 'event') {
                        params.attachments = JSON.stringify(params.attachments);
                        params.main_attachment = JSON.stringify(params.main_attachment);
                        params.timestamp = new Date().getTime();
                    
                        let result = await query(
                            `INSERT INTO events (id, title, timestamp, openDate, closeDate, venue, doclink, attachments, event_link, email, eventStartDate, eventEndDate, updatedBy, updatedAt, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [
                                params.id,
                                params.title,
                                params.timestamp,
                                params.openDate,
                                params.closeDate,
                                params.venue,
                                params.doclink,
                                params.attachments,
                                params.main_attachment,
                                params.email,
                                params.eventStartDate,
                                params.eventEndDate,
                                params.email,
                                params.timestamp,
                                params.type || 'general',  // Default to 'general' if type is not provided
                            ]
                        ).catch((err) => console.log(err));
                    
                        return res.json(result);
                    } else if (type == 'innovation') {
                    params.image = JSON.stringify(params.image)
                    params.timestamp = new Date().getTime()
                    let result = await query(
                        `INSERT INTO innovation (id,title,timestamp,openDate,closeDate,description,image,author,email,updatedBy,updatedAt) VALUES ` +
                            `(?,?,?,?,?,?,?,?,?,?,?)`,
                        [
                            params.id,
                            params.title,
                            params.timestamp,
                            params.openDate,
                            params.closeDate,
                            params.description,
                            params.image,
                            params.author,
                            params.email,
                            params.email,
                            params.timestamp,
                        ]
                    )
                    return res.json(result)
                } else if (type == 'news') {
                    params.image = JSON.stringify(params.image)
                    params.add_attach = JSON.stringify(params.add_attach)
                    params.timestamp = new Date().getTime()
                    let result = await query(
                        `INSERT INTO news (id,title,timestamp,openDate,closeDate,description,image,attachments,author,email,updatedBy,updatedAt) VALUES ` +
                            `(?,?,?,?,?,?,?,?,?,?,?,?)`,
                        [
                            params.id,
                            params.title,
                            params.timestamp,
                            params.openDate,
                            params.closeDate,
                            params.description,
                            params.image,
                            params.add_attach,
                            params.author,
                            params.email,
                            params.email,
                            params.timestamp,
                        ]
                    )
                    return res.json(result)
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
                } else if (type == 'cv') {
                    let result = await query(
                        `UPDATE users SET	cv='${params.cv[0].url}' WHERE email='${params.email}'`
                    )
                    return res.json(result)
                } else if (type == 'current-responsibility') {
                    let result = await query(
                        `INSERT INTO curr_admin_responsibility (id,email,curr_responsibility,start) VALUES` +
                            `(?,?,?,?)`,
                        [
                            params.id,
                            params.email,
                            params.curr_responsibility,
                            params.start,
                        ]
                    )
                    return res.json(result)
                } else if (type == 'memberships') {
                    let result = await query(
                        `insert into memberships (id,email,membership_id,membership_society,start,end) values (` +
                            `?,?,?,?,?,?)`,
                        [
                            params.id,
                            params.email,
                            params.membership_id,
                            params.membership_society,
                            params.start,
                            params.end,
                        ]
                    )
                    return res.json(result)
                } else if (type == 'past-responsibility') {
                    let result = await query(
                        `INSERT INTO past_admin_responsibility (id,email,past_responsibility,start,end) VALUES` +
                            `(?,?,?,?,?)`,
                        [
                            params.id,
                            params.email,
                            params.past_responsibility,
                            params.start,
                            params.end,
                        ]
                    )
                    return res.json(result)
                } else if (type == 'workexperience') {
                    let result = await query(
                        `INSERT INTO work_experience (id,email,work_experiences,institute,start,end) VALUES` +
                            `(?,?,?,?,?,?)`,
                        [
                            params.id,
                            params.email,
                            params.work_experiences,
                            params.institute,
                            params.start,
                            params.end,
                        ]
                    )
                    return res.json(result)
                } else if (type == 'subjects') {
                    let result = await query(
                        `INSERT INTO subjects_teaching (id,email,code,name,start,end) VALUES` +
                            `(?,?,?,?,?,?)`,
                        [
                            params.id,
                            params.email,
                            params.code,
                            params.name,
                            params.start,
                            params.end,
                        ]
                    ).catch((e) => {
                        console.log(e)
                    })
                    return res.json(result)
                } else if (type == 'publications') {
                    console.log(params.data)
                    params.data = JSON.stringify(params.data)
                    let result = await query(
                        ` INSERT INTO publications (email,publication_id,publications) VALUES (?,?,?)` +
                            ` ON DUPLICATE KEY UPDATE publications= ? ;`,
                        [params.email, Date.now(), params.data, params.data]
                    ).catch((err) => console.log(err))
                    // console.log(result)
                    return res.json(result)
                } else if (type == 'pub-pdf') {
                    console.log(params.pdf)
                    let result = await query(
                        ` INSERT INTO publications (email,publication_id,pub_pdf) VALUES (?,?,?)` +
                            ` ON DUPLICATE KEY UPDATE pub_pdf= ? ;`,
                        [params.email, Date.now(), params.pdf, params.pdf]
                    ).catch((err) => console.log(err))
                    // console.log(result)
                    return res.json(result)
                } else if (type == 'project') {
                    let result = await query(
                        `INSERT INTO project (id,email,project,sponsor,amount,start,end) VALUES` +
                            `(?,?,?,?,?,?,?)`,
                        [
                            params.id,
                            params.email,
                            params.project,
                            params.sponsor,
                            params.amount,
                            params.start,
                            params.end,
                        ]
                    )
                    return res.json(result)
                } else if (type == 'professionalservice') {
                    let result = await query(
                        `INSERT INTO professional_service (id,email,services) VALUES` +
                            `(?,?,?)`,
                        [params.id, params.email, params.services]
                    )
                    return res.json(result)
                } else if (type == 'education') {
                    let result = await query(
                        `INSERT INTO education (id,email,certification,institution,passing_year) VALUES` +
                            `(?,?,?,?,?)`,
                        [
                            params.id,
                            params.email,
                            params.certification,
                            params.institution,
                            params.passing_year,
                        ]
                    )
                    return res.json(result)
                } else if (type == 'phdcandidates') {
                    let result = await query(
                        `INSERT INTO phd_candidates (id,email,phd_student_name,thesis_topic,start_year,completion_year) VALUES` +
                            `(?,?,?,?,?,?)`,
                        [
                            params.id,
                            params.email,
                            params.phd_student_name,
                            params.thesis_topic,
                            params.start_year,
                            params.completion_year,
                        ]
                    )
                    return res.json(result)
                } else if (type == 'pg_ug_projects') {
                    let result = await query(
                        `INSERT INTO pg_ug_projects (id,email,student_name,student_program,project_topic,start_year,completion_year) VALUES` +
                            `(?,?,?,?,?,?,?)`,
                        [
                            params.id,
                            params.email,
                            params.student_name,
                            params.student_program,
                            params.project_topic,
                            params.start_year,
                            params.completion_year,
                        ]
                    )
                    return res.json(result)
                }
                else if (type == 'patent') {
                    // Handling for patents
                    let result = await query(
                        `INSERT INTO patents (title, description, patent_date, email) VALUES`+ `(?, ?, ?, ?)`,
                        [
                            params.title,
                            params.description,
                            params.patent_date,
                            session.user.email, // Assuming email is fetched from session
                        ]
                    ).catch((err) => console.log(err))
                    return res.json(result)}
            } else {
                return res.json({ message: 'Could not find matching requests' })
            }
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    } else {
        res.status(403).json({ message: 'You are not authorized' })
    }
}

export default handler
