import { importText, log } from "../util/index.ts"
type DigitState = {
    digit: number
    remainingString: string
}

type DigitStateMap = Map<number, DigitState>

const batteryBanks = importText("../day-3/input.txt").split(/\r?\n/)
const input2 = `987654321111111
811111111111119
234234234234278
818181911112111`.split(/\r?\n/)
const input3 = `98765432109876543210`.split(/\r?\n/)
const findLargestDigitAndSlice = (input: string, targetDigit = 9): [number, string] => {
    const digitIndex = input.indexOf(`${targetDigit}`)
    if (targetDigit < 0) return [0, ""]
    if (digitIndex >= 0) {
        // log(() => input.slice(digitIndex + 1))
        return [targetDigit, input.slice(digitIndex + 1)]
    }
    return findLargestDigitAndSlice(input, targetDigit - 1)
}
const totalJoltagePart1 = batteryBanks.map(bank => {
    const firstDigitState = findLargestDigitAndSlice(bank.slice(0, bank.length - 1))
    const secondDigitState = findLargestDigitAndSlice(firstDigitState[1].concat(bank.slice(bank.length - 1)))
    return firstDigitState[0] * 10 + secondDigitState[0]
}).reduce((a, v) => a + v)

const digitPositions = [...Array.from({ length: 12 }, (_, i) => 1 + i)]
const bankDigitMaps = batteryBanks.map(bank => {
    // log({ bank })
    const bankLength = bank.length
    const initialState: DigitState = { digit: 0, remainingString: bank }
    return digitPositions.reduce((accMap, positionIndex) => {
        const currentString = accMap.get(positionIndex - 1)?.remainingString ?? bank
        const availableString = currentString.slice(0, bankLength - 12).concat(bank.charAt(bankLength - 12 + positionIndex - 1))
        const [foundDigit, remaining] = findLargestDigitAndSlice(availableString)
        const nextState: DigitState = { digit: foundDigit, remainingString: remaining }
        // log({ availableString, positionIndex }, () => nextState)
        return accMap.set(positionIndex, nextState)
    }, new Map([[0, initialState]]) as DigitStateMap)
})

const totalJoltagePart2 = bankDigitMaps.map(digitMap => {
    return digitPositions.reduce((acc, position) => {
        const digit = digitMap.get(position)?.digit ?? 0
        return acc + digit * (10 ** (12 - position))
    }, 0)
}).reduce((a, v) => a + v, 0)
// log(() => totalJoltagePart2)
export default {
    "part-1": totalJoltagePart1,
    "part-2": totalJoltagePart2
}