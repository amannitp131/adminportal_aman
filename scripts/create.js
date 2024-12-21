const path = require('path')
const envPath = path.resolve(process.cwd(), '.env.local')

console.log({ envPath })

require('dotenv').config({ path: envPath })

const mysql = require('serverless-mysql')

const db = mysql({
    config: {
        host: process.env.MYSQL_HOST,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        port: process.env.MYSQL_PORT,
    },
})

async function query(q) {
    try {
        const results = await db.query(q)
        await db.end()
        return results
    } catch (e) {
        throw Error(e.message)
    }
}

// Create "entries" table if doesn't exist
async function migrate() {
    await query(`CREATE TABLE IF NOT EXISTS notices (
      id bigint NOT NULL,
      title varchar(1000),
      timestamp bigint,
      openDate bigint,
      closeDate bigint,
      important int,
      isVisible int,
      attachments varchar(1000),
      email varchar(50) NOT NULL,
      isDept int,
      department varchar(1000),
      PRIMARY KEY (id)
    );`).catch((e) => console.log(e))

    await query(`create table if not exists news (
                id bigint NOT NULL,
                title varchar(1000),
                timestamp bigint,
                openDate bigint,
                closeDate bigint,
                description varchar(1000),
                attachments varchar(1000),
                author varchar(1000),
                email varchar(50) NOT NULL,
                PRIMARY KEY (id)
            )`).catch((e) => console.log(e))

    await query(`create table if not exists innovation (
                id bigint NOT NULL,
                title varchar(1000),
                timestamp bigint,
                openDate bigint,
                closeDate bigint,
                description varchar(1000),
                attachments varchar(1000),
                author varchar(1000),
                email varchar(50) NOT NULL,
                PRIMARY KEY (email)
            )`).catch((e) => console.log(e))

    await query(`create table if not exists faculty_image (
                email varchar(50),
                image varchar(1000),
                PRIMARY KEY(email),
                UNIQUE KEY(email)
            )`).catch((e) => console.log(e))

    await query(`create table if not exists project (
            id bigint NOT NULL,
            email varchar(100),
            project text NOT NULL,
            sponsor text NOT NULL,
            amount text NOT NULL,
            start text,
            end text,
            PRIMARY KEY(id)
    );`).catch((e) => console.log(e))

    await query(`create table if not exists phd_candidates (
            id bigint NOT NULL,
            email varchar(100),
            phd_student_name text NOT NULL,
            thesis_topic text NOT NULL,
            start_year varchar(10) NOT NULL,
            completion_year varchar(10) NOT NULL,
            PRIMARY KEY(id)
        );`).catch((e) => console.log(e))

    await query(`create table if not exists professional_service (
            id bigint NOT NULL,
            email varchar(100),
            services text NOT NULL,
            PRIMARY KEY(id)
        );`).catch((e) => console.log(e))

    await query(`create table if not exists publications (
                id bigint NOT NULL,
                email varchar(100),
                publications mediumtext NOT NULL,
                PRIMARY KEY(id)
            );`).catch((e) => console.log(e))

    await query(`create table if not exists subjects_teaching(
                id bigint NOT NULL,
                email varchar(100),
                code text NOT NULL,
                name text NOT NULL,
                start text NOT NULL,
                end bigint,
                PRIMARY KEY(id)
            );`).catch((e) => console.log(e))

    await query(`create table if not exists users (
                id int NOT NULL AUTO_INCREMENT,
                name varchar(50),
                email varchar(100),
                role int(1),
                department varchar(100),
                designation varchar(100),
                ext_no bigint,
                image varchar(1000),
                research_interest text,
                PRIMARY KEY (id),
                UNIQUE KEY (email)
            )AUTO_INCREMENT=1000;
`).catch((e) => console.log(e))

    await query(``).catch((e) => console.log(e))

    await query(`create table if not exists curr_admin_responsibility (
                id bigint NOT NULL,
                email varchar(100),
                curr_responsibility text NOT NULL,
                start text,
                PRIMARY KEY(id)
            );`).catch((e) => console.log(e))

    await query(`CREATE TABLE if not exists past_admin_responsibility (
                id bigint NOT NULL,
                email varchar(100),
                past_responsibility text NOT NULL,
                start text,
                end text,
                PRIMARY KEY(id)
            );`).catch((e) => console.log(e))

    await query(`CREATE TABLE if not exists education (
                id bigint NOT NULL,
                email varchar(100),
                certification varchar(10) NOT NULL,
                institution text NOT NULL,
                passing_year varchar(10) DEFAULT NULL,
                PRIMARY KEY(id)
            );`).catch((e) => console.log(e))

    await query(`create table if not exists events (
                id bigint NOT NULL,
                title varchar(1000),
                timestamp bigint,
                openDate bigint,
                closeDate bigint,
                venue varchar(1000),
                doclink varchar(500),
                attachments varchar(1000),
                email varchar(50) NOT NULL,
                PRIMARY KEY (id))`).catch((e) => console.log(e))

    await query(`CREATE TABLE if not exists memberships (
                id bigint NOT NULL,
                email varchar(100),
                membership_id varchar(20) NOT NULL,
                membership_society text NOT NULL,
                start text,
                end text,
                PRIMARY KEY(id)
            );`).catch((e) => console.log(e))
// Create patents table
await query(`CREATE TABLE IF NOT EXISTS patents (
    id bigint NOT NULL AUTO_INCREMENT,
    title varchar(1000),
    description text,
    patent_date date,
    email varchar(50) NOT NULL,
    PRIMARY KEY (id),
    
);`).catch((e) => console.log(e));
    console.log('migration ran successfully')
}

migrate().then(() => process.exit())
