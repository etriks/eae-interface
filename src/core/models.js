// Define the different models specific to the interface

const userTypes = {
    admin: 'ADMIN',
    standard: 'STANDARD'
};

const userModel = {
    type : userTypes.standard,
    username : '',
    token : null,
    created: new Date(0)
};

const unauthorizedAccess = {
    username : null,
    token: '',
    headers : null,
    accessTimestamp: new Date(0)

};

module.exports = {
    interface_models:{
        USER_MODEL: userModel,
        UNAUTHORIZED_ACCESS_MODEL: unauthorizedAccess
    },
    interface_constants: {
        USER_TYPE: userTypes
    }
};