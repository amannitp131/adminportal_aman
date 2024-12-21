import { query } from '../../../lib/db'
import { administrationList, depList,depListIntra } from '../../../lib/const'

const handler = async (req, res) => {
    const { type } = req.query

    try {
        let results
        const now = new Date().getTime()
        if (type === 'all') {
            results = await query(
                `
      SELECT * from notices where notice_type='general' ORDER BY timestamp DESC;
    `
            )
        }
        if (type === 'whole') {
            results = await query(
                `
      SELECT * from notices ORDER BY openDate DESC;
    `
            )
        } else if (administrationList.has(type)) {
            results = await query(
                `
      SELECT * from notices where notice_type=? ORDER BY timestamp DESC
    `,
                [type]
            )
        } else if (type == 'active') {
            results = await query(
                `
        SELECT * from notices where notice_type='general' and openDate<? and closeDate>? ORDER BY openDate DESC`,
                [now, now]
            )
        } else if (type == 'range') {
            const start = req.body.start_date
            const end = req.body.end_date
            const department = req.body.department
            const notice_type = req.body.notice_type
            const from = req.body.from
            const to = req.body.to
            const keyword = req.body.keyword || ''

            if (!notice_type) {
                results = await query(
                    `
        SELECT * from notices where title like ? ORDER BY openDate DESC limit ?, ?`,
                    [`%${keyword}%`, from, to - from]
                ).catch((err) => console.log(err))
            } else if (notice_type !== 'department') {
                results = await query(
                    `
        SELECT * from notices where notice_type=? and closeDate<=? and openDate>=? and title like ? ORDER BY openDate DESC limit ?, ?`,
                    [notice_type, end, start, `%${keyword}%`, from, to - from]
                ).catch((err) => console.log(err))
            } else {
                results = await query(
                    `
        SELECT * from notices where closeDate<=? and openDate>=? and department=? and title like ? ORDER BY openDate DESC limit ?, ?`,
                    [end, start, department, `%${keyword}%`, from, to - from]
                ).catch((err) => console.log(err))
            }
        } else if (type == 'between') {
            const from = req.body.from
            const to = req.body.to

            results = await query(
                `SELECT * from notices ORDER BY openDate DESC limit ?, ?`,
                [from, to - from]
            )
        } else if (depList.has(type)) {
            results = await query(
                `
      select * from notices where notice_type='department' and department=? ORDER BY timestamp DESC`,
                [depList.get(type)]
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
