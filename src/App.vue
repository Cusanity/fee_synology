<template>
    <div class="wrapper">
        <router-view v-slot="{Component}">
            <transition name="fade" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
        <!-- Floating buttons for navigation -->
        <div class="floating-buttons" v-if="showFooter">
            <router-link to="/waterChart" class="float-btn water-btn"
                >水</router-link
            >
            <router-link
                to="/electricityChart"
                class="float-btn electricity-btn"
                >电</router-link
            >
            <router-link to="/gasChart" class="float-btn gas-btn"
                >气</router-link
            >
            <router-link to="/totalChart" class="float-btn total-btn"
                >总</router-link
            >
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from 'vue'

    export default defineComponent({
        name: 'App',
        computed: {
            showFooter() {
                return this.$route.path.split('/').length < 3
            },
        },
    })
</script>

<style>
    .floating-buttons {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        z-index: 1000;
    }

    .float-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px; /* 更小的按钮尺寸 */
        height: 30px; /* 更小的按钮尺寸 */
        border-radius: 50%;
        color: white;
        font-weight: thinner;
        text-decoration: none;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        font-size: 10px; /* 减小字体大小 */
    }

    .float-btn:hover,
    .float-btn:active {
        transform: scale(1.05);
        box-shadow: 0 6px 14px rgba(0, 0, 0, 0.4);
    }

    .water-btn {
        background-color: #2196f3; /* Water is blue */
    }
    .water-btn:hover {
        background-color: #1976d2; /* Darker blue on hover */
    }

    .electricity-btn {
        background-color: #ffc107; /* Electricity is amber */
    }
    .electricity-btn:hover {
        background-color: #ffb300; /* Darker amber on hover */
    }

    .gas-btn {
        background-color: #ff9800; /* Gas is orange */
    }
    .gas-btn:hover {
        background-color: #fb8c00; /* Darker orange on hover */
    }

    .total-btn {
        background-color: #4caf50; /* Total is green */
    }
    .total-btn:hover {
        background-color: #388e3c; /* Darker green on hover */
    }
</style>
