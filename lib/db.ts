import mysql from 'serverless-mysql';

export const db = mysql({
    config: {
        host: process.env.MYSQL_HOST,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        port: parseInt(process.env.MYSQL_PORT, 10),
    },
});

// Validate environment variables at startup
if (!process.env.MYSQL_HOST || !process.env.MYSQL_DATABASE || !process.env.MYSQL_USERNAME || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_PORT) {
    throw new Error('Missing one or more required MySQL environment variables.');
}

/**
 * Executes a MySQL query.
 * @param q The SQL query string.
 * @param values Query parameters to be escaped.
 * @returns The query result.
 */
export async function query(q: string, values: Array<string | number> = []) {
    try {
        const results = await db.query(q, values);
        return results;
    } catch (e: any) {
        console.error('Database Query Error:', e);
        throw new Error(`Database query failed: ${e.message}`);
    }
}

/**
 * Closes the MySQL connection.
 * Use this explicitly if required in your workflow.
 */
export async function closeConnection() {
    try {
        await db.end();
    } catch (e: any) {
        console.error('Error closing MySQL connection:', e);
    }
}
