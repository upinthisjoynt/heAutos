/**
 * The Autos Module
 * @type {object}
 */
var oAutos = angular.module('autos', [])
/**
 * Controller method for the autos module
 * @method    fnAutoContoller
 * @param     {object} 		$scope	Scope object
 * @param     {object}      $http   http object
 * @returns   {void}        return nothing
 * @author    Addam Driver <addam.driver@devcrapshoot.com>
 * @added     2017-02-01
 * @version   1.0
 * @memberOf  autos
 * @nameSpace autos.fnController
 * @since     1.0. 
 * @example   <caption>Setup controller</caption>
 * oAutos.controller('autoControl', ['$scope', '$http', fnAutoContoller]); // binds the controller to this module
 */
, fnAutoContoller = function ($scope, $http) {
	/**
	 * Succeess method for http request
	 * @method    fnSuccess
	 * @param     {object}  oResponse  Reponse Data
	 * @returns   {function}     init()
	 * @author    Addam Driver <addam.driver@devcrapshoot.com>
	 * @added     2017-02-01
	 * @version   1.0
	 * @memberOf  autos.fnController
	 * @since     1.0.0
	 * @example   <caption>Call Success</caption>
	 * fnSuccess({object}); // will do something useful with the http response
	 */
	var fnSuccess = function (oResponse) {
		
		// set the vehicle scope
		$scope.vehicles = oResponse.data[0].vehicles;

		// init process
		return init();
	}
	/**
	 * Succeess method for http request
	 * @method    fnError
	 * @param     {object}  oResponse  Reponse Data
	 * @returns   {void}  nothing
	 * @author    Addam Driver <addam.driver@devcrapshoot.com>
	 * @added     2017-02-01
	 * @version   1.0
	 * @memberOf  autos.fnController
	 * @since     1.0.0
	 * @example   <caption>Call Success</caption>
	 * fnSuccess({object}); // will do something useful with the http response
	 */
	, fnError = function (oResponse) {
		console.error("Error", oResponse);
	}
	/**
	 * Method to set the image when selected
	 * @method    	fnSetImage
	 * @returns   	{void}            Returns Nothing
	 * @property 	{string} sMake make key in the sope
	 * @property 	{string} sModel model key in the scope
	 * @author 		Addam Driver <addam.driver@devcrapshoot.com>
	 * @added     	2017-02-01
	 * @version   	1.0
	 * @memberOf  	autos.fnController
	 * @since     	1.0.0
	 * @example     <caption>Set the Background Imgae</caption>
	 * fnSetImage(); // set's the background image for the vehicles
	 */
	, fnSetImage = function () {
		var sMake = $scope.make || ''
		, sModel = $scope.model || ''
		;

		// set the images
		document.getElementById('vehicleImage').className = sMake+ " " + sModel;

		return;
	}
	/**
	 * Method to handle the selected make
	 * @method    	fnSelectedMake
	 * @returns   	{void}   	returns nothing
	 * @author 		Addam Driver <addam.driver@devcrapshoot.com>
	 * @added     	2017-02-01
	 * @version   	1.0
	 * @memberOf  	autos.fnController
	 * @since     	1.0.0
	 * @example     <caption>Set the Make</caption>
	 * fnSelectedMake(); // set's the make for selection & set's the image
	 */
	, fnSelectedMake = function () {
		// only run if vehicles is available
		if (!$scope.vehicles) {
			return;
		}
		
		// flag that a selection has been made
		this.selectionMade = true;
		
		// set the image class
		fnSetImage();
	}
	/**
	 * Method to handle when the model is selected
	 * @method    	fnSelectedModel
	 * @returns   	{Function}   Set image method
	 * @author 		Addam Driver <addam.driver@devcrapshoot.com>
	 * @added     	2017-02-01
	 * @version   	1.0
	 * @memberOf  	autos.fnController
	 * @since     	1.0.0
	 * @example     <caption>Set the Model</caption>
	 * fnSelectedModel(); // set's the model for selection & set's the image
	 */
	, fnSelectedModel = function () {
		return fnSetImage();
	}
	/**
	 * Method to initialize the data
	 * @method    init
	 * @returns   {void}  	Returns nothing
	 * @author Addam Driver <addam.driver@devcrapshoot.com>
	 * @added     2017-02-07
	 * @version   1.0
	 * @memberOf  autos.fnController
	 * @since     1.0.0
	 * @example   <caption>Initialize the data</caption>
	 * init(); // will initialze the data selections
	 */
	, init = function( ) {
		
		// capture selection
		$scope.selectedMake = fnSelectedMake;

		// handle when the model is selcted
		$scope.selectedModel = fnSelectedModel;

		return;
 	}	
 	;

 	// get the initial data set
	$http({
        method : "GET"
        , headers: {'Content-Type':  'application/json'}
        , url : "/data"
    }).then(fnSuccess, fnError);
	
}
/**
 * Template for the slection directive
 * @type {[type]}
 */
, sSelectTemplate = 
	'<select id="make" ng-change="selectedMake(make)" ng-model =  "make"  ng-options = "key as key for (key, val) in vehicles"></select>' +
	'<select ng-show="selectionMade == true" ng-change="selectedModel(value)" id="model" ng-model="model" ng-options="value for value in vehicles[make]"></select>'
/**
 * Directive to handle the template
 * @method    	fnMyMakes
 * @returns   	{object}  compiled template
 * @author 		Addam Driver <addam.driver@devcrapshoot.com>
 * @added     	2017-02-01
 * @version   	1.0
 * @memberOf  	autos
 * @since     	1.0.0
 * @example     <caption>Setup the template</caption>
 * fnMyMakes(); // set's the template for the module
 */
, fnMyMakes = function (){
	return {
		template: sSelectTemplate 
	};
}
;

// setup the controller
oAutos.controller('autoControl', ['$scope', '$http', fnAutoContoller]);

// setup the make list
oAutos.directive('myMakes', fnMyMakes);
