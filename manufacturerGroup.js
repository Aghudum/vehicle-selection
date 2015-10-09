/**
 * Created by wilok on 05/10/15.
 */
define('ManufacturerGroup', ['knockout','Manufacturer', 'proxy', 'Node'], function(ko, Manufacturer, proxy, Node){
    function ManufacturerGroup(id, name){
        Node.call(this, id, name);
        this.manufacturers = ko.observable([]);
        this.manufacturers.areLoaded = ko.observable();
        this.isExpanded = ko.observable();

        this.toggleExpand = function(){
            this.isExpanded(!this.isExpanded());
            if(!this.manufacturers.areLoaded()) {
                loadManufacturers.call(this);
                this.manufacturers.areLoaded(true);
            };
        }.bind(this);
    }

    function loadManufacturers(){
        var manufacturers = [];
        proxy.getManufacturers({}, function(response){
            for (var i = 0; i < response.length; i++) {
                var model = response[i];
                manufacturers.push(new Manufacturer(model.Id, model.Name));
            }
        }.bind(this));
        
        this.manufacturers(manufacturers);
    };

    return ManufacturerGroup;
});

