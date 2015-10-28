/**
 * Created by wilok on 05/10/15.
 */
 define('Variant', ['knockout', 'lodash', 'SelectableNode', 'proxy'], function(ko, _, SelectableNode, proxy){
    function Variant(id, name, model){
        SelectableNode.call(this, id, name);
        this.model = model;

        this.model.isSelected.subscribe(function(value){
            if(value){ this.select(); }
            else{ this.deselect(); }
        }, this);

        this.model.manufacturer.isSelected.subscribe(function(value){
            if(!value){ this.deselect(); }
        }, this);

        this.load = function(criterion){
            this.isSelected(!criterion.isExcluded);
        }
    }

    Variant.prototype.toggleSelect = function(){
        this.isSelected(!this.isSelected());
    };

    return Variant;
 });
