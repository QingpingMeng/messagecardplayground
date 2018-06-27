require('dotenv').config();
const path = require('path');
const fs = require('fs');
const account = process.env.AZURE_STORAGE_ACCOUNT;
const key = process.env.AZURE_STORAGE_ACCESS_KEY;
const cs = process.env.AZURE_STORAGE_CONNECTION_STRING;
const container = process.env.AZURE_STORAGE_CONTAINER_NAME;

const azure = require('azure-storage-simple')(account || cs, key || null);

if(!azure){
    console.error("Couldn't connect azure storage service.");
    process.exit(1);
}
const blobService = azure.createBlobService();
const buildFolder = './build/';

const uploadFile = (blobSvc, targetFile, sourceFile) => {
    console.log("Uploading:", targetFile, sourceFile);
    blobSvc.createBlockBlobFromLocalFile(container, targetFile, sourceFile,
        function (error, result, response) {
            if (error) {
                console.log(error);
            }
        });
};

const deploy = function (folder, curPath = ".") {
    fs.readdir(folder, function (err, files) {
        if (err) {
            console.error("Could find build directory.", err);
            process.exit(1);
        }

        files.forEach(function (file, index) {
            const sourcePath = path.join(folder, file);
            fs.stat(sourcePath, function (error, stat) {
                if (error) {
                    console.error("Error stating file.", error);
                    return;
                }

                if (stat.isFile()) {
                    uploadFile(blobService, curPath + "/" + file, sourcePath);
                } else if (stat.isDirectory()) {
                    deploy(sourcePath, curPath + "/" + file);
                }
            })
        })
    })
};

deploy(buildFolder);
