<template>
    <div>
        <div 
            class="invalid-feedback" 
            v-for="(error, index) in errors" 
            :key="key(index)">
            {{ error }}
        </div>
    </div>
</template>

<script>
export default {
    props: ["errors"], //array
    methods: {
        key(index) {
            return `validation_errors_${index}_${Math.random()}`; //unique key
        }
    }
}
</script>

<style scoped>
    .form-control.is-invalid ~ div > .invalid-feedback {
        display: block;
    }
</style>