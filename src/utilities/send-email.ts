import axios from 'axios';
import { guid, getAccessToken } from './auth';

const apiEndpoint = 'https://outlook.office.com/api/v2.0';
const swal = require('sweetalert2');

export function sendEmail(payload: string): Promise<boolean> {
    sessionStorage.pendingEmail = payload;
    const payloadObj = JSON.parse(payload);
    const sendMailPromise = new Promise<boolean>((resolve, reject) => {
        getUserEmailAddress().then((maillAddress: string) => {
            const mail = {
                Subject: payloadObj.cardName || 'Microsoft Graph TypeScript Sample',
                ToRecipients: [{
                    EmailAddress: {
                        Address: maillAddress
                    }
                }],
                Body: {
                    Content:
                    '<html>' +
                    '  <head>' +
                    '    <script type="application/ld+json">' + payload + '</script>' +
                    '  </head>' +
                    '  <body>' +
                    // tslint:disable-next-line:max-line-length
                    'This message was sent from the <a target="_blank" href="https://messagecardplayground.azurewebsites.net/">MessageCard Playground</a> tool.<br><br>' +
                    // tslint:disable-next-line:max-line-length
                    'If the card doesn&#39;t appear, your email client doesn&#39;t support Actionable Messages. Go to the <a target="_blank" href="https://docs.microsoft.com/en-us/outlook/actionable-messages/">Outlook Dev Center</a> to learn more.<br><br>' +
                    'JSON payload of the card attached to this message:<br><br>' +
                    // tslint:disable-next-line:max-line-length
                    '<div style="font-family: Courier New; font-size: 14px; background-color: #E5E5E5; padding: 10px;">' +
                    JSON.stringify(JSON.parse(payload), undefined, '\t') +
                    '</div>' +
                    '  </body>' +
                    '</html>',
                    ContentType: 'html'
                }
            };

            return getAccessToken()
            .then((accessToken: string) => {
                return axios.post(
                    `${apiEndpoint}/me/sendmail`,
                    {
                        Message: mail,
                        SaveToSentItems: false
                    },
                    {
                        headers: {
                            Authorization: 'Bearer ' + accessToken,
                            'client-request-id': guid(),
                            'return-client-request-id': `true`,
                            'X-AnchorMailbox': maillAddress,
                            contentType: 'application/json; charset=utf-8',
                        }
                    });

            });
        }).then((respsone) => {
            swal(
                'The card was successfully sent.',
                `Check ${sessionStorage.userDisplayName}'s mailbox.`,
                'success');
        }).catch((reason) => {
            swal(
                `Something went wrong, the email couldn't be sent.`,
                `Error: ${reason.message}`,
                'error'
            );
        });
    });

    return sendMailPromise;
}

export function getUserEmailAddress(): Promise<string> {
    const getUserEmailAddressPromise = new Promise<string>((resolve, reject) => {
        if (sessionStorage.userEmail) {
            resolve(sessionStorage.userEmail);
        } else {
            getAccessToken().then((accessToken: string) => {
                if (accessToken) {
                    // Call the Outlook API /Me to get user email address
                    axios.get(`${apiEndpoint}/Me`, {
                        headers: {
                            Authorization: 'Bearer ' + accessToken,
                        }
                    }).then((response) => {
                        resolve(response.data.EmailAddress);
                    }).catch((reason) => {
                        reject(reason);
                    });
                } else {
                    var error = { responseText: 'Could not retrieve access token' };
                    reject(error);
                }
            });
        }
    });

    return getUserEmailAddressPromise;
}