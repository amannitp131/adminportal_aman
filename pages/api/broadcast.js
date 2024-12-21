import { createTransport } from 'nodemailer'
import { getSession } from 'next-auth/client'

const handler = async (req, res) => {
    const session = await getSession({ req })

    if (req.method !== 'POST') {
        res.status(400).send({ message: 'method not allowed' })
        return
    }

    if (session) {
        var data = req.body
        if (typeof data !== 'object') {
            data = JSON.parse(data)
        }
        var type = data.type
        var subject, body

        if (type == 'notice') {
            subject = 'Notice'
            body = 'You have a new notice\n' + data.notice
        } else if (type == 'event') {
            subject = 'Event'
            body = 'You have a new event\n' + data.event
        } else if (type == 'news') {
            subject = 'News'
            body = 'You have a new news\n' + data.news
        } else {
            res.status(400).json({ message: 'Type not defined' })
        }

        // send mail with defined transport object
        var transporter = createTransport({
            service: 'gmail',
            auth: {
                user: process.env.BROADCAST_EMAIL,
                pass: process.env.BROADCAST_EMAIL_PASS,
            },
        })

        let info = await transporter.sendMail({
            from: process.env.BROADCAST_EMAIL, // sender address
            to: data.email, // list of receivers
            subject: subject, // Subject line
            text: body, // plain text body
        })

        res.status(200).json({ message: 'success' })
    } else {
        res.status(403).json({ message: 'You are not authorized' })
    }
}

export default handler
