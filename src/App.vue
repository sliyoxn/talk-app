<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>


    export default {
        name: 'app',
        components: {

        }
    }
</script>

<style>
    :root,body
    {
        width: 100%;
        height: 100%;
        margin: 0;
        box-sizing: border-box;
    }

    #app {
        height: 100%;
    }
</style>
