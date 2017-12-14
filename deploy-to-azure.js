require('dotenv').config();
const dir = require('node-dir');
const account = process.env.AZURE_STORAGE_ACCOUNT;
const key = process.env.AZURE_STORAGE_ACCESS_KEY;
const cs = process.env.AZURE_STORAGE_CONNECTION_STRING;

const azure = require('azure-storage-simple')(account || cs, key || null);
const blobService = azure.createBlobService();

var files = dir.files(__dirname+"/build/", {sync:true});
console.log(files);

const uploadFile = (blobSvc, filePath) =>{
    blobSvc.createBlockBlobFromLocalFile('messagecard-playground', './', './build',
    function (error, result, response) {
        if(!error){
            console.log(result, response);
        }else{
            console.log(error);
        }
    });
}

//uploadFile(blobService, "");
