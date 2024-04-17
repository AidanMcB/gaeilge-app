<script setup lang='ts'>
	import { ref } from 'vue';

    const flipped = ref(false);
    const flip = () => {
        if (flipped.value === false) {
            flipped.value = !flipped.value;
            setTimeout(() => {
                flipped.value = false;
            }, 1500)
        }
    };

</script>

<template>
	<div
		@click='flip'
		:class="['card-container hover:cursor-pointer', flipped ? 'flipped' : '']"
	>
		<div class='front'>
			<slot name='front'></slot>
		</div>
		<div class='back'>
			<slot name='back'></slot>
		</div>
	</div>
</template>

<style scoped lang='scss'>
.card-container {
    margin: 0;
    padding: 0;
    position: relative;
    box-sizing: border-box;
    width: 50%;

    .front,
    .back {
        background: rgba(0,0,0,0);
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        display: block;
        position: absolute;
        backface-visibility: hidden;
        transform-style: preserve-3d;
        transition: -webkit-transform ease 500ms;
        transition: transform ease 500ms;
    }
    .front {
        z-index: 2;
        transform: rotateY(0deg);
        /* front tile styles go here! */
    }
    .back {
        transform: rotateY(-180deg);
        /* back tile styles go here! */
    }

    &.flipped {
        .front {
            transform: rotateY(180deg);
        }
        .back {
            transform: rotateY(0deg);
        }
    }
}

@media (min-width: 1024px) and (max-width: 1535px) { 
    .card-container {
        width: 33%;
    }
}


@media (min-width: 1536px) {  
    .card-container {
        width: 33%;
    }
}
</style>
