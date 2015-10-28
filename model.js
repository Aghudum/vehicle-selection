/**
 * Created by wilok on 05/10/15.
 */
 define('Model', ['knockout','lodash','SelectableNode','Variant', 'proxy'], function(ko, _, SelectableNode, Variant, proxy){
    function Model(id, name, manufacturer){
        SelectableNode.call(this, id, name);
        this.manufacturer = manufacturer;
        this.variants = ko.observable([]);
        this.variants.areLoaded = ko.observable();
        this.variants.selectedCount = ko.observable(0);
        this.isExpanded = ko.observable()
        this.date = ko.observable(null);

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

        this.manufacturer.isSelected.subscribe(function(value){
            if(value){ this.select(); }
            else{ this.deselect(); }
            this.date(this.manufacturer.date());
        }, this);

        this.load = function(criteria){
            var modelCriterion = _.find(criteria, function(criterion){
                return criterion.modelId === this.id() && criterion.variantId === null;
            })

            if(modelCriterion){
                this.date(modelCriterion.date);
            }

            var variantCriteria = _.find(criteria, function(criterion){
                return criterion.modelId === this.id() && criterion.variantId !== null;
            })

            if(variantCriteria){
                loadVariants.call(this, variantCriteria)
                this.variants.areLoaded(true);
            }
        }
    }

    function loadVariants(variantCriteria){
        var variants = [];
        proxy.getVariants({}, function(response){
            for (var i = 0; i < response.length; i++) {
                var variantResponse = response[i];
                var criterion = _.find(variantCriteria, {variantId : variantResponse.Id});
                variants.push(createVariant.call(this, response[i], criterion));
            }
        }.bind(this));
        this.variants(variants);
    };

    function createVariant(value, criterion){
        var variant = new Variant(value.Id, value.Name, this);

        variant.isSelected.subscribe(function(value){
            var count = this.variants.selectedCount();
            value ? this.variants.selectedCount(count + 1)
                : this.variants.selectedCount(count - 1)
            }, this);

        if(this.isSelected()) {
            variant.select();
        }

        if(criterion){
            variant.load(criterion);
        }

        return variant;
    }

    return Model;
 });
