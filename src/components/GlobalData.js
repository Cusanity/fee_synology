import $ from 'jquery'

const [waterDict, electricityDict, gasDict] = Array.from({length: 3}, () =>
    Object.fromEntries(
        Array.from({length: new Date().getFullYear() - 2020}, (_, i) => [
            2021 + i,
            Array(12).fill(0),
        ])
    )
)
function getData(url, dict) {
    const res = JSON.parse(
        $.ajax({
            type: 'GET',
            url: url,
            async: false,
        }).responseText
    ).data
    for (let obj of res) {
        const amount =
            typeof obj.amount === 'number' && !Number.isNaN(obj.amount)
                ? obj.amount
                : 0
        if (
            amount > 0 &&
            obj &&
            obj.year !== undefined &&
            obj.month !== undefined
        ) {
            if (!dict[obj.year]) {
                dict[obj.year] = Array(12).fill(0) // Initialize an array of 12 months with default value 0
            }
            dict[obj.year][obj.month - 1] = amount
        }
    }
}
getData('https://fee.cusanity.synology.me/php/data.php?type=water', waterDict)
getData('https://fee.cusanity.synology.me/php/data.php?type=gas', gasDict)
getData(
    'https://fee.cusanity.synology.me/php/data.php?type=electricity',
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
            type: 'bar',
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        color: '#000000', // Force black text
                        backgroundColor: 'transparent', // Remove any background
                    },
                    color: '#91cc75',
                },
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
    // Create a consistent label configuration for all series
    const labelConfig = {
        show: true,
        color: '#000000', // Force black text for all labels
        backgroundColor: 'transparent', // Remove any background
    }

    const waterStack = {
        name: '水',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
            focus: 'series',
        },
        data: waterDict[year],
        itemStyle: {
            normal: {label: labelConfig, color: typeDict.water.color},
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
                label: labelConfig,
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
            normal: {label: labelConfig, color: typeDict.gas.color},
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
                    color: '#000000', // Force black text
                    backgroundColor: 'transparent', // Remove any background
                },
                color: 'rgba(128, 128, 128, 0)',
            },
        },
    }
    mySeries.push(totalStack)
    return mySeries
}

function genSingleOptionForYear(type, year) {
    // Create a label configuration that's consistent for all chart types
    const labelConfig = {
        show: true,
        color: '#000000', // Force black text for all labels
        backgroundColor: 'transparent', // Remove any background
    }

    return {
        ...commonEchartsOption,
        series: [
            {
                ...commonEchartsOption.series[0],
                data: typeDict[type].dict[year],
                itemStyle: {
                    normal: {
                        label: labelConfig,
                        color: typeDict[type].color,
                    },
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
        color: '#ffc107',
        dict: electricityDict,
    },
    gas: {
        color: '#ff9800',
        dict: gasDict,
    },
    water: {
        color: '#2196f3',
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
