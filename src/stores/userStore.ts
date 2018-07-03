import { action, observable, computed } from 'mobx';
import authStore from './authStore';
import editorStore from './editorStore';
import axios from 'axios';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export interface Message {
    message: string;
    messageType?: MessageBarType;
}

export class UserStore {
    @observable public isSendingEmail = false;
    @observable public userMessage: Message;
    @observable public shouldShowMessageBar = false;

    private apiEndpoint = 'https://outlook.office.com/api/v2.0';

    @computed
    get canSendMail() {
        return authStore.isLoggedIn && !this.isSendingEmail;
    }

    @action
    public showMessageBar(message: Message) {
        this.userMessage = message;
        this.shouldShowMessageBar = true;
    }

    @action
    public hideMessageBar() {
        this.shouldShowMessageBar = false;
        this.userMessage = undefined;
    }

    @action
    public sendEmail() {
        const payload = editorStore.payloadText;
        this.isSendingEmail = true;
        const payloadObj = JSON.parse(payload);
        payloadObj['@type'] = payloadObj['@type'] || payloadObj.type;
        payloadObj['@context'] =
            payload['@context'] || 'http://schema.org/extensions';
        if (!payloadObj['@type']) {
            return;
        }
        const emailScriptType =
            payloadObj['@type'].toLowerCase() === 'adaptivecard'
                ? 'adaptivecard'
                : 'ld';
        authStore
            .getAccessToken()
            .then(accessToken => {
                const mail = {
                    Subject:
                        payloadObj.cardName ||
                        'MessageCard Playground Test Card',
                    ToRecipients: [
                        {
                            EmailAddress: {
                                Address: authStore.userEmailAddress
                            }
                        }
                    ],
                    Body: {
                        Content:
                            '<html>' +
                            '  <head>' +
                            // tslint:disable-next-line:max-line-length
                            `    <script type="application/${emailScriptType}+json">${JSON.stringify(
                                payloadObj
                            )}</script>` +
                            '  </head>' +
                            '  <body>' +
                            // tslint:disable-next-line:max-line-length
                            'This message was sent from the <a target="_blank" href="https://messagecardplayground.azurewebsites.net/">MessageCard Playground</a> tool.<br><br>' +
                            // tslint:disable-next-line:max-line-length
                            'If the card doesn&#39;t appear, your email client doesn&#39;t support Actionable Messages. Go to the <a target="_blank" href="https://docs.microsoft.com/en-us/outlook/actionable-messages/">Outlook Dev Center</a> to learn more.<br><br>' +
                            'JSON payload of the card attached to this message:<br><br>' +
                            // tslint:disable-next-line:max-line-length
                            '<div style="font-family: Courier New; font-size: 14px; background-color: #E5E5E5; padding: 10px;">' +
                            JSON.stringify(
                                JSON.parse(payload),
                                undefined,
                                '\t'
                            ) +
                            '</div>' +
                            '  </body>' +
                            '</html>',
                        ContentType: 'html'
                    }
                };

                return axios.post(
                    `${this.apiEndpoint}/me/sendmail`,
                    {
                        Message: mail,
                        SaveToSentItems: false
                    },
                    {
                        headers: {
                            'return-client-request-id': `true`,
                            'x-anchormailbox': authStore.userEmailAddress,
                            authorization: `Bearer ${accessToken}`
                        }
                    }
                );
            })
            .then(
                action(() => {
                    this.showMessageBar({message: 'The card was successfully sent.'});
                })
            )
            .catch(error => {
                    this.showMessageBar({message: `Something went wrong, the email couldn't be sent.`});
            })
            .finally(
                action(() => {
                    this.isSendingEmail = false;
                })
            );
    }
}

export default new UserStore();
