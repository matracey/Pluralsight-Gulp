var gulp = require("gulp");
var args = require("yargs").argv;
var config = require("./gulp.config")();
var del = require("del");
var port = process.env.PORT || config.defaultPort;

var $ = require("gulp-load-plugins")({lazy: true});

gulp.task("vet", function () {
    "use strict";
    log("Analyzing source with ESLint");

    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.eslint());
});

gulp.task("styles", [ "clean-styles" ], function() {
    log("Compiling Less --> CSS");

    return gulp
        .src(config.less)
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({browsers: ["last 2 version", "> 5%"]}))
        .pipe(gulp.dest(config.temp));
});

gulp.task("clean-styles", function (done) {
    var files = config.temp + "**/*.css";
    clean(files, done);
});

gulp.task("less-watcher", function () {
    gulp.watch([ config.less ], [ "styles" ]);
});

gulp.task("wiredep", function () {
    var options = config.getWiredepDefaultOptions();
    var wiredep = require("npm-wiredep").stream;

    return gulp
        .src(config.index)
        .pipe($.if(args.verbose, $.print()))
        // .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
});

gulp.task("serve-dev", [ "wiredep" ], function () {
    var isDev = true;
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            "PORT": port,
            "NODE_ENV": isDev ? "dev" : "build"
        },
        watch: [ config.server ]
    }

    return $.nodemon(nodeOptions);
});

////////////

function clean(path, done) {
    log("Cleaning: " + $.util.colors.blue(path));
    del(path, done);
}

function log(msg) {
    "use strict";
    if (typeof (msg) === "object") {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
