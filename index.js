fs = require('fs')
let groups = []
const readFile = async function () {
    try {
        const data = await fs.promises.readFile(process.argv[2], 'utf8')
        return data
    }
    catch (err) {
        console.log("Erro ao abriri arquivo")
    }
}
class Group {
    constructor(key) {
        this.key = key;
        this.rules = [];
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
function setMin(group, variables) {
    var rules = group.rules
    var withouthVariable = []
    for (var i = 0; i < rules.length; i++) {
        if (!new RegExp(variables.join("|")).test(rules[i])) {
            withouthVariable.push(rules[i])
        }
    }
    if (withouthVariable.length == 0)
        return -1
    var min = withouthVariable[0].length
    for (var i = 0; i < withouthVariable.length; i++) {
        var word = withouthVariable[i]
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
/*
Verifico se ao expandir uma variavel, a palavra minima que ela pode gerar, com o tamanho da palavra já gerada está dentro do tamanho limite.
*/
var canExpand = function (word, maxLength, variables) {
    var variable = word.match(RegExp(variables.join("|"), "g"))
    word = word.replace(RegExp(variables.join("|"), "g"), '')
    var minSize = word.length

    if (variable)
        variable.forEach(v => {
            var group = groups.find(e => e.key == v);
            if (group.min != -1)
                minSize += group.min
        })

    return minSize <= maxLength
}
var existsVariable = function (variables, toTest) {
    return RegExp(variables.join("|")).test(toTest);
}

var createGroup = function (rules) {
    rules.forEach(rule => {
        if (!contains(groups, rule[0])) {
            var group = new Group(rule[0])
            group.rules.push(rule[1])
            groups.push(group)
        } else {
            groups.forEach(group => {
                if (group.key == rule[0]) {
                    group.rules.push(rule[1])
                }
            })
        }
    });
}

const getVariations = (entryPoint, groups, variables, maxLength) => {
    let result = [];

    const finds = (word, groups) => {
        if (existsVariable(variables, word)) {
            var found = word.match(variables.join("|"))[0]
            var group = groups.find(e => e.key == found);
            group.rules.forEach(rule => {
                var formatedWord = word.replace(found, rule)
                formatedWord = formatedWord.replace(/#/g, '')
                if (canExpand(word, maxLength, variables))
                    return finds(formatedWord, groups)
            })
        } else {
            if (!result.includes(word) && word.length <= maxLength)
                result.push(word)
        }
    }

    finds(entryPoint, groups)
    var index = result.indexOf('')
    index >= 0 ? result[index] = "#" : null
    return result
}


const main = async function () {
    var jsonInput = JSON.parse(await readFile())
    var maxLength = process.argv[3]
    var variables = jsonInput.glc[0]
    var rules = jsonInput.glc[2]
    var entryPoint = jsonInput.glc[3]
    createGroup(rules)
    groups.forEach(e => {
        e.min = setMin(e, variables)
    })
    var variations = getVariations(entryPoint[0], groups, variables, maxLength)
    if (variations) {
        variations.sort((a, b) => a.length - b.length)
        variations.forEach(v => console.log(v))
    }
}

main()