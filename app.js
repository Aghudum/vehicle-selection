/**
 * Created by wilok on 05/10/15.
 */
function App(){
    var group = new ManufacturerGroup(1, "VW Group");
    group.toggleExpand();

    var audi = group.manufacturers()[0];

    var model = audi.models()[0];

    ko.applyBindings(group, document.getElementById("vehicle-selector"));
}

App();