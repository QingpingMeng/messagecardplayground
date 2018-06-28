// import { action, observable, reaction, computed } from 'mobx';

// export class UserStore{

//     @action
//     public sendEmail(payload: string){
//         const payloadObj = JSON.parse(payload);
//         payloadObj['@type'] = payloadObj['@type'] || payloadObj.type;
//         payloadObj['@context'] = payload['@context'] || 'http://schema.org/extensions';
//         if (!payloadObj['@type']) {
//             return;
//         }
//         const emailScriptType = payloadObj['@type'].toLowerCase() === 'adaptivecard' ? 'adaptivecard' : 'ld';

//     }
// }