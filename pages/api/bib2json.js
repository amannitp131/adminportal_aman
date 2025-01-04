import BibtexParser from 'bib2json'
import multer from 'multer'
import { getSession } from 'next-auth/client'
import { query } from '../../lib/db'

export const config = {
    api: {
        bodyParser: false,
    },
}

const upload = multer()

function journal(title, authors, journal_name, year, citation_key) {
    this.type = 'article'
    this.title = title || ''
    this.authors = authors || ''
    this.journal_name = journal_name || ''
    this.year = year || ''
    this.citation_key = citation_key || ''
}

function book(title, authors, editors, publisher, year, citation_key) {
    this.type = 'book'
    this.title = title || ''
    this.editors = editors || ''
    this.authors = authors || ''
    this.publisher = publisher || ''
    this.year = year || ''
    this.citation_key = citation_key || ''
}

function patent(year, yearfiled, nationality, number, citation_key) {
    this.type = 'patent'
    this.year = year || ''
    this.yearfiled = yearfiled || ''
    this.nationality = nationality || ''
    this.number = number || ''
    this.citation_key = citation_key || ''
}

function conference(title, authors, booktitle, year, citation_key) {
    this.type = 'conference'
    this.title = title || ''
    this.authors = authors || ''
    this.booktitle = booktitle || ''
    this.year = year || ''
    this.citation_key = citation_key || ''
}

export default async function (request, response) {
    if (request.method == 'POST' || request.method == 'PUT') {
        const session = await getSession({ req: request })
        if (session) {
            console.log(request.body)
            upload.single('bib-file')(request, response, async (result) => {
                if (result instanceof Error) {
                    return console.log(result)
                }
                let data = []

                const text = request.file.buffer.toString()
                var entryCallback = function (entry) {
                    var field = entry.Fields
                    if (entry.EntryType == 'article') {
                        data.push(
                            new journal(
                                field.title,
                                field.author,
                                field.journal,
                                field.year,
                                entry.EntryKey
                            )
                        )
                    } else if (entry.EntryType == 'book') {
                        data.push(
                            new book(
                                field.title,
                                field.author,
                                field.editor,
                                field.publisher,
                                field.year,
                                entry.EntryKey
                            )
                        )
                    } else if (
                        entry.EntryType == 'proceedings' ||
                        entry.EntryType == 'conference' ||
                        entry.EntryType == 'inproceedings'
                    ) {
                        data.push(
                            new conference(
                                field.title,
                                field.author,
                                field.booktitle,
                                field.year,
                                entry.EntryKey
                            )
                        )
                    } else if (entry.EntryType == 'patent') {
                        data.push(
                            new patent(
                                field.year,
                                field.yearfiled,
                                field.nationality,
                                field.number,
                                field.EntryKey
                            )
                        )
                    }
                }
                console.log(session.user)
                var parser = new BibtexParser(entryCallback)
                parser.parse(text)

                if (request.method == 'POST') {
                    data = JSON.stringify(data)
                    console.log('Hit POST')
                    let final
                    try {
                        final = await query(
                            'INSERT INTO publications (email,publication_id,publications) VALUES (?,?,?);',
                            [session.user.email, `${Date.now()}`, data],
                            (err) => console.log(err)
                        )
                    } catch (err) {
                        let previous = await query(
                            'SELECT publications FROM publications WHERE email=?',
                            [session.user.email]
                        )
                        previous = JSON.parse(JSON.stringify(previous))
                        previous = JSON.parse(previous[0].publications)

                        data = previous.concat(data)

                        final = await query(
                            'UPDATE publications SET publications = ? where email=?',
                            [data, session.user.email],
                            (err) => console.log(err)
                        )
                    }

                    return response.json(final)
                } else if (request.method == 'PUT') {
                    console.log('Hit PUT')
                    let previous = await query(
                        'SELECT publications FROM publications WHERE email=?',
                        [session.user.email]
                    )
                    previous = JSON.parse(JSON.stringify(previous))
                    previous = JSON.parse(previous[0].publications)

                    data = JSON.stringify(previous.concat(data))

                    let final = await query(
                        'UPDATE publications SET publications = ? where email=?',
                        [data, session.user.email],
                        (err) => console.log(err)
                    )
                    return response.json(final)
                }
            })
        } else
            return response.status(400).json({ message: 'Session Not found' })
    }
}
