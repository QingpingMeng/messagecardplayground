import { action, observable, computed } from 'mobx';
import { UserAgentApplication } from 'msal';
import { debugConfig, prodConfig } from '../config';

const config = process.env.NODE_ENV === 'production' ? prodConfig : debugConfig;

export class AuthStore {
    @observable public isLoggedIn = false;
    @observable public loginInProgress = false;

    @computed
    public get username() {
        if (this.isLoggedIn) {
            return this.userAgentApplication.getUser().name;
        } else {
            return undefined;
        }
    }

    @computed
    public get userEmailAddress() {
        if (this.isLoggedIn) {
            return this.userAgentApplication.getUser().displayableId;
        } else {
            return undefined;
        }
    }

    private applicationConfig = {
        clientID: config.appId,
        graphScopes: ['https://outlook.office.com/mail.send', 'openid', 'profile']
    };

    private userAgentApplication = new UserAgentApplication(
        this.applicationConfig.clientID,
        null,
        null,
        {
            cacheLocation: 'localStorage',
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
            })
            .finally(action(() => this.loginInProgress = false));
    }

    @action
    public logout() {
        localStorage.clear();
        this.isLoggedIn = false;
    }

    public getAccessToken() {
        return this.userAgentApplication
            .acquireTokenSilent(this.applicationConfig.graphScopes)
            .catch(() => {
                return this.userAgentApplication.acquireTokenPopup(
                    this.applicationConfig.graphScopes
                );
            });
    }
}

export default new AuthStore();
