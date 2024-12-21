import { google } from 'googleapis'
import multer from 'multer'
import { getSession } from 'next-auth/client'
import { authorize, authorized, getAccessToken } from './authorize'
import stream from 'stream'

export const config = {
    api: {
        bodyParser: false,
    },
}
const upload = multer()

//create function to pass file data buffer to stram and create bufferStream
const bufferToStream = (buffer) => {
    const bufferStream = new stream.PassThrough()
    bufferStream.end(buffer)
    return bufferStream
}

export default async function UploadFiles(request, response) {
    if (request.method === 'POST') {
        const session = await getSession({ req: request })
        if (session) {
            // console.log("Triggered Upload route");
            if (!authorized) {
                authorize()
            }
            // Signed In
            upload.array('files')(request, response, async (result) => {
                if (result instanceof Error) {
                    return console.log(result)
                }

                const drive = google.drive({ version: 'v3' })
                const files = request.files
                // console.log(request);
                let finalResult = []

                for (let index = 0; index < files.length; index++) {
                    const file = files[index]

                    const bufferStream = bufferToStream(file.buffer)

                    var media = {
                        mimeType: file.mimetype,
                        body: bufferStream,
                    }
                    // const driveRes = await drive.files.create({
                    // 	requestBody: {
                    // 		name: file.originalname,
                    // 		parents: [process.env.FOLDER_ID],
                    // 	},
                    // 	media: media,
                    // 	fields: "id,name,webViewLink",
                    // }).catch(async(err) => {
                    // 	console.log(err.message);
                    // 	console.log("Requires new token generation. Contact administrator");
                    // 	await getAccessToken();
                    // 	return response.status(500).json({"error": err.message});

                    // });

                    // await finalResult.push(driveRes.data);

                    var count = 1
                    var currentResult = null
                    var requestBody = {
                        name: file.originalname,
                        parents: [process.env.FOLDER_ID],
                    }
                    var fields = 'id,name,webViewLink'
                    var uploadSingleFile = async () => {
                        await drive.files
                            .create({
                                requestBody: requestBody,
                                media: media,
                                fields: fields,
                            })
                            .then((res) => {
                                console.log('Upload Sucessfull')
                                currentResult = res.data
                                clearInterval(uploadSingleFile)
                            })
                            .catch(async (err) => {
                                console.log(err.message)
                                if (err.message == 'Invalid Credentials') {
                                    console.log(
                                        'Requires new token generation. Contact administrator'
                                    )
                                    await getAccessToken()
                                } else {
                                    console.log(`Retrying upload ${count} of 5`)
                                }
                                count++
                            })
                    }

                    await uploadSingleFile()

                    while (currentResult == null && count < 5) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                        )
                        await uploadSingleFile()
                    }

                    if (currentResult == null) {
                        console.log('Upload Failed')
                    } else {
                        finalResult.push(currentResult)
                    }
                }

                console.log('Sending Response')
                // response.send("Upload Sucessfull");
                if (!response.ok) {
                    if (response.status === 413) {
                        // Request Entity Too Large error
                        // Show toaster alert
                        alert("File size exceeds the maximum limit. Please upload a smaller file.");
                    } else {
                        // Handle other errors
                        alert("An error occurred while uploading the file.");
                    }
                    return;
                }
                if (finalResult.length == 0) {
                    response.status(500).json({ error: 'Upload Failed' })
                } else {
                    console.log(finalResult)
                    response.json(finalResult)
                }
            })
        } else {
            // Not Signed In
            response.status(401)
        }
    } else {
        response.status(403)
    }
}
