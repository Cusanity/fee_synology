import $ from 'jquery'

const waterDict = {
    2021: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2022: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2023: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2024: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2025: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2026: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2027: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
}
const electricityDict = {
    2021: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2022: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2023: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2024: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2025: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2026: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2027: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
}
const gasDict = {
    2021: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2022: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2023: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2024: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2025: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2026: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2027: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
getData('http://' + window.location.hostname + '/php/water.php', waterDict)
getData('http://' + window.location.hostname + '/php/gas.php', gasDict)
getData(
    'http://' + window.location.hostname + '/php/electricity.php',
    electricityDict
)

const commonEchartsOption = {
    darkMode: 'auto',
    xAxis: {
        type: 'category',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    yAxis: {
        type: 'value',
    },
    series: [
        {
            // data: global.electricityData,
            type: 'bar',
            itemStyle: {
                normal: {label: {show: true}, color: '#91cc75'},
            },
        },
    ],
    title: {
        top: 'bottom',
        left: 'center',
    },
}

const totalEchartsOption = {
    darkMode: 'auto',
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
    },
    legend: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        containLabel: true,
    },
    xAxis: [
        {
            type: 'category',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
    ],
    yAxis: [
        {
            type: 'value',
        },
    ],
}

function genTotalOptionsForYear(year) {
    const yearSeries = genTotalSeriesForYear(year)
    return {
        ...totalEchartsOption,
        series: yearSeries,
        title: {
            text:
                year + ': $' + yearSeries.totalData.reduce((a, b) => a + b, 0),
            top: 'bottom',
            left: 'center',
        },
    }
}

function genTotalSeriesForYear(year) {
    const waterStack = {
        name: '水',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
            focus: 'series',
        },
        data: waterDict[year],
        itemStyle: {
            normal: {label: {show: true}, color: typeDict.water.color},
        },
    }
    const electricityStack = {
        name: '电',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
            focus: 'series',
        },
        data: electricityDict[year],
        itemStyle: {
            normal: {
                label: {show: true},
                color: typeDict.electricity.color,
            },
        },
    }
    const gasStack = {
        name: '气',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
            focus: 'series',
        },
        data: gasDict[year],
        itemStyle: {
            normal: {label: {show: true}, color: typeDict.gas.color},
        },
    }
    let mySeries = [waterStack, electricityStack, gasStack]
    let totalData = []
    for (let i = 0; i < waterStack.data.length; i++) {
        totalData.push(
            waterStack.data[i] + electricityStack.data[i] + gasStack.data[i]
        )
    }
    mySeries.totalData = totalData
    const totalStack = {
        name: '',
        stack: 'Ad2',
        type: 'bar',
        barGap: '-100%',
        data: totalData,
        itemStyle: {
            normal: {
                label: {
                    show: true,
                    position: 'top',
                },
                color: 'rgba(128, 128, 128, 0)',
            },
        },
    }
    mySeries.push(totalStack)
    return mySeries
}

function genSingleOptionForYear(type, year) {
    return {
        ...commonEchartsOption,
        series: [
            {
                ...commonEchartsOption.series[0],
                data: typeDict[type].dict[year],
                itemStyle: {
                    normal: {label: {show: true}, color: typeDict[type].color},
                },
            },
        ],
        title: {
            ...commonEchartsOption.title,
            text:
                year +
                ': $' +
                typeDict[type].dict[year].reduce((a, b) => a + b, 0),
        },
    }
}

const typeDict = {
    electricity: {
        color: '#fac858',
        dict: electricityDict,
    },
    gas: {
        color: '#91cc75',
        dict: gasDict,
    },
    water: {
        color: '#73c0de',
        dict: waterDict,
    },
}

export default {
    commonEchartsOption,
    waterDict,
    electricityDict,
    gasDict,
    genTotalOptionsForYear,
    genSingleOptionForYear,
    totalEchartsOption,
}
