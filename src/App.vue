<script setup lang="ts">

</script>

<template>
    <div class="app-wrapper">
        <header>
            <div class="nav-wrapper">
                <NavBar />
            </div>
        </header>
        <RouterView :key="$route.fullPath" />
    </div>
</template>

<style scoped>
.app-wrapper {
    height: 100%;
    width: 100%;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  text-align: center;
  margin-top: 2rem;

}


@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        justify-content: flex-end;
    }
}
</style>
