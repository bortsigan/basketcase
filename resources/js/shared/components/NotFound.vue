<template>
    <div class="text-center">
        <i class="fas fa-exclamation-circle error"></i>
        <div class="muted">
            <h1 class="mt-4">404</h1>
            <h2>We cannot find what you're looking for  </h2>
        </div>
        <router-link class="btn btn-outline-secondary btn-sm" :to="{name: 'bookables'}"><i class="fas fa-home"></i> Home Page</router-link>
    </div>
</template>

<style scoped>
.error {
    color: #842029!important;
    font-size: 10rem;
}

.muted {
    color: #6c757d!important;
    font-size: 30rem;
}
</style>