<template>
    <div class="flex flex-col mt-[30vh]  h-full w-full">
        <h1 class="text-emerald-500 text-5xl m-4 md:w-full lg:text-8xl">Cleachtadh Gaeilge</h1>
        <div class="flex flex-col md:flex-row gap-4 justify-center items-center">
            <RouterLink to="/section-select">
                <PrimeButton
                    class="bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded sm:text-lg md:text-2xl"
                    >Cleachtadh do chuid Ghaeilge</PrimeButton
                >
            </RouterLink>
            <RouterLink to="/notecards">
                <PrimeButton
                    class="bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded sm:text-lg md:text-2xl"
                    >Cártaí Nótaí</PrimeButton
                >
            </RouterLink>
        </div>
    </div>
</template>

<style scoped lang="scss">


.content-wrapper {
    transform: translateY(-15vh); /* Position about 1/3 from the top */
}

h1 {
    font-weight: 500;
    font-size: 2.6rem;
    text-align: center;
    margin-bottom: 2rem;
}

h3 {
    font-size: 1.2rem;
}

.content h1,
.greetings h3 {
    display: flex;
    justify-content: center;
}

@media (max-width: 768px) {
    .content-wrapper {
        transform: translateY(-10vh); /* Less shift on mobile */
        width: 90%;
    }
}
</style>
