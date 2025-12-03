import { importText } from "../util/index.ts"
type Direction = "L" | "R"
type Instruction = [Direction, number]
const input = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`.split(/\r?\n/)
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
    const amount = input[1]
    let start, end

    if (input[0] === "L") {
        start = state - amount
        end = state
    } else {
        start = state
        end = state + amount
    }
    const count = Math.floor((end - 1) / 100) - Math.floor(start / 100)
    return count
}
const rotateAndCountZeroInRotate = (state: [number, number], input: Instruction): [number, number] => {
    console.log([((state ?? [50, 0])[0] ?? 50), input, rotate(((state ?? [50, 0])[0] ?? 50), input), countZeroInRotate(((state ?? [50, 0])[0] ?? 50), input)])
    return [rotate(((state ?? [50, 0])[0] ?? 50), input), countZeroInRotate(((state ?? [50, 0])[0] ?? 50), input)]
}
const listCountedZeroInRotate = (state: [number, number][], input: Instruction): [number, number][] => {
    return [...state, rotateAndCountZeroInRotate(((state[state.length - 1] ?? [50, 0])), input)]
}
const rotatedList = splited.reduce(listRotated, [50])
const countedZero = rotatedList.filter(val => val === 0).length
const zeroInRotateList = splited.reduce(listCountedZeroInRotate, [[50, 0]])
const countedZeroInRotate = zeroInRotateList.reduce((acc, val) => acc + val[1], 0)
console.log(countedZeroInRotate+countedZero)
