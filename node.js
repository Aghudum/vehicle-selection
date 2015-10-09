/**
 * Created by wilok on 05/10/15.
 */
define('Node', ['knockout'], function(ko){
    function Node(id, name){
        this.id = ko.observable(id);
        this.name = ko.observable(name);
    }

    return Node;
});
