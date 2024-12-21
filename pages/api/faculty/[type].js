import { NextApiHandler } from 'next'
import { depList, facultyTables } from '../../../lib/const'
import { query } from '../../../lib/db'

const handler = async (req, res) => {
    const { type } = req.query
    let results

    if (type == 'all') {
        let results = await query(`select * from users ORDER BY name ASC; `)
        let array = JSON.parse(JSON.stringify(results))
        // console.log(array);
        return res.json(array)
    } else if (type == 'faculties') {
        results = []
        let list = [...depList.values()]
        for (let i = 0; i < list.length - 1; i++) {
            let data = await query(
                `SELECT * FROM users where department=? ORDER BY name ASC`,
                [list[i]]
            ).catch((e) => console.log(e))
            results = [...results, ...JSON.parse(JSON.stringify(data))]
        }
        return res.json(results.sort())
    } 
    else if (type === 'count') {
        let countResult = await query(`SELECT COUNT(*) as count FROM users;`).catch((e) => console.log(e))
        let count = JSON.parse(JSON.stringify(countResult))[0].count
        return res.json({ facultyCount: count })}
    else if (depList.has(type)) {
        results = await query(
            `
      select * from users where department=?`,
            [depList.get(type)]
        )
    } else {
        results = {}
        let data = await query(`SELECT * FROM users WHERE email=?`, [
            String(type),
        ]).catch((e) => {
            console.log(e)
        })
        let profile = JSON.parse(JSON.stringify(data))[0]
        results['profile'] = profile
        let array = facultyTables
        for (let i = 0; i < array.length; i++) {
            let element = array[i]
            let data = await query(`SELECT * FROM ${element} WHERE email=?`, [
                String(type),
            ]).catch((e) => {
                console.log(e)
            })
            let tmp = JSON.parse(JSON.stringify(data))
            // console.log(JSON.parse(JSON.stringify(tmp)));
            if (tmp[0] != undefined) {
                results[element] = tmp
            }
        }
    }
    let array = JSON.parse(JSON.stringify(results))
    // console.log(array);
    return res.status(200).json(array)
}

export default handler
