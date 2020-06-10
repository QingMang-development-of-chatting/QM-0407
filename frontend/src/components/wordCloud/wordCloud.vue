<template>
    <div class="wordCloud">
        <el-image :src="imgSrc"></el-image>
    </div>
</template>

<script>
    export default {
        props: {
            imgSrc:String
        },
    };
</script>
