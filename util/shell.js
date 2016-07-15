/**
 * Created by Nonjene on 16/7/13.
 */
var process = require('child_process');

exports.run = function (command) {

    return new Promise((resolve, reject)=> {
        !command && reject('no comand given.');

        process.exec(command, (error, stdout, stderr) => {
            if (error !== null) {
                reject('exec error: ' + error);

            } else {
                resolve(stdout)
            }
            setTimeout(()=>reject('exec TimeOut: ' + stdout), 10000)
        });
    })

};