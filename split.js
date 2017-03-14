const fs = require("fs");
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const path = require("path");
fs.writeFileSync("splitat.hs", "import Data.List\nimport Data.Maybe\nmain=interact((uncurry(((\"{\\\"first\\\":\"++).).(.((\",\\\"second\\\":\"++).(++\"}\").show.tail)).(++).show)).(splitAt=<<fromJust.elemIndex \'\\n\'))");
let a = process.argv[2];
let nw = path.parse(a).name;
let progs = fs.readFileSync(a).toString().split(/\$\$\$(?=\w+)/g);

let end = () => {
    files = ["splitat.o", "splitat.hi"];
    files.forEach(e => {
        if(fs.existsSync(e))
            fs.unlinkSync(e);
    });
}

let recur = () => {
    if(!progs.length){
        end();
        return;
    }
    let prog = progs.shift();
    let child = exec("splitat.exe", []);
    child.stdin.setEncoding("utf-8");
    let s="";
    child.stdout.on("data", b => s += b);
    child.stdout.on("end", () => {
        let obj = s?JSON.parse(s):{first:prog};
        let nextName = obj.second ? obj.first : nw;
        let nextContents = obj.second ? obj.second : obj.first;
        fs.writeFileSync(nextName + ".ckevin", nextContents);
        recur();
    });
    child.stdin.write(prog);
    child.stdin.end();
};

if(fs.existsSync("splitat.exe")){
    recur();
} else {
    let comp = spawn("ghc", ["-O0", "splitat.hs"]);
    comp.on("close", recur);
}