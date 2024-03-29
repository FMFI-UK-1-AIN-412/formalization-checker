const fs = require('fs/promises');
const {exec} = require('child_process');

function cmd(command) {
    return new Promise((resolve, reject) => {
        console.log(command);
        const proc = exec(command);
        proc.stdout.on('data', function (data) {process.stdout.write(data)});
        proc.stderr.on('data', function (data) {process.stderr.write(data)});
        proc.on('exit', function (code) {code === 0 ? resolve(0) : reject(code)});
    });
}

(async () => {
    // if exists, remove './lib/dist' folder
    await fs.rm('./lib/dist', {
        force: true,
        recursive: true,
    });
    // compile js/jsx files
    await cmd("npx babel src/ --out-dir 'lib/dist'");
    // copy css modules
    await cmd("npx copyfiles -u 1 'src/**/*.module.*css' 'lib/dist'");
    // isolate bootstrap css
    await cmd("npx isolate-css-cli node_modules/bootstrap/dist/css/bootstrap.min.css -p formalization-checker-ZF2r5pOxUp -u 3 -c -o ./lib/dist/static/");
})()
