import { SEND_EMAIL_SUCCESS, SEND_EMAIL_ERROR, SEND_EMAIL_START } from './index';
import axios from 'axios';
import { getAccessToken } from './auth';

const apiEndpoint = 'https://outlook.office.com/api/v2.0';

export function getUserEmailAddress(): Promise<string> {
    const getUserEmailAddressPromise = new Promise<string>((resolve, reject) => {
        if (localStorage.userEmail) {
            resolve(localStorage.userEmail);
        } else {
            // Call the Outlook API /Me to get user email address
            axios.get(`${apiEndpoint}/Me`)
                .then((response) => {
                    localStorage.setItem('userEmail', response.data.EmailAddress);
                    localStorage.setItem('userDisplayName', response.data.userDisplayName);
                    resolve(response.data.EmailAddress);
                })
                .catch((reason) => {
                    reject(reason);
                });
        }
    });

    return getUserEmailAddressPromise;
}

export function sendEmail(payload: string) {
    return dispatch => {
        dispatch({
            type: SEND_EMAIL_START
        });
        const payloadObj = JSON.parse(payload);
        payloadObj['@type'] = payloadObj['@type'] || payloadObj.type;
        payloadObj['@context'] = payload['@context'] || 'http://schema.org/extensions';
        getAccessToken()
            .then(() => getUserEmailAddress())
            .then((maillAddress: string) => {
                const mail = {
                    Subject: payloadObj.cardName || 'MessageCard Playground Test Card',
                    ToRecipients: [{
                        EmailAddress: {
                            Address: maillAddress
                        }
                    }],
                    Body: {
                        Content:
                            '<html>' +
                            '  <head>' +
                            '    <script type="application/ld+json">' + JSON.stringify(payloadObj) + '</script>' +
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

                return axios.post(
                    `${apiEndpoint}/me/sendmail`,
                    {
                        Message: mail,
                        SaveToSentItems: false
                    },
                    {
                        headers: {
                            'return-client-request-id': `true`,
                            'X-AnchorMailbox': maillAddress,
                            contentType: 'application/json; charset=utf-8',
                        }
                    });
            })
            .then(() => {
                dispatch({
                    type: SEND_EMAIL_SUCCESS
                });
            })
            .catch((reason) => {
                dispatch({
                    type: SEND_EMAIL_ERROR,
                    payload: reason.message
                });
            });
    };
}