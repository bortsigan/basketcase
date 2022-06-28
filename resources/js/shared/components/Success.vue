<template>
    <div class="text-center success">
        <i class="far fa-thumbs-up"></i>
        <h1 class="mt-4">Success!</h1>
        <h2> <slot></slot> </h2> <!-- slot is used for dynamic datas ex. messages, infos etc !-->
    </div>
</template>
<style scoped>
.success {
    color: #38c172 !important;
    font-size: 10rem;
}
</style>