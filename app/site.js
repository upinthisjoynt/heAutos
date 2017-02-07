/**
 * Express Web Server
 * @type {object}
 */
var oExpress = require('express')
/**
 * MongoDB Server
 * @type {[type]}
 */
, oMongoDB = require('mongodb')
/**
 * Url for the mongo DB server
 * @type {string}
 */
, sMongoUrl = 'mongodb://localhost:27017/test'
/**
 * Mongo connection client
 * @type {object}
 */
, oMongo = oMongoDB.MongoClient
/**
 * Express API 
 * @type {object}
 */
, oApp = oExpress()
/**
 * Url Slug
 * @type {string}
 */
, sSlug
/**
 * Static JS file lcaton
 * @type {string}
 */
, sJsLoc = oExpress.static('js')
/**
 * Static CSS file location
 * @type {string}
 */
, sCssLoc = oExpress.static('css')
/**
 * Static Image file location
 * @type {string}
 */
, sImgLoc = oExpress.static('images')
/**
 * Method to handle all error handling
 * @method    fnError
 * @param     {string}              sMessage                 Error Message
 * @param     {object}              oError                   Error Object
 * @param     {object}              oData                    Error Data 
 * @param     {object}              oDB                      Database
 * @returns   {Function}                                     consoled log
 * @author 	Addam Driver <addam.driver@devcrapshoot.com>
 * @added     2017-02-07
 * @version   1.0
 * @memberOf  autos
 * @since     1.0.0
 * @example   <caption>Log an Error</caption>
 *  fnError("This is causing problems", {...}, {...}); // will log an error to the console
 */
, fnError = function(sMessage, oError, oData, oDB) {
	//Close connection
	oDB.close();
	
	// return a log
	return console.log(sMessage, oError, oData);
}
/**
 * Method to send found data to the requestor
 * @method    fnSendData
 * @param     {object}              oData                    Data to send
 * @param     {object}              oDB                      Database
 * @param     {object}              oRes                     Initial Request Response
 * @returns   {Function}                                     Request response send
 * @author Addam Driver <addam.driver@devcrapshoot.com>
 * @added     2017-02-07
 * @version   1.0
 * @memberOf  autos
 * @since     1.0.0
 * @example   <caption>Send data to the requestor</caption>
 * fnSendData({Data}, {DB}, {ReqRes}); // will close the DB connection and send the data to the requestor
 */
, fnSendData = function (oData, oDB, oRes) {
	//Close connection
	oDB.close();

	// return the data
	return oRes.send(oData);
}
/**
 * Callback method when connecting to a DB
 * @method    fnConnect
 * @param     {object}              oError                   Error Object from Db
 * @param     {object}              oDB                      Database
 * @param     {object}              oRes                     Request Response
 * @property {object} oVehicles Database collection data
 * @property {function} fnSendVehicles Method to send vehicle information to the client
 * @returns   {Function}                                     Vehicle find query request
 * @author Addam Driver <addam.driver@devcrapshoot.com>
 * @added     2017-02-07
 * @version   1.0
 * @memberOf  autos
 * @nameSpace autos.fnConnect
 * @since     1.0.0
 * @example   <caption>Callback to handle requests</caption>
 * oMongo.connect(sMongoUrl, fnConnect); // callback for this connect
 */
, fnConnect = function (oError, oDB, oRes) {
	// fail fast if there's an error
	if (oError) {
		fnError('Unable to connect to the mongoDB server. Error:', oError, oDB);
	}

	// get the vehicles
	var oVehicles = oDB.collection('vehicles')
	/**
	 * Method to send the vehicle information to the client
	 * @method    fnSendVehicles
	 * @param     {object}              oVehError                Vehicle error object
	 * @param     {object}              oData                    Data from the request
	 * @returns   {Function}                                     error or success response
	 * @author Addam Driver <addam.driver@devcrapshoot.com>
	 * @added     2017-02-07
	 * @version   1.0
	 * @memberOf  autos.fnConnect
	 * @since     1.0.0
	 * @example   <caption>Send Vehicle Information</caption>
	 * fnSendVehicles({error}, {data}); // send data to error or to the requestor
	 */
	, fnSendVehicles = function (oVehError, oData) {
		// fail fast if there's an error
		if (oVehError) {
			return fnError('Problem with the data query. Error:', oVehError, oData, oDB);
		}

		// if there's data
		if (oData && oData.length) {
			// send the data to the UI
			return fnSendData(oData, oDB, oRes);
		} 

		// send an error message if no data found
		return fnSendData('No document(s) found.');
	};

	// Find, parse and send to method when ready
	return oVehicles.find().toArray(fnSendVehicles);

}
/**
 * Method to get the auto mobile data
 * @method    fnGetVehicles
 * @param     {object}              oRes                     Object response data
 * @returns   {Function}                                     Connector method
 * @author Addam Driver <addam.driver@devcrapshoot.com>
 * @added     2017-02-07
 * @version   1.0
 * @memberOf  autos
 * @since     1.0.0
 * @example   <caption>Get the Vehicles</caption>
 * fnGetVehicles({Response}); // connects to the db and processes the data
 */
, fnGetVehicles = function (oRes) {
	// connect to mongo
	oMongo.connect(sMongoUrl, function(oError, oDB) {
		
		// launch the connection
		return fnConnect(oError, oDB, oRes);
	});

	return;
}
/**
 * Method to check the url slug and determine where to go & what to do
 * @method    fnCheckSlug
 * @param     {object}              oReq                     Object request data
 * @param     {object}              oRes                     Object response data
 * @returns   {Function}                                     Method for slug or send requested files
 * @author Addam Driver <addam.driver@devcrapshoot.com>
 * @added     2017-02-07
 * @version   1.0
 * @memberOf  autos
 * @since     1.0.0
 * @example   <caption>Check the slug values</caption>
 * oApp.get('/:slug', fnCheckSlug); // will check the url slug and determine where to go & what to do
 */
, fnCheckSlug = function(oReq, oRes) {
	// get the slug being passed in
	sSlug = [oReq.params.slug][0];

	// if this is a data call
	if (sSlug === 'data') {

		// send to get the autos
		return fnGetVehicles(oRes);
	}

	// send the files
    return oRes.sendfile(sSlug);
}
;
// get the requestor slug
oApp.get('/:slug', fnCheckSlug);

// route for js/css/images files
oApp.use('/js', sJsLoc);
oApp.use('/css', sCssLoc);
oApp.use('/images', sImgLoc);

// listen on 9000
oApp.listen(9000);