export default {
    data() {
        return {
            errors: null
        }
    },
    methods: {
        errorFor(field) {
            return this.errors !== null && this.errors[field] 
                        ? this.errors[field] 
                        : null;
        }
    }
};
/** acts as template w/ functionality and can be overriden too */