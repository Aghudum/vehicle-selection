/**
 * Created by wilok on 05/10/15.
 */
require(['VehicleSelector'], function(VehicleSelector){
	var app = new VehicleSelector();
	app.init();
});

define('VehicleSelector', ['ManufacturerGroup', 'knockout', 'lodash'], function(ManufacturerGroup, ko, _){
	function VehicleSelector(){
		this.init = function(){
			selection = JSON.parse(localStorage.getItem('selection'));

		    var vwGroup = new ManufacturerGroup(1, "VW Group", selection);
		    var nonVwGroup = new ManufacturerGroup(1, "Not VW Group", selection);

		    vwGroup.toggleExpand();

		    //var audi = vwGroup.manufacturers()[0];

		    //var model = audi.models()[0];

		    var selector = {
		    	groups: [vwGroup, nonVwGroup],
		    	 options: {
			    	currentOnlySelection: true,
			    	currentAndFutureSelection: false
		    	}
	    	}; 	

		    ko.applyBindings(selector, document.getElementById("vehicle-selector"));

			function add_to_selection(selection, manufacturerId, modelId, variantId, date, isExcluded){
				selection.push({
			    	manufacturerId: manufacturerId,
		            modelId: modelId,
		            variantId: variantId,
		            date: date,
		            isExcluded: isExcluded
				});
			}

    		window.save = function(){
    			var selection = [];
				_.each(vwGroup.manufacturers(), function(manufacturer){
					//manufacturer selected
					if(manufacturer.isSelected()){
						add_to_selection(selection, manufacturer.id(), null, null, manufacturer.date(), false);

						_.each(manufacturer.models(), function(model){
							//model selected
							if(model.isSelected()){
								_.each(model.variants(), function(variant){
									//variant NOT selected
									if(!variant.isSelected()){
										add_to_selection(selection, manufacturer.id(), model.id(), variant.id(), null, true);
									}						
								});
							}
							//model NOT selected
							else{
								add_to_selection(selection, manufacturer.id(), model.id(), null, model.date(), true);

								_.each(model.variants(), function(variant){
									//variant selected
									if(variant.isSelected()){
										add_to_selection(selection, manufacturer.id(), model.id(), variant.id(), null, false);
									}						
								});
							}
						});
					}
					// manufacturer NOT selected
					else{
						_.each(manufacturer.models(), function(model){
							// model selected
							if(model.isSelected()){
								add_to_selection(selection, manufacturer.id(), model.id(), null, model.date(), false);

								_.each(model.variants(), function(variant){
									//variant NOT selected
									if(!variant.isSelected()){
										add_to_selection(selection, manufacturer.id(), model.id(), variant.id(), null, true);
									}						
								});
							}
							// model NOT selected
							else{
								_.each(model.variants(), function(variant){
									// variant selected
									if(variant.isSelected()){
										add_to_selection(selection, manufacturer.id(), model.id(), variant.id(), null, true);
									}						
								});
							}
						});
					}
				});

				localStorage.setItem('selection', JSON.stringify(selection));
			};
		};
	}

	return VehicleSelector;
});
