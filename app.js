/**
 * Created by wilok on 05/10/15.
 */
require(['VehicleSelector'], function(VehicleSelector){
	var app = new VehicleSelector();
	app.init();
});

define('VehicleSelector', ['ManufacturerGroup', 'knockout'], function(ManufacturerGroup, ko){
	function VehicleSelector(){
		this.init = function(){
		    var vwGroup = new ManufacturerGroup(1, "VW Group");
		    var nonVwGroup = new ManufacturerGroup(1, "Not VW Group");

		    vwGroup.toggleExpand();

		    var audi = vwGroup.manufacturers()[0];

		    var model = audi.models()[0];

		    ko.applyBindings({groups: [vwGroup, nonVwGroup]}, document.getElementById("vehicle-selector"));
		};
	}

	return VehicleSelector;
});
