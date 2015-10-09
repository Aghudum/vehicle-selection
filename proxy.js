/**
 * Created by wilok on 05/10/15.
 */
define('proxy', [], function(){
    function Proxy(){
        this.getManufacturers = function(request, callback){
            callback([{Id: 1, Name: "Audi"}, {Id: 2, Name: "Volkswagen"}]);
        };

        this.getModels = function(request, callback){
            var response = [];
            for (var i = 1; i <= 20; i++) {
                response.push({Id: i, Name: "Audi A4 model " + i})
            }
            callback(response);
        }

        this.getVariants = function(request, callback){
            var response = [];
            for (var i = 1; i <= 25; i++) {
                response.push({Id: i, Name: "Audi A4 variant " + i})
            }
            callback(response);
        }
    }

    return new Proxy();
});
