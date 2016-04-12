var Promise = require("bluebird"),
    fs = Promise.promisifyAll(require('fs-extra'));
var root = __dirname.substring(0,__dirname.length - 3)

function generateStage(project){
    return fs.copyAsync(root + 'stage', project,{clobber: true})
        .then(function(err){
            if (err) return console.error(err)
        })
}


module.exports = generateStage;