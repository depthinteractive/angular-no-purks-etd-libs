var gulp = require("gulp");
var clean = require("gulp-clean");
var replace = require("gulp-replace");
var zip = require("gulp-zip");

var inputAssets = "./dist/assets";
var inputScriptsAndStyles = ["./dist/*.css", "./dist/*.js"];
var outputAssets = "./dist/static/assets/";
var outputScriptsAndStyles = "./dist/static/";

gulp.task("moveScriptsAndStyles", moveScriptsAndStyles);
gulp.task("moveAssets", moveAssets);
gulp.task("updateIndexHtml", updateIndexHtml);
gulp.task("pack-build", gulp.series(["moveAssets", "moveScriptsAndStyles"]));

function moveScriptsAndStyles() {
  return gulp
    .src(inputScriptsAndStyles)
    .pipe(gulp.dest(outputScriptsAndStyles))
    .on("end", function clearScriptsAndStyles() {
        gulp.src(inputScriptsAndStyles)
          .pipe(clean({force: true}));
      },
    );
}

function moveAssets() {
  return gulp
    .src(inputAssets + "/**/*")
    .pipe(gulp.dest(outputAssets))
    .on("end", function clearAssets() {
        gulp.src(inputAssets)
          .pipe(clean({force: true}));
      },
    );
}

function updateIndexHtml() {
  return gulp.src(["./dist/index.html"])
    .pipe(replace("type=\"module\"", "type=\"text/javascript\""))
    .pipe(replace("type=\"nomodule defer\"", "type=\"nomodule defer text/javascript\""))
    .pipe(gulp.dest("./dist/"))
    .on("end", compress);
}

function compress() {
  return gulp.src("./dist/**/*")
    .pipe(zip("dist.zip"))
    .pipe(gulp.dest("./dist/"));
}
