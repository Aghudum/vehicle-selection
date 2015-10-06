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

    var selectedVariantsCount = 0;

    function loadVariants(){
        proxy.getVariants({}, function(response){
            for (var i = 0; i < response.length; i++) {
                var variant = response[i];
                addVariant.call(this, new Variant(variant.Id, variant.Name));
            }
        }.bind(this));
    };

    this.hasSelectedVariants = function(){
        return selectedVariantsCount > 0;
    };

    this.isSelected.subscribe(function(isSelected){
        if(isSelected){
            this.statusCss('selected');
            for (var i = 0; i < this.variants().length; i++) {
                this.variants()[i].select();
            }
            return;
        }

        for (var i = 0; i < this.models().length; i++) {
            this.models()[i].deselect();
        }

        if(this.hasSelectedVariants()){
            this.statusCss('child-selected');
            return;
        }

        this.statusCss('not-selected');

    }, this)

    function addVariant(variant){
        if(this.isSelected) variant.select();
        variant.model = this;
        variant.onToggle(function(isSelected){
            isSelected ? selectedVariantsCount++ : selectedVariantsCount--;
        }.bind(this))

        this.variants.push(variant);
    }
}
