// Define the different models specific to the interface

const userTypes = {
    admin: 'ADMIN',
    standard: 'STANDARD'
};

const transferType = {
  upload: 'UPLOAD',
  download: 'DOWNLOAD'
};

const userModel = {
    type: userTypes.standard,
    username: '',
    token: null,
    created: new Date()
};

const carrierJobModel = {
    jobId: null,
    type: '',
    files:[],
    requester: '',
    numberOfTransferredFiles: 0,
    numberOfFilesToTransfer: 0,
    created: new Date()
};

const unauthorizedAccess = {
    username: null,
    token: '',
    headers: null,
    accessTimestamp: new Date()

};

module.exports = {
    interface_models:{
        USER_MODEL: userModel,
        CARRIER_JOB_MODEL: carrierJobModel,
        UNAUTHORIZED_ACCESS_MODEL: unauthorizedAccess
    },
    interface_constants: {
        USER_TYPE: userTypes,
        TRANSFER_TYPE: transferType
    }
};
