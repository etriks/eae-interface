// const { interface_models, interface_constants } = require('../core/models.js');
const { ErrorHelper, Constants } = require('eae-utils');
const ObjectID = require('mongodb').ObjectID;

/**
 * @fn Utils
 * @desc Manages the job from the Created status to the Queued status (from which the scheduler takes over)
 * @param jobsCollection
 * @param algorithmHelper
 * @constructor
 */
function JobsManagement(jobsCollection, algorithmHelper) {
    let _this = this;
    _this._jobsCollection = jobsCollection;
    _this._algoHelper = algorithmHelper;

    // Bind member functions
    _this.cancelJob = JobsManagement.prototype.cancelJob.bind(this);
    _this.checkFields = JobsManagement.prototype.checkFields.bind(this);
}


/**
 * @fn cancelJob
 * @desc Sets the status of a job to cancelled. It then gets picked up by the scheduler for processing.
 * @param job
 * @returns {Promise}
 */
JobsManagement.prototype.cancelJob = function(job){
    let _this = this;

    return new Promise(function(resolve, reject) {
        job.status.unshift(Constants.EAE_JOB_STATUS_CANCELLED);
        _this._jobsCollection.findOneAndUpdate({_id: ObjectID(job._id)},
            {$set: job},
            {returnOriginal: false, w: 'majority', j: false})
            .then(function (res) {
                resolve({res: res, cancelledJob: job});
            }, function (error) {
                reject(ErrorHelper('Could not cancel the job.', error));
            });
    });
};

/**
 * @fn checkFields
 * @desc Checks that all mandatory fields and params are valid for the specified algorithm.
 * @param jobRequest
 * @returns {Promise}
 */

JobsManagement.prototype.checkFields = function(jobRequest){
    let _this = this;

    return new Promise(function(resolve, reject) {
        // We check the core parameters


        // We check the core parameters
        let terminateCreation = false;
        requiredJobFields.forEach(function(key){
            if(requiredJobFields[key] === null){
                res.status(401);
                res.json(ErrorHelper('Job request is not well formed. Missing ' + requiredJobFields[key]));
                terminateCreation = true;
            }
            if(key === 'type'){
                let listOfSupportedComputations = [Constants.EAE_COMPUTE_TYPE_PYTHON2, Constants.EAE_COMPUTE_TYPE_R,
                    Constants.EAE_COMPUTE_TYPE_TENSORFLOW, Constants.EAE_COMPUTE_TYPE_SPARK];
                if(!(listOfSupportedComputations.includes(jobRequest[key]))) {
                    res.status(405);
                    res.json(ErrorHelper('The requested compute type is currently not supported. The list of supported computations: ' +
                        Constants.EAE_COMPUTE_TYPE_PYTHON2 + ', ' + Constants.EAE_COMPUTE_TYPE_SPARK + ', ' + Constants.EAE_COMPUTE_TYPE_R + ', ' +
                        Constants.EAE_COMPUTE_TYPE_TENSORFLOW));
                    terminateCreation = true;
                }
            }
        })
        resolve(true);
    });
};

module.exports = JobsManagement;
