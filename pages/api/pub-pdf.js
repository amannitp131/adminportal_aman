import multer from 'multer'
import { getSession } from 'next-auth/client'
import { query } from '../../lib/db'

export const config = {
    api: {
        bodyParser: false,
    },
}
