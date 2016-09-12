/* globals $: true */
var $        = require('gulp-load-plugins')(); 
var argv     = require('yargs').argv;
var browser  = require('browser-sync');
var gulp     = require('gulp');
var panini   = require('panini');
var rimraf   = require('rimraf');
var sequence = require('run-sequence');
var sherpa   = require('style-sherpa');
var concat = require('gulp-concat');
var directoryMap = require('gulp-directory-map');
var sort = require('gulp-sort');
var jshint = require('gulp-jshint');
var convert = require('gulp-convert');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var replace = require('gulp-replace');


// Check for --production flag
var isProduction = !!(argv.production);

var namespace = argv.namespace || 'projectName';

// Port to use for the development server.
var PORT = 8000;

// Browsers to target when prefixing CSS.
var COMPATIBILITY = ['last 1 versions', 'ie >= 11'];

// File paths to various assets are defined here.
var PATHS = {
  assets: [
    'src/assets/**/*',
    '!src/assets/{!img,js,scss}/**/*'
  ],
  sass: [
    'src/assets/scss'
  ],
  javascript: [
    'src/assets/js/jquery-start.js',
    'src/assets/js/app.js',
    'src/assets/js/functions/**/*.js',
    'src/assets/js/jquery-end.js'
  ],
  vendorJS: [
    'src/assets/js/vendor/*.js'
  ],
  namespaceLocations: [
    'src/assets/js/**/*',
    '.jshintrc'
  ],
  utilJS: [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/handlebars/handlebars.runtime.min.js'
  ],
  pages: [
    'src/pages/templates/**/*.html',
    'src/pages/components/**/*.html'
  ],
  renderTemplates: [
    'src/assets/js/templates/*.hbs'
  ]
};

gulp.task('replace', function(){
  gulp.src(PATHS.namespaceLocations, {base: "./"})
    .pipe(replace('projectName', namespace))
    .pipe(gulp.dest("./"));

});

gulp.task('handlebars', function(){
  gulp.src(PATHS.renderTemplates)
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'hbs.templates',
      noRedeclare: true, // Avoid duplicate declarations 
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('jsonYml', ['buildIndex', 'buildComponents'], function(){
  return gulp.src(['src/data/json/*.json'])
    .pipe(convert({
      from: 'json',
      to: 'yml'
     }))
    .pipe(gulp.dest('src/data/'));
});

gulp.task('buildIndex', function() {
    return gulp.src(PATHS.pages[0])
    .pipe(sort())
    .pipe(directoryMap({
      filename: 'urls_pages.json'
    }))
    .pipe(gulp.dest('src/data/json'));

});
gulp.task('buildComponents', function() {
    return gulp.src(PATHS.pages[1])
    .pipe(sort())
    .pipe(directoryMap({
      filename: 'urls_components.json'
    }))
    .pipe(gulp.dest('src/data/json'));
});
gulp.task('lint', function() {
  return gulp.src(['src/assets/js/functions/**/*.js', 'gulpfile.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});
// Delete the "dist" folder
// This happens every time a build starts
gulp.task('clean', function(done) {
  rimraf('dist', done);
});

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
gulp.task('copy', function() {
  gulp.src(PATHS.assets)
    .pipe(gulp.dest('dist/assets'));
});
gulp.task('copyUtilJS', function() {
  gulp.src(PATHS.utilJS)
    .pipe(gulp.dest('dist/assets/js'));
});
// Copy page templates into finished HTML files
gulp.task('pages', ['buildIndex', 'buildComponents', 'jsonYml'], function() {
  return gulp.src('src/pages/templates/**/*.{html,hbs,handlebars}')
    .pipe(panini({
      root: 'src/pages',
      layouts: 'src/layouts/',
      partials: 'src/partials/',
      data: 'src/data/',
      helpers: 'src/helpers/'
    }))
    .pipe(gulp.dest('dist'));
});
// Copy component templates into finished HTML files
gulp.task('components', ['buildComponents', 'jsonYml'], function() {
  return gulp.src('src/pages/components/**/*.{html,hbs,handlebars}')
    .pipe(panini({
      root: 'src/pages',
      layouts: 'src/layouts/',
      partials: 'src/partials/',
      data: 'src/data/',
      helpers: 'src/helpers/'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('pages:reset', ['jsonYml'], function(done) {
  panini.refresh();
  return sequence(['pages', 'components'], done);
});

// Compile Sass into CSS
// In production, the CSS is compressed
gulp.task('sass', function() {
  var uncss = $.if(isProduction, $.uncss({
    html: ['src/**/*.html'],
    ignore: [
      new RegExp('^meta\..*'),
      new RegExp('^\.is-.*')
    ]
  }));

  var minifycss = $.if(isProduction, $.minifyCss());

  return gulp.src('src/assets/scss/app.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: PATHS.sass
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: COMPATIBILITY
    }))
    .pipe(uncss)
    .pipe(minifycss)
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    .pipe(gulp.dest('dist/assets/css'));
});

// Combine JavaScript into one file
// In production, the file is minified
gulp.task('javascript', function() {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(PATHS.javascript)
    .pipe($.sourcemaps.init())
    .pipe($.concat('app.js'))
    .pipe(uglify)
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('vendorJS', function() {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(PATHS.vendorJS)
    .pipe($.sourcemaps.init())
    .pipe($.concat('vendor.js'))
    .pipe(uglify)
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    .pipe(gulp.dest('dist/assets/js'));
});
// Copy images to the "dist" folder
// In production, the images are compressed
gulp.task('images', function() {
  var imagemin = $.if(isProduction, $.imagemin({
    progressive: true
  }));

  return gulp.src('src/assets/img/**/*')
    .pipe(imagemin)
    .pipe(gulp.dest('dist/assets/img'));
});

// Build the "dist" folder by running all of the above tasks
gulp.task('build', function(done) {
  sequence('clean', ['pages', 'components', 'sass', 'lint', 'javascript', 'vendorJS', 'handlebars', 'images', 'copy', 'copyUtilJS'], done);
});

// Start a server with LiveReload to preview the site in
gulp.task('server', ['build'], function() {
  browser.init({
    server: 'dist', port: PORT
  });
});

// Build the site, run the server, and watch for file changes
gulp.task('default', ['build', 'server'], function() {
  gulp.watch(PATHS.assets, ['copy', browser.reload]);
  gulp.watch(PATHS.utilJS, ['copyUtilJS', browser.reload]);
  gulp.watch(PATHS.renderTemplates, ['handlebars', browser.reload]);
  gulp.watch(['src/{layouts,partials,pages,helpers,data}/**/*'], ['pages:reset', browser.reload]);
  gulp.watch(['src/assets/scss/**/*.scss'], ['sass', browser.reload]);
  gulp.watch(['src/assets/js/**/*.js'], ['lint', 'javascript', 'vendorJS', browser.reload]);
  gulp.watch(['src/assets/img/**/*.*'], ['images', browser.reload]);
});