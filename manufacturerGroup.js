/**
 * Created by wilok on 05/10/15.
 */
function ManufacturerGroup(id, name){
    Node.call(this, id, name);
    this.manufacturers = ko.observableArray();
    this.manufacturers.areLoaded = ko.observable();
    this.isExpanded = ko.observable();

    this.toggleExpand = function(){
        this.isExpanded(!this.isExpanded());
        if(this.manufacturers.areLoaded()) return;
        loadManufacturers.call(this);
        this.manufacturers.areLoaded(true);

    }.bind(this);

    function loadManufacturers(){
        proxy.getManufacturers({}, function(response){
            for (var i = 0; i < response.length; i++) {
                var model = response[i];
                addManufacturer.call(this, new Manufacturer(model.Id, model.Name));
            }
        }.bind(this));
    };

    function addManufacturer(manufacturer){
        this.manufacturers.push(manufacturer);
    }
}