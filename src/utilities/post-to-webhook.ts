import axios from 'axios';
import swal from 'sweetalert2';

function getWebhookUrl(): Promise<string> {
    var promise = new Promise<string>((resolve, reject) => {
        if (sessionStorage.webHookUrl) {
            resolve(sessionStorage.webHookUrl);
        } else {
            swal(
                {
                    title: 'Post to WebHook',
                    text: 'Enter the incoming webhook url:',
                    input: 'url',
                    showCancelButton: true,
                    inputValidator: (value) => {
                        if (!value) {
                            return 'You need to provide the url!';
                        } else {
                            return null;
                        }
                    },
                    inputPlaceholder: 'https://outlook.office.com/webhook/[id here]'
                })
                .then((result) => {
                    if (result.value) {
                        resolve(result.value);
                    }
                });
        }
    });

    return promise;
}

export function postToWebhook(payload: string) {
    getWebhookUrl().then((webhookUrl) => {
        axios.post(
            webhookUrl,
            {
                payload: payload
            },
            {
                headers: {
                    contentType: 'application/json; charset=utf-8',
                }
            })
            .then((response) => {
                sessionStorage.webHookUrl = webhookUrl;
                swal('The card was successfully sent.', 'Check your app.', 'success');
            })
            .catch((reason) => {
                swal(
                    'Something went wrong, the post request failed.',
                    'Error: ' + reason.message,
                    'error');
            });
    });
}
