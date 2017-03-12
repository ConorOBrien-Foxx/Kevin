const fs = require("fs");
const spawn = require('child_process').spawn;
const path = require("path");
fs.writeFileSync("splitat.hs", "import Data.List\nimport Data.Maybe\nmain=interact((uncurry(((\"{\\\"first\\\":\"++).).(.((\",\\\"second\\\":\"++).(++\"}\").show.tail)).(++).show)).(splitAt=<<fromJust.elemIndex \'\\n\'))");
let a = process.argv[2];
let nw = path.parse(a).name;
let progs = fs.readFileSync(a).toString().split(/\$\$\$(?=\w+)/g);

let end = () => {
    // fs.unlinkSync("splitat.hs");
}

let recur = () => {
    if(!progs.length){
        end();
        return;
    }
    let prog = progs.shift();
    let child = spawn("runhaskell", ["splitat.hs"]);
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
recur();