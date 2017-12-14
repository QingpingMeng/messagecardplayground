/* tslint:disable */
import {debugConfig, prodConfig} from '../config';
const authEndpoint = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?';
const config = process.env.NODE_ENV === "production"? prodConfig : debugConfig;
const scopes = 'openid profile User.Read Mail.Send';
const swal = require('sweetalert2');

export function guid() {
    var buf = new Uint16Array(8);
    const cryptObj = window.crypto || window["msCrypto"];
    cryptObj.getRandomValues(buf);
    function s4(num:number) {
        var ret = num.toString(16);
        while (ret.length < 4) {
            ret = '0' + ret;
        }
        return ret;
    }
    return s4(buf[0]) + s4(buf[1]) + '-' + s4(buf[2]) + '-' + s4(buf[3]) + '-' +
        s4(buf[4]) + '-' + s4(buf[5]) + s4(buf[6]) + s4(buf[7]);
}

export function getAccessToken() {
    const getAccessTokenPromise = new Promise((resolve, reject) => {
        const now = new Date().getTime();
        const isExpired = now > parseInt(sessionStorage.tokenExpires, 10);

        if (sessionStorage.accessToken && !isExpired) {
            resolve(sessionStorage.accessToken);
        } else {
            redirectToAad();
        }
    });

    return getAccessTokenPromise;
}

export function parseHashParams(hash:string):any {
    var params = hash.slice(1).split('&');

    var paramarray = {};
    params.forEach(function (param) {
        const paramPair = param.split('=');
        paramarray[paramPair[0]] = paramPair[1];
    });

    return paramarray;
}

function redirectToAad() {
    window.location.href = buildAuthUrl() + '&prompt=none&domain_hint=' +
        sessionStorage.userDomainType + '&login_hint=' +
        sessionStorage.userSigninName;
}

export function handleAuth() {
    const action = window.location.hash.split('=')[0];
    const pageMap = {
        '#error': function () {
            var errorresponse= parseHashParams(window.location.hash);
            if (errorresponse.error === 'login_required' ||
                errorresponse.error === 'interaction_required') {
                // For these errors redirect the browser to the login
                // page.
                window.location.href = buildAuthUrl();
            } else {
                renderError(errorresponse.error, errorresponse.error_description);
            }
        },
        '#login': function () {
            getAccessToken().then(()=>{
                window.location.hash = '#';
            })
        },
        '#logout': function () {
            sessionStorage.clear();
            // Redirect to home page
            window.location.hash = '#';
        },
        // Receive access token
        '#access_token': function () {
            handleTokenResponse(window.location.hash);
        },
    }

    if (pageMap[action]) {
        pageMap[action]();
    } else {
        // Redirect to home page
        window.location.hash = '#';
    }
}

export function renderError(error:string, description:string) {
    var title = decodePlusEscaped(error);
    var text = decodePlusEscaped(description);
    swal({title: title, text: text, type: "error"});
}

export function buildAuthUrl() {
    // Generate random values for state and nonce
    sessionStorage.authState = guid();
    sessionStorage.authNonce = guid();

    var authParams = {
        response_type: 'id_token token',
        client_id: config.appId,
        redirect_uri: config.redirectUri,
        scope: scopes,
        state: sessionStorage.authState,
        nonce: sessionStorage.authNonce,
        response_mode: 'fragment'
    };

    return authEndpoint + Object.keys(authParams).map(key => {
        return encodeURIComponent(key) + "=" + encodeURIComponent(authParams[key])
    }).join('&');
}

function decodePlusEscaped(value: string) {
    // decodeURIComponent doesn't handle spaces escaped
    // as '+'
    if (value) {
      return decodeURIComponent(value.replace(/\+/g, ' '));
    } else {
      return '';
    }
  }

function handleTokenResponse(hash: string) {
    // clear tokens
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('idToken');

    var tokenresponse = parseHashParams(hash);

    // Check that state is what we sent in sign in request
    if (tokenresponse.state != sessionStorage.authState) {
        sessionStorage.removeItem('authState');
        sessionStorage.removeItem('authNonce');
        // Report error
        window.location.hash = '#error=Invalid+state&error_description=The+state+in+the+authorization+response+did+not+match+the+expected+value.+Please+try+signing+in+again.';
        return;
    }

    sessionStorage.authState = '';
    sessionStorage.accessToken = tokenresponse.access_token;

    // Get the number of seconds the token is valid for,
    // Subract 5 minutes (300 sec) to account for differences in clock settings
    // Convert to milliseconds
    var expiresin = (parseInt(tokenresponse.expires_in) - 300) * 1000;
    var now = new Date();
    var expireDate = new Date(now.getTime() + expiresin);
    sessionStorage.tokenExpires = expireDate.getTime();

    sessionStorage.idToken = tokenresponse.id_token;

    validateIdToken(function (isValid:boolean) {
        if (isValid) {
            // Redirect to home page
            window.location.hash = '#';
        } else {
            sessionStorage.clear();
            // Report error
            window.location.hash = '#error=Invalid+ID+token&error_description=ID+token+failed+validation,+please+try+signing+in+again.';
        }
    });
}

function validateIdToken(callback:(foo:boolean)=>void) {
    // Per Azure docs (and OpenID spec), we MUST validate
    // the ID token before using it. However, full validation
    // of the signature currently requires a server-side component
    // to fetch the public signing keys from Azure. This sample will
    // skip that part (technically violating the OpenID spec) and do
    // minimal validation

    if (null == sessionStorage.idToken || sessionStorage.idToken.length <= 0) {
        callback(false);
    }

    // JWT is in three parts seperated by '.'
    var tokenParts = sessionStorage.idToken.split('.');
    if (tokenParts.length != 3) {
        callback(false);
    }

    // Parse the token parts
    var base64 = require('base-64');
    var payload = JSON.parse(base64.decode(tokenParts[1]));

    // Check the nonce
    if (payload.nonce != sessionStorage.authNonce) {
        sessionStorage.authNonce = '';
        callback(false);
    }

    sessionStorage.authNonce = '';

    // Check the audience
    if (payload.aud != config.appId) {
        callback(false);
    }

    // Check the issuer
    // Should be https://login.microsoftonline.com/{tenantid}/v2.0
    if (payload.iss !== 'https://login.microsoftonline.com/' + payload.tid + '/v2.0') {
        callback(false);
    }

    // Check the valid dates
    var now = new Date();
    // To allow for slight inconsistencies in system clocks, adjust by 5 minutes
    var notBefore = new Date((payload.nbf - 300) * 1000);
    var expires = new Date((payload.exp + 300) * 1000);
    if (now < notBefore || now > expires) {
        callback(false);
    }

    // Now that we've passed our checks, save the bits of data
    // we need from the token.

    sessionStorage.userDisplayName = payload.name;
    sessionStorage.userSigninName = payload.preferred_username;

    // Per the docs at:
    // https://azure.microsoft.com/en-us/documentation/articles/active-directory-v2-protocols-implicit/#send-the-sign-in-request
    // Check if this is a consumer account so we can set domain_hint properly
    sessionStorage.userDomainType =
        payload.tid === '9188040d-6c67-4c5b-b112-36a304b66dad' ? 'consumers' : 'organizations';

    callback(true);
}
