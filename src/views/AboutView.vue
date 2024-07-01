<template>
    <div class="text-center">
        <div>
            <label for="table-select">Select Table:</label>
            <select id="table-select" v-model="table" @change="fetchData">
                <option value="electricity">Electricity</option>
                <option value="water">Water</option>
                <option value="gas">Gas</option>
            </select>
        </div>
        <div v-if="loading">Loading...</div>
        <div v-else>
            <table>
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Month</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in tableData" :key="index">
                        <td>
                            <input v-model.trim="item.year" disabled />
                        </td>
                        <td>
                            <input v-model.trim="item.month" disabled />
                        </td>
                        <td><input v-model.trim="item.amount" /></td>
                        <td>
                            <button
                                @click="
                                    item.isNew
                                        ? insertData(index)
                                        : updateData(index)
                                "
                            >
                                {{ item.isNew ? 'Insert' : 'Update' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import {ref, onMounted} from 'vue'
    import axios from 'axios'

    // Define the data type for table data
    interface TableData {
        year: number
        month: number
        amount: number | string
        isNew?: boolean // Optional field to indicate new rows
    }

    const loading = ref(true)
    const tableData = ref<TableData[]>([]) // Provide the correct type for tableData
    const table = ref('electricity')

    const fetchData = async () => {
        loading.value = true
        try {
            const response = await axios.get(
                `https://fee.cusanity.synology.me/php/data.php?type=${table.value}`
            )
            debugger
            tableData.value = response.data.data.sort(
                (a: TableData, b: TableData) => {
                    if (a.year !== b.year) {
                        return b.year - a.year
                    }
                    return b.month - a.month
                }
            )
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            loading.value = false
        }
    }

    const updateData = async (index: number) => {
        const item = tableData.value[index]
        item.isNew = false
        try {
            const response = await axios.post(
                `https://fee.cusanity.synology.me/php/data.php?type=${table.value}`,
                item
            )
            if (response.data.status === 'success') {
                alert('Data updated successfully!')
            } else {
                alert('Error updating data.')
            }
        } catch (error) {
            console.error('Error updating data:', error)
        }
    }

    const insertData = async (index: number) => {
        const item = tableData.value[index]
        item.isNew = true
        try {
            const response = await axios.post(
                `https://fee.cusanity.synology.me/php/data.php?type=${table.value}`,
                item
            )
            if (response.data.status === 'success') {
                alert('Data inserted successfully!')
                fetchData() // Refresh the data after insertion
            } else {
                alert('Error inserting data.')
            }
        } catch (error) {
            console.error('Error inserting data:', error)
        }
    }

    onMounted(fetchData)
</script>

<style scoped>
    .text-center {
        text-align: center;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }

    th,
    td {
        border: 1px solid #ddd;
        padding: 8px;
    }

    th {
        background-color: #f2f2f2;
    }

    td input {
        width: 100%;
        box-sizing: border-box;
    }

    button {
        padding: 5px 10px;
        background-color: #4caf50;
        color: white;
        border: none;
        cursor: pointer;
    }

    button:hover {
        background-color: #45a049;
    }

    select {
        margin-top: 10px;
        padding: 5px;
    }
</style>
