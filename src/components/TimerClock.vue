<script setup lang='ts'>
import { onMounted, ref } from "vue";
interface TimerProps {
  countdownTime: number;
}

const props = withDefaults(defineProps<TimerProps>(), {
    countdownTime: 45
})

const time = props.countdownTime;
const timer = ref(time);


// onMounted( () => {
    if(timer.value > 0) {
        console.log('i ran')
        setTimeout(() => {
            timer.value -= 1;
        }, 1000)
    }else {
        console.log('TIMES UP')
    }
// });


</script>

<template>
    <div class='timer'>
        {{ timer }}
    </div>
</template>


<style lang='ts'>
</style>