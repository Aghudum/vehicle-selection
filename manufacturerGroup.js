/**
 * Created by wilok on 05/10/15.
 */
define('ManufacturerGroup', ['knockout','Manufacturer', 'proxy', 'Node', 'lodash'], function(ko, Manufacturer, proxy, Node, _){
    function ManufacturerGroup(id, name, selection){
        Node.call(this, id, name);
        this.manufacturers = ko.observable([]);
        this.manufacturers.areLoaded = ko.observable();
        this.isExpanded = ko.observable();

        this.toggleExpand = function(){
            this.isExpanded(!this.isExpanded());
            if(!this.manufacturers.areLoaded()) {
                loadManufacturers.call(this, selection);
                this.manufacturers.areLoaded(true);
            };
        }.bind(this);
    }

    function loadManufacturers(selection){
        var manufacturers = [];
        proxy.getManufacturers({}, function(response){
            for (var i = 0; i < response.length; i++) {
                var manufacturerDto = response[i];
                var manufacturer = new Manufacturer(manufacturerDto.Id, manufacturerDto.Name, selection);

                var manufacturerCriteria = _.filter(selection, { manufacturerId : manufacturerDto.Id});

                if(manufacturerCriteria.length > 0){
                    manufacturer.load(manufacturerCriteria);
                }
                manufacturers.push(manufacturer);
            }
        }.bind(this));
        
        this.manufacturers(manufacturers);
    };

    return ManufacturerGroup;
});
