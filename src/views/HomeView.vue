<script setup>

</script>

<template>
  <div class="header-content">
    <h1 class="text-green-600">Gaeilge</h1>
    <RouterLink to="/quiz">
        <PrimeButton class='bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded'>Cleachtadh do chuid Ghaeilge</PrimeButton>
    </RouterLink>
    <RouterLink to="/matching">
        <PrimeButton class='bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded'>Cleachtadh do chuid Ghaeilge (Timer)</PrimeButton>
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">

.header-content {
    display: flex;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
    height: 100%;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  width: 100%;
  text-align: center;
}

h3 {
  font-size: 1.2rem;
}

.content h1,
.greetings h3 {
  display: flex;
  justify-content: center;
}

@media (min-width: 1024px) {

}
</style>
