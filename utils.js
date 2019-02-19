/**
 * Created by doudou on 2019/1/17.
 */
const path = require('path')
exports.assetsPath = function (_path) {
    const assetsSubDirectory = 'static'

    return path.posix.join(assetsSubDirectory, _path)
}