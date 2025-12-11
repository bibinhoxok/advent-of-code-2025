import { importText, log } from "../util/index.ts"
type Tachyon = "S"
type Space = "."
type Beam = "|"
type Splitter = "^"
type Title = Tachyon | Space | Beam | Splitter
type Location = {
    rowIndex: number
    colIndex: number
}
type Node = Location[]
type LinkedList = Map<string, Node>
const rawInput = importText("../day-7/input.txt")
// const rawInput =
//     `.......S.......
// ...............
// .......^.......
// ...............
// ......^.^......
// ...............
// .....^.^.^.....
// ...............
// ....^.^...^....
// ...............
// ...^.^...^.^...
// ...............
// ..^...^.....^..
// ...............
// .^.^.^.^.^...^.
// ...............`
const input = rawInput.split(/\r?\n/).map(v => [...v]) as Title[][]
const defaultTitles = {
    Tachyon: "S" as Tachyon,
    Space: "." as Space,
    Beam: "|" as Beam,
    Splitter: "^" as Splitter,
}

const process = input.reduce((currentProcess, currentLine, lineIndex) => {
    if (lineIndex === 0) {
        return currentProcess.concat([currentLine])
    }
    const previousLine = currentProcess[lineIndex - 1] as Title[]

    return currentProcess.concat([currentLine.map((title, titleIndex) => {
        if (title === defaultTitles.Splitter) return defaultTitles.Splitter
        if (title === defaultTitles.Beam) return defaultTitles.Beam
        if (title === defaultTitles.Tachyon) return defaultTitles.Tachyon
        if (previousLine[titleIndex] === defaultTitles.Tachyon) return defaultTitles.Beam
        if (previousLine[titleIndex] === defaultTitles.Beam) return defaultTitles.Beam
        if (currentLine[titleIndex + 1] === defaultTitles.Splitter) {
            const aboveRight = previousLine[titleIndex + 1]
            if (aboveRight === defaultTitles.Beam || aboveRight === defaultTitles.Tachyon) {
                return defaultTitles.Beam
            }
        }
        if (currentLine[titleIndex - 1] === defaultTitles.Splitter) {
            const aboveLeft = previousLine[titleIndex - 1]
            if (aboveLeft === defaultTitles.Beam || aboveLeft === defaultTitles.Tachyon) {
                return defaultTitles.Beam
            }
        }
        return defaultTitles.Space
    })])
}, [] as Title[][])

const result = input.reduce((acc, currentLine, lineIndex) => {
    if (lineIndex === 0) {
        return acc
    }
    const previousLine = process[lineIndex - 1] as Title[]
    return currentLine.reduce((sum, title, index) => {
        if (title === defaultTitles.Splitter) {
            const above = previousLine[index]
            if (above === defaultTitles.Beam || above === defaultTitles.Tachyon) {
                return sum + 1
            }
        }
        return sum
    }, acc)
}, 0)

const getLocationKey = (location: Location) => `${location.rowIndex},${location.colIndex}`
const linkedList = process.reduce((list, currentLine, lineIndex) => {
    if (lineIndex === 0) {
        return list
    }
    const previousLine = process[lineIndex - 1] as Title[]
    return currentLine.reduce((sum, title, index) => {
        if (title === defaultTitles.Beam) {
            const location: Location = {
                rowIndex: lineIndex,
                colIndex: index
            }
            if (currentLine[index - 1] === defaultTitles.Splitter && (previousLine[index - 1] === defaultTitles.Beam)) {
                const aboveLeft: Location = {
                    rowIndex: lineIndex - 1,
                    colIndex: index - 1
                }
                const previousNode = sum.get(getLocationKey(location)) ?? []
                sum.set(getLocationKey(location), previousNode.concat([aboveLeft]))
            }
            if (currentLine[index + 1] === defaultTitles.Splitter && (previousLine[index + 1] === defaultTitles.Beam)) {
                const aboveRight: Location = {
                    rowIndex: lineIndex - 1,
                    colIndex: index + 1
                }
                const previousNode = sum.get(getLocationKey(location)) ?? []
                sum.set(getLocationKey(location), previousNode.concat([aboveRight]))
            }
            if (previousLine[index] === defaultTitles.Beam || previousLine[index] === defaultTitles.Tachyon) {
                const up: Location = {
                    rowIndex: lineIndex - 1,
                    colIndex: index
                }
                const previousNode = sum.get(getLocationKey(location)) ?? []
                sum.set(getLocationKey(location), previousNode.concat([up]))
            }
        }
        return sum
    }, list)
}, new Map() as LinkedList)
const lastLineBeams = process[process.length - 1]?.map((v, i) => {
    if (v === defaultTitles.Beam) {
        return ({
            rowIndex: process.length - 1,
            colIndex: i
        }) as Location
    }
}).filter(v => v !== undefined) as Location[]
const result2 = lastLineBeams.reduce((numberOfWays, lastLineBeamLocation) => {
    const memo = new Map<string, number>()
    const countTheWays = (location: Location): number => {
        const indexOfTachyon = input[0]?.findLastIndex(v => v === defaultTitles.Tachyon)
        const finalLocation = {
            rowIndex: 0,
            colIndex: indexOfTachyon,
        }
        const key = getLocationKey(location)
        if (memo.has(key)) return memo.get(key)!
        if (location.rowIndex === finalLocation.rowIndex && location.colIndex === finalLocation.colIndex) return 1
        const node = linkedList.get(key) ?? []
        const result = node.reduce((sum, locate) => sum + countTheWays(locate), 0)
        memo.set(key, result)
        return result
    }
    return numberOfWays + countTheWays(lastLineBeamLocation)
}, 0)
export default {
    "part-1": result,
    "part-2": result2
}