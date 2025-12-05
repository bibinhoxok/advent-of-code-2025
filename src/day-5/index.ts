import { importText, log } from "../util/index.ts"
type Range = [number, number]
const input = importText("../day-5/input.txt").split(/\r?\n/)
// const input =
//     `3-5
// 10-14
// 12-18
// 16-20

// 1
// 5
// 8
// 11
// 17
// 32`.split(/\r?\n/)
const blankIndex = input.findIndex(v => v === "")
const ranges = input.slice(0, blankIndex).map(v => (v.split("-").map(v => Number.parseInt(v)))).filter((arr): arr is Range => arr.length === 2)
const ids = input.slice(blankIndex + 1).map(v => Number.parseInt(v))
const result = ids.filter(id => ranges.some(range => id >= range[0] && id <= range[1])).length
const isOverlapped = (a: Range, b: Range) => !(a[0] > b[1] || a[1] < b[0])
const addARangeInmainRanges = (mainRanges: Range[], addingRange: Range) => {
    const overlappedRanges = mainRanges.filter(v => isOverlapped(v, addingRange))
    const separatedRanges = mainRanges.filter(range => !overlappedRanges.some(v => range == v))
    // log({ addingRange, mainRanges, separatedRanges, overlappedRanges })
    const unionRange = overlappedRanges.reduce((currentRange, range) => {
        const [rangeStart, rangeEnd] = range
        const [currentRangeStart, currentRangeEnd] = currentRange
        const newRangeStart = rangeStart < currentRangeStart ? rangeStart : currentRangeStart
        const newRangeEnd = rangeEnd > currentRangeEnd ? rangeEnd : currentRangeEnd
        return [newRangeStart, newRangeEnd] as Range
    }, addingRange)
    return separatedRanges.concat([unionRange]).sort((a, b) => a[0] - b[0])
}
const result2 = ranges.reduce(addARangeInmainRanges, [] as Range[]).reduce((a, v) => a + v[1] - v[0] + 1, 0)
// log({ blankIndex, ranges, ids, result2 })

export default {
    "part-1": result,
    "part-2": result2
}