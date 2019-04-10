module.exports = function () {

    var client = "./src/client/",
        clientApp = client + "app/",
        temp = "./.tmp/",
        server = "./src/server/",
        config = {
            /**
             * File Paths
             */
            alljs : [
                "./src/**/*.js",
                "./*.js"
            ],
            client: client,
            index: client + "index.html",
            js: [
                clientApp + "**/*.module.js",
                clientApp + "**/*.js",
                "!" + clientApp + "**/*.spec.js"
            ],

            less: client + "styles/styles.less",
            temp: temp,
            server: server,

            /**
             * Bower and NPM Locations
             */
            npm: {
                packageJson: require("./package.json"),
                directory: "./node_modules/",
                ignorePath: "../.."
            },

            defaultPort: 7203,
            nodeServer: server + "/app.js"
        };

    config.getWiredepDefaultOptions = function () {
        return {
            packageJson: config.npm.packageJson,
            directory: config.npm.directory,
            ignorePath: config.npm.ignorePath,
            dependencies: true,
            devDependencies: false,
            includeSelf: false,
        };
    };

    return config;
};
