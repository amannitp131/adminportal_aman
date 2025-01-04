import { query } from '../../../lib/db'

const handler = async (req, res) => {
    const { type } = req.query

    try {
        let results
        const now = new Date().getTime()
        if (type === 'all') {
            results = await query(
                `
      SELECT * from events ORDER BY openDate DESC
    `
            )
        } else if (type == 'active') {
            results = await query(
                `SELECT * from events where openDate<? and closeDate>? ORDER BY openDate DESC`,
                [now, now]
            )
        } else if (type == 'range') {
            const start = req.body.start_date
            const end = req.body.end_date
            const from = req.body.from
            const to = req.body.to

            results = await query(
                `
      SELECT * from events where closeDate<=? and openDate>=? ORDER BY openDate DESC limit ?,?`,
                [end, start, from, to - from]
            ).catch((err) => console.log(err))
        } else if (type == 'between') {
            const from = req.body.from
            const to = req.body.to

            results = await query(
                `SELECT * from events ORDER BY openDate DESC limit ?, ?`,
                [from, to - from]
            )
        }
        let array = JSON.parse(JSON.stringify(results))
        array.forEach((element) => {
            element.attachments = JSON.parse(element.attachments)
        })

        // console.log(array);
        return res.status(200).json(array)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export default handler
