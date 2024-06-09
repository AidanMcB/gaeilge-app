<script setup lang='ts'>
import { useMouse } from '../composables/mouse-tracker';
const { x, y } = useMouse()

</script>


<template>
  <div class='about'>
    <h1 class='text-2xl'>This is an about page</h1>
    <PrimeButton>does nothing yet</PrimeButton>
    <span>Mouse position is at: {{ x }}, {{ y }}</span>

  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
