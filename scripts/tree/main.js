import { DecisionTree } from "./decisionTree.js"
import { Draw } from "./draw.js"
const inputFile = document.querySelector('.inputfile')
const label = document.querySelector('.load_data label')
const inputTest = document.querySelector('.inputTest')
const startBtn = document.querySelector('.start')
const ansSpan = document.querySelector('.ans span')
const field = document.querySelector('.field')
const firstUl = document.querySelector('.field ul')
const optBtn = document.querySelector('.optimization')
let decisionTree = new DecisionTree()
let drawTree= new Draw(field, firstUl)
let data = []
let isLoadTree = false
let argCount = 0
inputFile.addEventListener('change', (e) => {
    data = []
    let decoder = new TextDecoder('utf-8');
    let file = inputFile.files[0]
    label.innerHTML = file.name
    let reader = new FileReader();
    reader.readAsArrayBuffer(file)
    reader.onload = () => {
        let str = decoder.decode(reader.result).trim().replaceAll('\r', '');
        data = str.split('\n')
        for(let i = 0; i < data.length; i++) {
            data[i] = data[i].split(';')
        }
        
        decisionTree = new DecisionTree()
        drawTree.clear()
        decisionTree.train(data, 0)
        argCount = data[0].length
        isLoadTree = true
        drawTree.drawGraph(decisionTree.tree, -1)
    }
    
})
// Комик;8;290;38
startBtn.addEventListener('click', (e) => {
    let testData = inputTest.value.split(';')
    if (testData.length === argCount - 1) {
        let data = decisionTree.predict(testData)
        ansSpan.innerHTML = data[0]
        drawTree.clear()
        drawTree.drawGraph(decisionTree.tree, data[1], data[2])
    } else {
        alert('Вы ввели плохие данные')
    }

})

optBtn.addEventListener('click', e=> {
    if (isLoadTree) {
        drawTree.clear()
        decisionTree.train(data, 0.9)
        drawTree.drawGraph(decisionTree.tree, -1)
    }

})