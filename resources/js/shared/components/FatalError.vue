<template>
	<div class="text-center">
		<i class="fas fa-bomb error"></i>
		<h1 class="mt-4 error-text">Unexpected error occured</h1>
		<h5>Sorry, but we cannot proceed to your process this time.</h5>
		<router-link class="btn btn-outline-secondary btn-sm" :to="{name: 'bookables'}"><i class="fas fa-home"></i> Home Page</router-link>
	</div>
</template>

<style scoped>
	.error {
		color: #EC6D6D;
		font-size: 10rem;
	}

	.error-text {
		color : #EC6D6D;
		font-size: 5rem;
	}
</style>
