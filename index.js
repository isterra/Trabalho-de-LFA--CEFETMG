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
    var min = withouthVariable[0].length
    for (var i = 1; i < withouthVariable.length; i++) {
        if (withouthVariable[i] < min) {
            min = withouthVariable[i].length
        }
    }
    return min
}
var existsVariable=function(variables,toTest){
    return RegExp(variables.join("|")).test(toTest);
}
var firstVar = function(variables,ref){
    console.log(ref.match(variables.join("|"))[0]);
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
var sizeWhithoutVariable=function(ref,variables){
    console.log(ref);
    variable=variables.join("|")
    ref = ref.replace(RegExp(variables.join("|"),"g"),'')
    console.log(ref);
    return ref.length
}
const vef = (entryPoint,rules,variables)=>{
    let result = [];
    const finds = (ref)=>{     
        rules.forEach(r=>{
            if(existsVariable(variables,ref)){
                var found = ref.match(variables.join("|"))[0]
                var newF= ref.replace(found,r)
                newF=newF.replace(/#/g,'')
                if(sizeWhithoutVariable(newF,variables)<=4)
                    return finds(newF)
            }else{
                if(!result.includes(ref)&&ref.length<=4)
                result.push(ref)
            }
        })
    }
 
    finds(entryPoint)
    console.log(result)
    for(var i=0;i<result.length;i++)
        if(result[i]!="#")
            result[i]=result[i].replace(/#/g,'')
    console.log(result)
}

const permutator = (inputArr) => {
    let result = [];
    const permute = (arr, m = []) => {
        if (arr.length === 0) { 
            console.log(m)
            result.push(m) }
        else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                //console.log("curr"+curr);
                let next = curr.splice(i, 1);
                //console.log("next"+next);
                permute(curr.slice(), m.concat(next))
            }
        }
    }
   // permute(inputArr)
    return result;
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
    trees.forEach(e => {
        e.min = setMin(e, variables)
    })
    console.log(trees);
}

//main()
vef("P", [ '#','0P1P', '1P0P'],["P"])
//console.log(sizeWhithoutVariable('0123A0B0C',["A","B","C"]));