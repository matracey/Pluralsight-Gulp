module.exports = function() {
    var service = {
        getJsonFromFile: getJsonFromFile
    };
    return service;

    function getJsonFromFile(file) {
        var fs = require("fs");
        var json = getConfig(file);
        return json;

        function readJsonFileSync(filepath, encoding) {
            if (typeof (encoding) === "undefined") {
                encoding = "utf8";
            }
            var f = fs.readFileSync(filepath, encoding);
            return JSON.parse(f);
        }

        function getConfig(f) {
            var filepath = __dirname + f;
            return readJsonFileSync(filepath);
        }
    }
};
