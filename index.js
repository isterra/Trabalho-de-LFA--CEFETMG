fs = require('fs')
let trees = []
var num = ['0', 'P', '1', 'P', '5', 'P']
var max = 10
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
        this.min = 1;
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
    var withouthVariable = []
    for (var i = 0; i < child.length; i++) {
        if (!new RegExp(variables.join("|")).test(child[i])) {
            withouthVariable.push(child[i])
        }
    }
    if(withouthVariable.length==0)
        return -1
    var min = withouthVariable[0].length
    for (var i = 0; i < withouthVariable.length; i++) {
        var word = withouthVariable[i]
        //console.log(word)
        if (word == "#") {
            min = 0;
            break;
        }
        if (word.length < min) {
            min = word.length
        }
    }
    return min
}
var canExpand = function(ref,maxLength,variables){
    var variable = ref.match(RegExp(variables.join("|"),"g"))
    ref = ref.replace(RegExp(variables.join("|"), "g"), '')
    var minSize=ref.length
    
    if(variable)
    variable.forEach(v=>{
        var tree = trees.find(e => e.key == v);
        if(tree.min!=-1)
            minSize+=tree.min
    })
    return minSize<=maxLength
}
var existsVariable = function (variables, toTest) {
    return RegExp(variables.join("|")).test(toTest);
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
var sizeWhithoutVariable = function (ref, variables) {
    variable = variables.join("|")
    ref = ref.replace(RegExp(variables.join("|"), "g"), '')
    return ref.length
}
const vef = (entryPoint, tree, variables,maxLength) => {
    let result = [];
    const finds = (ref, trees) => {
        if (existsVariable(variables, ref)) {
            var found = ref.match(variables.join("|"))[0]
            var tree = trees.find(e => e.key == found);
            tree.child.forEach(rule => {
                var newF = ref.replace(found, rule)
                newF = newF.replace(/#/g, '')
                if(canExpand(ref,maxLength,variables))
                    return finds(newF, trees)
            })
        } else {
            //console.log(ref);
            if (!result.includes(ref) && ref.length <= maxLength)
                result.push(ref)
        }
    }

    finds(entryPoint, tree)
    for (var i = 0; i < result.length; i++)
        if (result[i] != "#")
            result[i] = result[i].replace(/#/g, '')
    return result
}


const main = async function () {
    var jsonInput = JSON.parse(await readFile())
    var lengthMax = process.argv[3]
    var variables = jsonInput.glc[0]
    var alphabet = jsonInput.glc[1]
    var rules = jsonInput.glc[2]
    var entryPoint = jsonInput.glc[3]
    //console.log(variables);
    //console.log(alphabet);
    //console.log(rules);
    //console.log(entryPoint);
    //console.log(lengthMax);
    createTree(rules)
    //console.log(trees);
    trees.forEach(e => {
        e.min = setMin(e, variables)
    })
    //console.log(trees);
    var hf = vef(entryPoint[0], trees, variables,lengthMax)
    console.log(hf);
}

main()
//vef("P", [ '#','0P1P', '1P0P'],["P"])
//console.log(sizeWhithoutVariable('0123A0B0C',["A","B","C"]));