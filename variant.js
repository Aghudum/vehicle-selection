/**
 * Created by wilok on 05/10/15.
 */
function Variant(id, name){
    SelectableNode.call(this, id, name);
    this.model = {isSelected : false};

    this.isSelected.subscribe(function(isSelected){
        if(isSelected) {
            this.statusCss('selected');
            return;
        }

        if(this.model.isSelected()){
            this.statusCss('excluded');
            return;
        }

        this.statusCss('not-selected');
    }, this)
}