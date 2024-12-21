import { google, run_v1 } from 'googleapis'
import readline from 'readline'

export let authorized = false

let TOKEN_PATH = JSON.parse(process.env.TOKEN_PATH)
console.log(TOKEN_PATH)

const SCOPES = ['https://www.googleapis.com/auth/drive']
const client_id = process.env.GOOGLE_ID
const client_secret = process.env.GOOGLE_SECRET
const redirect_uris = JSON.parse(process.env.REDIRECT_URIS).urls

const oAuth2 = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
)

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
export async function getAccessToken(oAuth2Client = oAuth2) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    })
    console.log('Authorize this app by visiting this url:', authUrl)
    const rl = await readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    rl.setPrompt('Enter the code from that page here: ')
    rl.prompt()

    return new Promise((resolve, reject) => {
        var response
        rl.on('line', (code) => {
            response = code
            rl.close()
        })

        rl.on('close', () => {
            oAuth2Client.getToken(response, (err, token) => {
                if (err)
                    return console.error('Error retrieving access token', err)
                oAuth2Client.setCredentials(token)
                // Store the token to disk for later program executions
                TOKEN_PATH = JSON.stringify(token)
                console.log('Token stored to', TOKEN_PATH)
                resolve(response)
            })
        })

        // rl.close();
        // oAuth2Client.getToken(code, (err, token) => {
        //   if (err) return console.error("Error retrieving access token", err);
        //   oAuth2Client.setCredentials(token);
        //   // Store the token to disk for later program executions
        //   TOKEN_PATH = JSON.stringify(token);
        //   console.log("Token stored to", TOKEN_PATH);
        // });
    })
}

export function authorize() {
    // console.log(redirect_uris);
    if (TOKEN_PATH) {
        oAuth2.setCredentials(TOKEN_PATH)
        google.options({ auth: oAuth2 })
        authorized = true
        console.log('Successfully Authorized') // setting auth for future requests
    } else {
        return getAccessToken(oAuth2)
    }
    // Check if we have previously stored a token.
}

export default function getAuthorized(request, response) {
    authorize()
}
