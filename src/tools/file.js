import { existsSync, mkdirSync, readFile, writeFile } from "fs";
import { relative, sep, join } from "path";


export const createDirIfNotExist = function (refPath, mPath) {
  var mPathRelative = relative(refPath, mPath);
  var dirs = process.cwd();
  mPathRelative.split(sep).forEach(function (dir, index) {
    dirs = join(dirs, dir);
    // console.log(dirs);
    if (!existsSync(dirs)) {
      mkdirSync(dirs);
    }
  });
};

export const copyFile = function (pathFile, pastPathFile, callback) {
  readFile(pathFile, (err, data) => {
    if (err) { return callback(err); }
    writeFile(pastPathFile, data, (err) => {
      return callback(err);
    });
  });
};


