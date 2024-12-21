import { query } from '../../../lib/db'
import { depList } from '../../../lib/const'

const project = async (req, res) => {
    const { type } = req.query

    try {
        let results

        if (type === 'all') {
            results = await query(
                `SELECT * FROM project ORDER BY end DESC`
            )
        } else if (type === 'count') {
            let countResult = await query(`SELECT COUNT(*) as count FROM project`).catch((e) => {
                console.log('Error fetching project count: ', e)
                return []
            })
            if (countResult && countResult.length > 0) {
                let count = countResult[0].count
                return res.json({ projectCount: count })
            }
            return res.status(500).json({ message: 'Failed to fetch project count' })
        } else {
            return res.status(400).json({ message: 'Invalid type parameter or department not found' })
        }

        let array = JSON.parse(JSON.stringify(results))
        return res.status(200).json(array)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export default project
