/**
 * Created by wilok on 05/10/15.
 */
function Node(id, name){
    this.id = ko.observable(id);
    this.name = ko.observable(name);
}

function SelectableNode(id, name){
    Node.call(this, id, name);

    this.statusCss = ko.observable();

    this.isSelected = ko.observable();

    this.select = function(){
        this.isSelected(true);
    }

    this.deselect = function(){
        this.isSelected(false);
    }

    var onToggleCallbacks = [];

    this.toggleSelect = function(){
        this.isSelected(!this.isSelected());
        for (var i = 0; i < onToggleCallbacks.length; i++) {
            onToggleCallbacks[i](this.isSelected());
        }
    };

    this.onToggle = function(callback){
        onToggleCallbacks.push(callback);
    }
}