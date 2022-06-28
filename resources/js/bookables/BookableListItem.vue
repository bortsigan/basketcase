<template>
    <div class="card">
        <div class="card-header">
            <span class="float-right">Price : <strong>₱ {{ price }}</strong></span>
        </div>
        <div class="card-body">
            <router-link :to="{ name: 'bookable', params: {id : id}}">
                <h5 class="card-title">{{ title }}</h5>
            </router-link>
            <p class="card-text">{{ description }}</p>
        </div>
    </div>
        
</template>

<script>

export default {
    // props: [
    //     "itemTitle", "itemContent", "itemPrice"
    // ],

    props: {
        id: Number,
        title : String,
        description : String,
        price : Number
    },
    mounted() {
        // console.log(this.title, this.description, this.price);
    }
}
</script>
