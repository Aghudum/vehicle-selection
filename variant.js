/**
 * Created by wilok on 05/10/15.
 */
 define('Variant', ['knockout', 'lodash', 'SelectableNode', 'proxy', 'selection'], function(ko, _, SelectableNode, proxy, selection){
    function Variant(id, name, model){
        SelectableNode.call(this, id, name);
        this.model = model;
        this.isExcluded = ko.observable();

        this.isSelected.subscribe(function(isSelected){
            manageSelection.call(this, isSelected);

            if(!isSelected && this.model.isSelected()){
                this.isExcluded(true);
            }
            else if(!isSelected && this.model.isExcluded()){
                this.isExcluded(true);
            }
            else{
                this.isExcluded(false);
            }
        }, this);

        this.model.isExcluded.subscribe(function(value){
            this.isExcluded(value);
        }, this);

        this.model.isSelected.subscribe(function(value){
            if(value){ this.select(); }
            else{
                this.deselect();
                this.isExcluded(this.model.isExcluded());
            }
        }, this);

        this.model.manufacturer.isSelected.subscribe(function(value){
            if(!value){ this.deselect(); }
        }, this);
    }

    function manageSelection(isSelected){
        var manufacturer = this.model.manufacturer;
        var model = this.model;
        if(isSelected){
            if(!manufacturer.isSelected() && !model.isSelected()){
                addToSelection.call(this, false);
            }
            else if(manufacturer.isSelected() && !model.isSelected()){
                addToSelection.call(this, false);
            }
            else if(!manufacturer.isSelected() && model.isSelected()){
                //addToSelection.call(this, true);
            }
            else if(manufacturer.isSelected() && model.isSelected()){
                removeFromSelection.call(this, true);
            }
        }
        else{
            if(!manufacturer.isSelected() && !model.isSelected()){
                removeFromSelection.call(this, false);
            }
            else if(manufacturer.isSelected() && !model.isSelected()){
                //removeFromSelection.call(this, false);
                removeFromSelection.call(this, true);
            }
            else if(!manufacturer.isSelected() && model.isSelected()){
                addToSelection.call(this, true);
            }
            else if(manufacturer.isSelected() && model.isSelected()){
                addToSelection.call(this, true);
            }
        }
    }

    function addToSelection(isExcluded){
        selection.push({
            manufacturerId: this.model.manufacturer.id(),
            modelId: this.model.id(),
            variantId: this.id(),
            date: this.model.date,
            isExcluded: isExcluded
        });
    }

    function removeFromSelection(isExcluded){
        _.remove(selection, function(item){
            return item.variantId == this.id() && item.isExcluded == isExcluded;
        }, this);
    }

    Variant.prototype.exclude = function(){
        this.isExcluded(true);
    }

    Variant.prototype.toggleSelect = function(){
        this.isSelected(!this.isSelected());
    };

    return Variant;

 });
