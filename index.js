fs = require('fs')
let trees = []

const readFile = async filePath => {
    try {
        const data = await fs.promises.readFile(process.argv[2], 'utf8')
        return data
    }
    catch (err) {
        console.log("Erro ao abriri arquivo")
    }
}
class Tree {
    constructor(key) {
        this.key = key;
        this.child = [];
        this.min=1;
    }
}
function contains(rule, key) {
    for (var i = 0; i < rule.length; i++) {
        if (rule[i].key == key) {
            return true;
        }
    }
    return false;
}
function setMin(tree, variables) {
    var child = tree.child
    var withouthVariable=[]
    for (var i = 0; i < child.length; i++) {
        if (!new RegExp(variables.join("|")).test(child[i])) {
            withouthVariable.push(child[i])
        }
    }
    var min=withouthVariable[0].length
    for (var i = 1; i < withouthVariable.length; i++) {
        if(withouthVariable[i]<min){
            min=withouthVariable[i].length
        }
    }
    return  min
}
var createTree = function (rules) {
    rules.forEach(rule => {
        if (!contains(trees, rule[0])) {
            var tree = new Tree(rule[0])
            tree.child.push(rule[1])
            trees.push(tree)
        } else {
            trees.forEach(t => {
                if (t.key == rule[0]) {
                    t.child.push(rule[1])
                }
            })
        }
    });
}


const main = async function () {
    var jsonInput = JSON.parse(await readFile())
    var lengthMax = process.argv[3]
    var variables = jsonInput.glc[0]
    var alphabet = jsonInput.glc[1]
    var rules = jsonInput.glc[2]
    var entryPoint = jsonInput.glc[3]
    console.log(variables);
    console.log(alphabet);
    console.log(rules);
    console.log(entryPoint);
    console.log(lengthMax);
    createTree(rules)
    console.log(trees);
    trees.forEach(e=>{
        e.min=setMin(e,variables)
    })
    console.log(trees);
}

main()