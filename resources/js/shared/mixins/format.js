import moment from "moment";

export default {
    filters: {
        formatPrice(price) {
            return (price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        },
        formatDate(date) {
            return moment(date).format("MMMM D, YYYY");
        }
    }
};