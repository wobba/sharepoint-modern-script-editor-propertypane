const fs = require('fs');
console.log("You may ignore any peer dependecy warnings when installing this package");

let path = process.argv[1];
const pathStop = path.indexOf("node_modules");
path = path.substr(0, pathStop);

let fileName = path + 'gulpfile.js';

String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

let hasGulpFile = fs.existsSync(fileName);
if (!hasGulpFile) {
    console.warn("No gulpfile.js found in SPFx project");
    return 0;
}

let content = fs.readFileSync(fileName, "utf8");
const insertAt = content.indexOf("build.initialize(gulp);");
if (insertAt == -1) {
    console.warn("Could not find build.initialize(gulp); in gulpfile.js");
    return 0;
}

const alreadyPatched = content.indexOf("editor-pop-up.min.js");
if (alreadyPatched !== -1) {
    console.log("gulpfile.js already patched");
    return 0;
}

const patchString = `\r\nlet copyDynamic = build.subTask('copy-dynamic-load-files', function (gulp, buildOptions, done) {
gulp.src('./node_modules/sharepoint-modern-script-editor-propertypane/bundles/editor-pop-up.min.js')
    .pipe(gulp.dest('./temp/deploy'))
    .pipe(gulp.dest('./dist'));

done();
});
build.rig.addPostBuildTask(copyDynamic);\r\n\r\n`;

content = content.splice(insertAt, 0, patchString);
fs.writeFileSync(fileName, content, "utf8");
console.log("Patched gulpfile.js");
return 0;
