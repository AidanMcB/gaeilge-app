<script>
	import { ref } from 'vue';

    export default {
        name: 'FlippingCard',
        props: {
            bgColor: {
                type: Object,
                default: function () {
                    return {
                        front: 'rgba(0,0,0,0)',
                        back: 'rgba(0,0,0,0)',
                    };
                },
            },
        },
        setup() {
           const flipped = ref(false);
           const flip = () => {
               flipped.value = !flipped.value;
           };
           return { flipped, flip };
        },
    };
</script>

<template>
	<div
		@mouseenter='flip'
		@mouseleave='flip'
		:class="['card-container hover:cursor-pointer', flipped ? 'flipped' : '']"
	>
		<div class='front' :style='{ background: bgColor.front }'>
			<slot name='front'></slot>
		</div>
		<div class='back' :style='{ background: bgColor.back }'>
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

    .front,
    .back {
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
</style>
