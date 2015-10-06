/**
 * Created by wilok on 05/10/15.
 */
function Manufacturer(id, name){
    SelectableNode.call(this, id, name);
    this.models = ko.observableArray();
    this.models.areLoaded = ko.observable();
    this.isExpanded = ko.observable();

    var selectedModelsCount = 0;

    this.toggleExpand = function(){
        this.isExpanded(!this.isExpanded());
        if(this.models.areLoaded()) return;
        loadModels.call(this);
        this.models.areLoaded(true);
    }.bind(this);

    function loadModels(){
        proxy.getModels({}, function(response){
            for (var i = 0; i < response.length; i++) {
                var model = response[i];
                addModel.call(this, new Model(model.Id, model.Name));
            }
        }.bind(this));
    };

    this.hasSelectedModelsOrVariants = function(){
        if(selectedModelsCount > 0) return true;
        for (var i = 0; i < this.models(); i++) {
            if(this.models()[i].hasSelectedVariants()){
                return true;
                break;
            }
        }
        return false;
    };

    this.isSelected.subscribe(function(isSelected){
        if(isSelected){
            this.statusCss('selected');
            for (var i = 0; i < this.models().length; i++) {
                this.models()[i].select();
            }
            return;
        }

        for (var i = 0; i < this.models().length; i++) {
            this.models()[i].deselect();
        }

        if(this.hasSelectedModelsOrVariants()){
            this.statusCss('child-selected');
            return;
        }

        this.statusCss('not-selected');

    }, this)

    function addModel(model){
        if(this.isSelected) model.select();
        model.manufacturer = this;
        model.onToggle(function(isSelected){
            isSelected ? selectedModelsCount++ : selectedModelsCount--;
        }.bind(this))

        this.models.push(model);
    }
}
