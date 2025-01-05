<template>
    <div class='main-content'>
        <h1 class='text-emerald-500 text-5xl m-4 md:w-full lg:text-8xl'>Cleachtadh Gaeilge</h1>
        <RouterLink to='/section-select'>
            <PrimeButton class='bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded sm:text-lg md:text-2xl'>Cleachtadh do chuid Ghaeilge</PrimeButton>
        </RouterLink>
        <RouterLink to='/notecards'>
            <PrimeButton class='bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded sm:text-lg md:text-2xl'>Cártaí Nótaí</PrimeButton>
        </RouterLink>
    </div>
</template>

<style scoped lang='scss'>
.main-content {
    display: flex;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
    min-height: 100%;
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
</style>
