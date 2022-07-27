const gulp = require("gulp");
const gulp_sass =  require('gulp-sass')(require('sass'));
const gulp_ts = require("gulp-typescript");
const postcss = require('gulp-postcss');
const tailwindcss = require( 'tailwindcss' );

const filePaths = {
  sassInputPath: ["**/*.scss", "!node_modules/**"],
  sassOutputPath: "target/css",
  tsInputPath: ["**/*.ts", "!node_modules/**"],
  tsOutputPath: "target/js",
  stlyeSRC:'tailwind.scss',
  stylesOut:'target/',
  copyFrom:'index.html',
  copyTo:'target/'
};

gulp.task("build-sass", () => {
  return gulp
    .src(filePaths.sassInputPath)
    .pipe(gulp_sass())
    .pipe(gulp.dest(filePaths.sassOutputPath));
});
gulp.task("build-ts", () => {
  return gulp
    .src(filePaths.tsInputPath)
    .pipe(gulp_ts({
      noImplicitAny:true,
      target: "ES2021",
      allowSyntheticDefaultImports:true
    }))
    .pipe(gulp.dest(filePaths.tsOutputPath));
});
gulp.task( 'styles', () => {
  return gulp
    .src( filePaths.stlyeSRC, { allowEmpty: true })
    // ...
    .pipe( postcss([
      tailwindcss( 'tailwind.config.js' ),
      require( 'autoprefixer' )
    ]) ).pipe(gulp_sass()).pipe(gulp.dest( filePaths.stylesOut))
    // ...
});
gulp.task("copy-index-html", () => {
  return gulp
    .src(filePaths.copyFrom)
    .pipe(gulp.dest(filePaths.copyTo));
});

exports.default = gulp.series('build-sass','build-ts','styles','copy-index-html')