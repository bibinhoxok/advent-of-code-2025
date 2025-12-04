import { importText, log } from "../util/index.ts"
type Input = ("@" | ".")[][]
const input = importText("../day-4/input.txt").split(/\r?\n/).map(row => row.split("")) as Input
const input2 = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`.split(/\r?\n/).map(row => row.split("")) as Input

const getNeighbors = ({ rowIndex, colIndex }: { rowIndex: number, colIndex: number }) => {
    const directions = [-1, 0, 1]
    return directions
        .flatMap(directionY =>
            directions.flatMap(directionX => ({ rowIndex: rowIndex + directionY, colIndex: colIndex + directionX }))
        )
        .filter(v => v.colIndex !== colIndex || v.rowIndex !== rowIndex)
}

const removeRolls = (input: Input, numberOfRemovedRolls = 0, currentNumberOfRemovedRolls = -1) => {
    if (currentNumberOfRemovedRolls === 0) return numberOfRemovedRolls
    let newCurrentNumberOfRemovedRolls = 0
    const newInput = input.map((row, rowIndex) => {
        return row.map((v, colIndex) => {
            if (v === ".") return v
            const neighborsIndex = getNeighbors({ rowIndex, colIndex })
                .filter(direction => direction.colIndex >= 0 && direction.rowIndex >= 0 && direction.colIndex < row.length && direction.rowIndex < input.length)
            const numberOfNeighborRolls = neighborsIndex.reduce((acc, val) => input[val.rowIndex]![val.colIndex] === "@" ? (acc + 1) : acc, 0)
            if (numberOfNeighborRolls < 4) {
                newCurrentNumberOfRemovedRolls++
                return "."
            }
            return v
        })
    })
    // log(() => numberOfRemovedRolls + newNumberOfRemovedRolls, () => newNumberOfRemovedRolls)
    return removeRolls(newInput, numberOfRemovedRolls + newCurrentNumberOfRemovedRolls, newCurrentNumberOfRemovedRolls)
}

const result = input.flatMap((row, rowIndex) => {
    return row.flatMap((v, colIndex) => {
        const neighborsIndex = getNeighbors({ rowIndex, colIndex })
            .filter(direction => direction.colIndex >= 0 && direction.rowIndex >= 0 && direction.colIndex < row.length && direction.rowIndex < input.length)
        const numberOfNeighborRolls = neighborsIndex.reduce((acc, val) => input[val.rowIndex]![val.colIndex] === "@" ? (acc + 1) : acc, 0)
        return v === "@" && numberOfNeighborRolls < 4
    })
}).reduce((acc, val) => val ? acc + 1 : acc, 0)

const result2 = removeRolls(input)

export default {
    "part-1": result,
    "part-2": result2
}