define('SelectableNode', ['knockout','Node'], function(ko, Node){
    function SelectableNode(id, name){
        Node.call(this, id, name);
        this.isSelected = ko.observable().extend({notify: 'always'});

        this.select = function(){
            this.isSelected(true);
        };

        this.deselect = function(){
            this.isSelected(false);
        };
    }    

    return SelectableNode;
});
