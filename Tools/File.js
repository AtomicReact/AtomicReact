var path = require('path');
var fs = require('fs');

module.exports.createDirIfNotExist = function(refPath, mPath) {
  var mPathRelative = path.relative(refPath, mPath);
  var dirs = process.cwd();
  mPathRelative.split(path.sep).forEach(function(dir, index){
    dirs = path.join(dirs, dir);
    // console.log(dirs);
    if(!fs.existsSync(dirs)) {
      fs.mkdirSync(dirs);
    }
  });
};
module.exports.copyFile = function(pathFile, pastPathFile, callback){
  fs.readFile(pathFile, (err, data)=>{
    if(err) { return callback(err); }
    fs.writeFile(pastPathFile, data, (err)=>{
      return callback(err);
    });
  });
};
