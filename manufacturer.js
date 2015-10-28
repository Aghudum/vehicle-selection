/**
 * Created by wilok on 05/10/15.
 */
define('Manufacturer', [ 'knockout', 'lodash', 'SelectableNode', 'Model', 'proxy'], function(ko, _, SelectableNode, Model, proxy){
    var selection;
    function Manufacturer(id, name, savedSelection){
        selection = savedSelection;
        SelectableNode.call(this, id, name);
        this.models = ko.observable([]);
        this.models.areLoaded = ko.observable();
        this.models.selectedCount = ko.observable(0);
        this.selectedVariantsCount = ko.observable(0);
        this.isExpanded = ko.observable();
        this.date = ko.observable(null);

        this.select.currentOnly = function(){
            this.date(new Date());
            this.select();
        };

        this.select.currentAndFuture = function(){
            this.date(null);
            this.select();
        };

        this.hasSelectedModels = ko.computed(function(){
            return this.models.selectedCount() > 0;
        }, this);

        this.hasSelectedVariants = ko.computed(function(){
            return this.selectedVariantsCount() > 0;
        }, this);

        this.load = load.bind(this);
    }

    function load(criteria){
        var manufacturerCriterion = _.find(criteria, function(c){
            return c.modelId === null;
        }, this);

        if(manufacturerCriterion){
            this.isSelected(true);
            this.date(manufacturerCriterion.date);
        }

        var modelsCriteria = _.filter(criteria, function(c){
            return c.modelId !== null;
        }, this);

        if(modelsCriteria.length > 0){
            loadModels.call(this, modelsCriteria)
            this.models.areLoaded(true);
        }
    }

    function loadModels(criteria){
        var models = [];
        proxy.getModels({}, function(response){
            for (var i = 0; i < response.length; i++) {
                models.push(createModel.call(this, response[i], criteria));
            }
        }.bind(this));
        this.models(models);
    }

    function createModel(value, criteria){
        var model = new Model(value.Id, value.Name, this);

        model.isSelected.subscribe(function(value){
            var initialCount = this.models.selectedCount();
            value ? this.models.selectedCount(initialCount + 1)
                : this.models.selectedCount(initialCount - 1);
        }, this);

        model.variants.selectedCount.subscribe(function(count){
            this.selectedVariantsCount(this.selectedVariantsCount() - count);
        }, this, 'beforeChange');

        model.variants.selectedCount.subscribe(function(count){
            this.selectedVariantsCount(this.selectedVariantsCount() + count);
        }, this);

        if(this.isSelected()) {
            model.select();
        }

        var modelCriteria = _.filter(criteria, { modelId: model.id() });
        if(modelCriteria.length > 0){
            model.load(modelCriteria);
        }

        return model;       
    }

    Manufacturer.prototype.toggleExpand = function(){
        this.isExpanded(!this.isExpanded());

        if(!this.models.areLoaded()) {
            loadModels.call(this, []);
            this.models.areLoaded(true);
        }
    };

    return Manufacturer;
});
