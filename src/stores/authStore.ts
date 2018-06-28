import { action, observable } from 'mobx';
import { UserAgentApplication } from 'msal';
import { debugConfig as config } from '../config';

export class AuthStore {
    @observable public isLoggedIn = false;
    @observable public loginInProgress = false;
    @observable public username = '';
    @observable public userEmailAddress = '';

    private applicationConfig = {
        clientID: config.appId,
        graphScopes: ['user.read', 'mail.send', 'openid', 'profile']
    };

    private userAgentApplication = new UserAgentApplication(
        this.applicationConfig.clientID,
        null,
        null,
        {
            redirectUri: config.redirectUri
        }
    );

    constructor() {
        this.loginInProgress = true;
        this.userAgentApplication
            .acquireTokenSilent(this.applicationConfig.graphScopes)
            .then(action(() => (this.isLoggedIn = true)))
            .catch(action(() => (this.isLoggedIn = false)))
            .finally(action(() => (this.loginInProgress = false)));
    }

    @action
    public login() {
        this.loginInProgress = true;
        this.userAgentApplication
            .loginPopup(this.applicationConfig.graphScopes)
            .then(() =>
                this.userAgentApplication.acquireTokenSilent(
                    this.applicationConfig.graphScopes
                )
            )
            .catch(() => {
                return this.userAgentApplication.acquireTokenPopup(
                    this.applicationConfig.graphScopes
                );
            })
            .then(action(() => (this.isLoggedIn = true)))
            .catch(() => {
                // log in failed;
            });
    }

    @action
    public setUsername(username: string) {
        if (username) {
            this.username = username;
        }
    }

    @action
    public setUserEmail(email: string) {
        if (email) {
            this.userEmailAddress = email;
        }
    }

    @action
    public logout() {
        sessionStorage.clear();
        this.isLoggedIn = false;
    }
}

export default new AuthStore();
