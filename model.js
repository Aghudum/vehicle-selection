/**
 * Created by wilok on 05/10/15.
 */
 define('Model', ['knockout','lodash','SelectableNode','Variant', 'proxy', 'selection'], function(ko, _, SelectableNode, Variant, proxy, selection){
    function Model(id, name, manufacturer){
        SelectableNode.call(this, id, name);
        this.manufacturer = manufacturer;
        this.variants = ko.observable([]);
        this.variants.areLoaded = ko.observable();
        this.variants.selectedCount = ko.observable(0);
        this.isExpanded = ko.observable()
        this.date = ko.observable(null);
        this.isExcluded = ko.observable(false);

        this.select.currentOnly = function(){
            this.date(new Date());
            this.select();
        };

        this.select.currentAndFuture = function(){
            this.date(null);
            this.select();
        };

        this.hasSelectedVariants = ko.computed(function(){
            return this.variants.selectedCount() > 0;
        }, this);

        this.toggleExpand = function(){
            this.isExpanded(!this.isExpanded());

            if(!this.variants.areLoaded()) {
                loadVariants.call(this);
                this.variants.areLoaded(true);
            }
        }.bind(this);

        this.isSelected.subscribe(function(isSelected){
            manageSelection.call(this, isSelected);
        }, this);

        function manageSelection(isSelected){
            if(isSelected){
                if(this.manufacturer.isSelected()){
                    removeFromSelection.call(this, true);
                    removeFromSelection.call(this, false);
                }
                else{
                    addToSelection.call(this, false);
                }
            }
            else{
                if(this.manufacturer.isSelected()){
                    addToSelection.call(this, true);
                }
                else{
                    removeFromSelection.call(this, true);
                    removeFromSelection.call(this, false);
                }
            }
        }

        this.exclude = function(){
            this.isExcluded(true);
            this.deselect();
        }

        this.manufacturer.isSelected.subscribe(function(value){
            if(value){ 
                this.select();
            }
            else{
                this.deselect();
            }
            this.isExcluded(false);
            this.date(this.manufacturer.date());
        }, this);
    }

    function removeFromSelection(isExcluded){
        _.remove(selection, function(item){
            return item.modelId == this.id() && item.isExcluded == isExcluded;
        }, this);
    }

    function addToSelection(isExcluded){
        selection.push({ 
            manufacturerId: this.manufacturer.id(),
            modelId: this.id(),
            date: this.date(),
            isExcluded: isExcluded
        }); 
    }

    function loadVariants(){
        var variants = [];
        proxy.getVariants({}, function(response){
            for (var i = 0; i < response.length; i++) {
                variants.push(createVariant.call(this, response[i]));
            }
        }.bind(this));
        this.variants(variants);
    };

    function createVariant(value){
        var variant = new Variant(value.Id, value.Name, this);

        variant.isSelected.subscribe(function(value){
            var count = this.variants.selectedCount();
            value ? this.variants.selectedCount(count + 1)
                : this.variants.selectedCount(count - 1)
            }, this);

        if(this.isSelected()) {
            variant.select();
        }

        if(this.isExcluded()){
            variant.exclude();
        }   

        return variant;
    }

    return Model;
 });

