import $ from 'jquery'

function getDataFromDict(dict) {
    let currCount = 0
    let tempYear = currYear
    const res = []
    while (currCount < monthDisplayNum) {
        const currMonth =
            latestMonth - currCount > 0
                ? latestMonth - currCount
                : 12 - (Math.abs(latestMonth - currCount) % 12)
        res.unshift(dict[tempYear][(currMonth - 1) % 12])
        if (currMonth == 1) tempYear--
        currCount++
    }
    return res
}

function getLatestMonthIdx() {
    for (let i = 11; i >= 0; i--) {
        if (
            waterDict[currYear][i] ^
            electricityDict[currYear][i] ^
            (gasDict[currYear][i] !== 0)
        )
            return i
    }
    return 12
}
// const waterDict = {
//     2021: [0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150],
//     2022: [198, 198, 198, 170, 170, 170, 0, 0, 0, 0, 0, 0],
// }
// const electricityDict = {
//     2021: [0, 0, 0, 0, 0, 0, 0, 0, 0, 65, 115, 118],
//     2022: [158, 171, 148, 120, 120, 186, 214, 296, 0, 0, 0, 0],
// }
// const gasDict = {
//     2021: [0, 0, 0, 0, 0, 0, 0, 0, 0, 80, 189, 304],
//     2022: [407, 373, 316, 253, 139, 112, 113, 103, 0, 0, 0, 0],
// }
const waterDict = {
    2021: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2022: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2023: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2024: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
}
const electricityDict = {
    2021: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2022: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2023: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2024: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
}
const gasDict = {
    2021: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2022: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2023: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2024: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
}

function getData(url, dict) {
    const res = JSON.parse(
        $.ajax({
            type: 'GET',
            url: url,
            async: false,
        }).responseText
    ).data
    for (let obj of res) {
        dict[obj.year][obj.month - 1] = obj.amount
    }
}
getData('http://fee.yanchao.me/php/water.php', waterDict)
getData('http://fee.yanchao.me/php/gas.php', gasDict)
getData('http://fee.yanchao.me/php/electricity.php', electricityDict)
const currYear = new Date().getFullYear()
const monthRange = []
const monthDisplayNum = 9
const latestMonth = getLatestMonthIdx() + 1
for (let i = 0; i < monthDisplayNum; i++) {
    const currMonth =
        latestMonth - i > 0
            ? latestMonth - i
            : 12 - (Math.abs(latestMonth - i) % 12)
    monthRange.unshift(currMonth)
}

const waterData = getDataFromDict(waterDict)
const electricityData = getDataFromDict(electricityDict)
const gasData = getDataFromDict(gasDict)
export default {
    monthRange,
    waterData,
    electricityData,
    gasData,
}
