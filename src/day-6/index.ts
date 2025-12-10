import { importText, log } from "../util/index.ts"
type Operator = "+" | "*"
type Operation = {
    operatorIndex: number
    numArray: Map<number, number> // order is important
}
type Operations = Map<number, Operation> // order is important
const rawInput = importText("../day-6/input.txt")
// const rawInput =
//     `123 328  51 64 
//  45 64  387 23 
//   6 98  215 314
// *   +   *   +  `
const input = rawInput.split(/\r?\n/).map(v => v.split(/\s/).filter(v => v !== ""))
const numberArray = input.slice(0, input.length - 1).map(v => v.map(val => Number.parseInt(val)))
const stringNumberArray = rawInput
    .split(/\r?\n/)
    .slice(0, input.length - 1)
// log({ stringNumberArray })
const stringOperatorArray = [...rawInput.slice(rawInput.indexOf("+") - rawInput.indexOf("*") > 0 ? rawInput.indexOf("*") : rawInput.indexOf("+"))]
const getOperatorIndexFromIndex = (index: number, currentIndex = index) => {
    const operatorFromIndex = stringOperatorArray[currentIndex]
    if (currentIndex < 0) return currentIndex
    if (operatorFromIndex === "+" || operatorFromIndex === "*") return currentIndex
    return getOperatorIndexFromIndex(index, currentIndex - 1)

}
const operationsWithDigitsArray = stringNumberArray.reduce((operationArray, stringRow, rowIndex) => {
    return [...stringRow].reduce((array, digit, colIndex) => {
        const currentOperation = array.get(colIndex)
        const digitInNumber = Number.parseInt(digit)
        const isDigitNaN = Number.isNaN(digitInNumber)
        if (isDigitNaN) return array
        if (!currentOperation) {
            const newNumberArray = new Map([[rowIndex, digitInNumber]])
            const newOperation = {
                operatorIndex: getOperatorIndexFromIndex(colIndex),
                numArray: newNumberArray,
            } as Operation
            return array.set(colIndex, newOperation)
        }
        // const newNumberArray = currentOperation.numArray.concat([Number.parseInt(digit)].filter(v => !Number.isNaN(v)))
        const newNumberArray = currentOperation.numArray.set(rowIndex, digitInNumber)
        return array.set(colIndex, {
            operatorIndex: getOperatorIndexFromIndex(colIndex),
            numArray: newNumberArray,
        })

    }, operationArray)
}, new Map() as Operations)
const operationsArray = [...operationsWithDigitsArray].reduce((totalArray, operation) => {
    const number = Number.parseInt([...operation[1].numArray].map(v => v[1]).join(""))
    const currentColTotal = totalArray.get(operation[1].operatorIndex)
    if (!currentColTotal) {
        return totalArray.set(operation[1].operatorIndex, [number])
    }
    const newNumberArray = currentColTotal.concat([number])
    // log(()=>newNumberArray,()=>operation[1].operatorIndex,()=>totalArray)
    return totalArray.set(operation[1].operatorIndex, newNumberArray)
}, new Map<number, number[]>())
const result2 = [...operationsArray].reduce((grandTotal, operation) => {
    return grandTotal + operation[1].reduce((acc, num, numIndex) => {
        if (stringOperatorArray[operation[0]] === "+") return acc + num
        if (numIndex === 0) return num
        return acc * num
    })
},0)
log(() =>result2)
// log(() => Number.parseInt([1, 2, 3].join("")), [stringOperatorArray], () => getOperatorFromIndex(11), () => Number.parseInt("     "))
const operatorArray = (input[input.length - 1] ?? []) as Operator[]
const result = operatorArray?.reduce((total, operator, colIndex) => {
    return total + numberArray.reduce((acc, numberArray, numIndex) => {
        if (operator === "+") return acc + (numberArray[colIndex] ?? 0)
        // log(()=>colIndex,numberArray[colIndex] )
        if (numIndex === 0) return (numberArray[colIndex] ?? 0)
        return acc * (numberArray[colIndex] ?? 0)
    }, 0)
}, 0)
// log({grandTotal})