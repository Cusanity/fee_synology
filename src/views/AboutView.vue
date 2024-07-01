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
                        <td><input v-model.trim="item.year" /></td>
                        <td><input v-model.trim="item.month" /></td>
                        <td><input v-model.trim="item.amount" /></td>
                        <td>
                            <button @click="updateData(index)">Update</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
    import {ref, onMounted} from 'vue'
    import axios from 'axios'

    const loading = ref(true)
    const tableData = ref([])
    const table = ref('electricity')

    const fetchData = async () => {
        loading.value = true
        try {
            const response = await axios.get(
                `https://fee.cusanity.synology.me/php/data.php?type=${table.value}`
            )
            tableData.value = response.data.data.sort((a, b) => {
                if (a.year !== b.year) {
                    return b.year - a.year
                }
                return b.month - a.month
            })
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            loading.value = false
        }
    }

    const updateData = async (index) => {
        const item = tableData.value[index]
        item.table = table.value
        try {
            await axios.post(
                `https://fee.cusanity.synology.me/php/data.php?type=${table.value}`,
                item
            )
            alert('Data updated successfully!')
        } catch (error) {
            console.error('Error updating data:', error)
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
