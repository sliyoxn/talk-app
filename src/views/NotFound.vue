<template>
    <div class="NotFound">
        <div class="title">404</div>
        <img src="https://i.postimg.cc/kgFyrfDc/image.png" alt="" draggable="false">
    </div>
</template>

<script>
    export default {
        name: "NotFound"
    }
</script>

<style scoped lang="less">
    .NotFound
    {
        height: 100%;
        width: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
        img
        {
            width: 30%;
            position: fixed;
            top: 40%;
            -webkit-user-drag: none;
            display: block;
        }
        .title
        {
            position: fixed;
            top: 20%;
            font-size: 80px;
            user-select: none;
        }
    }
</style>