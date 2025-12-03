import { importText } from "../util/index.ts"
type Direction = "L" | "R"
type Instruction = [Direction, number]
const input = importText("../day-1/input.txt").split(/\r?\n/)
const splited = input.map(val => ([val[0], Number.parseInt(val.slice(1))])) as Instruction[]
const rotate = (state: number, input: Instruction) => {
    if (input[0] === "L") {
        return (state - input[1] % 100 + 100) % 100
    } else {
        return (state + input[1] % 100 + 100) % 100
    }
}
const listRotated = (state = [50], input: Instruction) => {
    return [...state, rotate((state[state.length - 1] ?? 50), input)]
}
const countZeroInRotate = (state: number, input: Instruction) => {
    if (input[0] === "L") {
        return Math.floor((state - 1) / 100) - Math.floor((state - input[1]) / 100)
    } else {
        return Math.floor((state + input[1] - 1) / 100) - Math.floor(state / 100)
    }
}
const rotateAndCountZeroInRotate = (state: [number, number], input: Instruction): [number, number] => {
    return [rotate(((state ?? [50, 0])[0]), input), countZeroInRotate(((state ?? [50, 0])[0]), input)]
}
const listCountedZeroInRotate = (state: [number, number][], input: Instruction): [number, number][] => {
    return [...state, rotateAndCountZeroInRotate(((state[state.length - 1] ?? [50, 0])), input)]
}
const rotatedList = splited.reduce(listRotated, [50])
const countedZero = rotatedList.filter(val => val === 0).length
const zeroInRotateList = splited.reduce(listCountedZeroInRotate, [[50, 0]])
const countedZeroInRotate = zeroInRotateList.reduce((acc, val) => acc + val[1], 0)
export default {
    "part-1": countedZero,
    "part-2": countedZeroInRotate + countedZero
}
