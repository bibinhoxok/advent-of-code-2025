import { importText, log } from "../util/index.ts"
type Range = [number, number]
const input = importText("../day-2/input.txt").split(",")
// const input = "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124".split(",")
// const input = "1-100000".split(",")
const rangeArray = input.map(v => (v.split("-").map(v => Number.parseInt(v)))).filter((arr): arr is Range => arr.length === 2)
const getNumberOfDigits = (number: number) => Math.floor(Math.log10(number)) + 1
const getFirstHalfDigitsOfNumber = (evenDigitsNumber: number) => Math.floor(evenDigitsNumber / (10 ** ((getNumberOfDigits(evenDigitsNumber)) / 2)))
const getArrayFromRange = ([min, max]: Range) => Array.from({ length: max - min + 1 }, (_, i) => min + i)
const getFactor = (number: number) => [...[...Array(Math.floor(Math.sqrt(number)) + 1).keys()]
    .reduce((a, v) => {
        if (number % v === 0) {
            a.add(v)
            a.add(number / v)
        }
        return a
    }, new Set<number>())].sort((a, b) => a - b)
const getNumberWithRepeatTimes = (number: number, repeatTime: number) => [...Array(repeatTime).keys()].reduce((a, v) => a + number * (10 ** (getNumberOfDigits(number) * v)), 0)
const getFirstdigits = (number: number, numberOfDigits: number) => Math.floor(number / 10 ** (getNumberOfDigits(number) - numberOfDigits))
const numbersInPatternInRange = (range: Range, numberOfDigitsInPattern: number) => {
    const [start, end] = range
    const firstDigitsRange: Range = [getFirstdigits(start, numberOfDigitsInPattern), getFirstdigits(end, numberOfDigitsInPattern)]
    return getArrayFromRange(firstDigitsRange).map(v => getNumberWithRepeatTimes(v, getNumberOfDigits(start) / numberOfDigitsInPattern)).filter(v => v >= start && v <= end)
}

const result = rangeArray.flatMap(range => {
    const [start, end] = range
    const numberOfDigitsInRange = getArrayFromRange([getNumberOfDigits(start), getNumberOfDigits(end)] as Range)
    const evenNumberOfDigitsInRange = numberOfDigitsInRange.filter(v => v !== 0 && v % 2 === 0)
    return evenNumberOfDigitsInRange.flatMap(numberOfDigits => {
        const rangeOfDigit: Range = [10 ** (numberOfDigits - 1), (10 ** numberOfDigits) - 1]
        const rangeOfDigitInResult: Range = [rangeOfDigit[0] < start ? start : rangeOfDigit[0], rangeOfDigit[1] > end ? end : rangeOfDigit[1]]
        const rangeOfFirstHalfDigitInResult: Range = [getFirstHalfDigitsOfNumber(rangeOfDigitInResult[0]), getFirstHalfDigitsOfNumber(rangeOfDigitInResult[1])]
        // log({ rangeCheck: 565565 >= start }, { numberOfDigitsInRange }, { evenNumberOfDigitsInRange }, { rangeOfDigit }, { rangeOfDigitInResult }, { rangeOfFirstHalfDigitInResult })
        return getArrayFromRange(rangeOfFirstHalfDigitInResult).map(v => v * (10 ** getNumberOfDigits(v)) + v).filter(v => v >= start && v <= end)
    })
}).reduce((a, v) => a + v, 0)

const result2 = [...new Set(rangeArray.flatMap(range => {
    const [start, end] = range
    const numberOfDigitsInRange = getArrayFromRange([getNumberOfDigits(start), getNumberOfDigits(end)] as Range)
    const factorOfNumberOfDigitsInRange = new Map<number, number[]>(numberOfDigitsInRange.map(v => [v, getFactor(v)]))
    return [...factorOfNumberOfDigitsInRange].flatMap(digitAndFactor => {
        const [digit, factors] = digitAndFactor
        const rangeOfDigit: Range = [10 ** (digit - 1), (10 ** digit) - 1]
        const [digitStart, digitEnd] = rangeOfDigit
        const rangeOfDigitInResult: Range = [digitStart < start ? start : digitStart, digitEnd > end ? end : digitEnd]
        const arrayOfNumberOfDigitsInPattern = factors.filter(v => v !== factors[factors.length - 1])
        return arrayOfNumberOfDigitsInPattern.flatMap(numberOfDigitsInPattern => numbersInPatternInRange(rangeOfDigitInResult, numberOfDigitsInPattern))
    })
}))].reduce((a, v) => a + v, 0)

export default {
    "part-1": result,
    "part-2": result2
}