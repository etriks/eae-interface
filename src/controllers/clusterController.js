const { interface_constants } = require('../core/models.js');
const { ErrorHelper } = require('eae-utils');
const Cluster = require('../core/cluster.js');

/**
 * @fn ClusterController
 * @desc Controller to manage the cluster service
 * @param statusCollection
 * @param usersCollection
 * @constructor
 */
function ClusterController(statusCollection, usersCollection) {
    let _this = this;
    _this._statusCollection = statusCollection;
    _this._usersCollections = usersCollection;

    // Bind member functions
    _this.getServicesStatus = ClusterController.prototype.getServicesStatus.bind(this);
}

/**
 * @fn getServicesStatus
 * @desc Checks that the request is coming from an Admin and sends back the statuses of all the services in the cluster.
 * @param req
 * @param res
 */
ClusterController.prototype.getServicesStatus = function(req, res){
    let _this = this;
    let userId = req.query.userId;
    let userToken = req.query.userToken;

    if (userId === null || userId === undefined || userToken === null || userToken === undefined) {
        res.status(401);
        res.json(ErrorHelper('Missing user_id or token'));
        return;
    }
    try {
        let filter = {
            username: userId,
            token: userToken
        };
        _this._usersCollections.findOne(filter).then(function (user) {
                if(user.type === interface_constants.USER_TYPE.admin){
                    let cluster = new Cluster(_this._statusCollection);
                    cluster.getStatuses().then(function(clusterStatuses) {
                        res.status(200);
                        res.json(clusterStatuses);
                    },function(error){
                       res.status(500);
                       res.json(ErrorHelper('Internal Mongo Error', error))
                    });
                }else{
                    res.status(401);
                    res.json(ErrorHelper('The user is not authorized to access this command'));
                }
            }, function (__unused_error) {
                res.status(401);
                res.json(ErrorHelper('Unauthorized access. The unauthorized access has been logged.'));
                // Add unauthorized access
            }
        );
    }
    catch (error) { // ObjectID creation might throw
        res.status(500);
        res.json(ErrorHelper('Error occurred', error));
    }
};

module.exports = ClusterController;