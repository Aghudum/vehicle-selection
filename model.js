/**
 * Created by wilok on 05/10/15.
 */
function Model(id, name){
    SelectableNode.call(this, id, name);
    this.manufacturer = {isSelected: false};
    this.variants = ko.observableArray();
    this.variants.areLoaded = ko.observable();
    this.isExpanded = ko.observable()

    this.toggleExpand = function(){
        this.isExpanded(!this.isExpanded());
        if(this.variants.areLoaded()) return;
        loadVariants.call(this);
        this.variants.areLoaded(true);
    }.bind(this);

    var selectedVariantsCount = ko.observable(0);

    function loadVariants(){
        proxy.getVariants({}, function(response){
            for (var i = 0; i < response.length; i++) {
                var variant = response[i];
                addVariant.call(this, new Variant(variant.Id, variant.Name));
            }
        }.bind(this));
    };

    this.hasSelectedVariants = ko.computed(function(){
        return selectedVariantsCount() > 0;
    }, this);

    ko.computed(setStatus, this);

    function setStatus(){
        if(this.isSelected()){
            this.statusCss('selected');
            return;
        }

        if(this.hasSelectedVariants()){
            this.statusCss('child-selected');
            return;
        }

        this.statusCss('not-selected');
    }


    this.isSelected.subscribe(function(isSelected){
        if(isSelected){
            for (var i = 0; i < this.variants().length; i++) {
                this.variants()[i].select();
            }
            return;
        }

        for (var i = 0; i < this.variants().length; i++) {
            this.variants()[i].deselect();
        }
    }, this)

    function addVariant(variant){
        if(this.isSelected()) variant.select();
        variant.model = this;
        variant.onToggle(function(isSelected){
            isSelected
                ? selectedVariantsCount(selectedVariantsCount() + 1)
                : selectedVariantsCount(selectedVariantsCount() - 1);
        }.bind(this))

        this.variants.push(variant);
    }
}
