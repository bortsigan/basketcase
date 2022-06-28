<template>
	<div class="d-flex" v-bind:class="[isReviewedStar ?  'disable-star-event' : ''] ">
		<i
			class="fas fa-star"
			v-for="star in fullStars"
			:key="'full' + star"
			@click="$emit('input', star)"
		></i>
		<!-- emit the event when there is something happened in the child component !-->
		<i class="fas fa-star-half-alt" v-if="halfStar"></i>
		<i
			class="far fa-star"
			v-for="star in emptyStars"
			:key="'empty' + star"
			@click="$emit('input', fullStars + star)"
		></i>
		<!-- emit the event when there is something happened in the child component !-->
	</div>
</template>

<script>
	export default {
		props: {
			value: Number,
			isReviewed : Boolean
		},
		computed: {
			halfStar() {
				const fraction = Math.round((this.value - Math.floor(this.value)) * 100);

				return fraction > 0 && fraction < 50;
			},
			fullStars() {
				// > 4.5 = 5 stars
				// 4.3 = 4 and half
				return Math.round(this.value);
			},
			emptyStars() {
				// if rating would be 1.9, ceil(1.9) = 2, 5 - 2 = 3, render 3 empty stars
				return 5 - Math.ceil(this.value);
			},
			isReviewedStar() {
				return this.isReviewed;
			}
		}
	};
</script>

<style>
.disable-star-event {
	pointer-events: none;
}
</style>