<template>
    <header class="container-background header">
        <div class="logo-div">
            <router-link :to="{name: 'home'}" >
                <img src="../../assets/images/logo.png" class="logo" alt="Graving-logo">
            </router-link>
            <h1>Graving</h1>
        </div>

        <button class="hamburguer-icon" @click="toggleMenu">
            <span v-if="!isMenuOpen">☰</span>
            <span v-else>×</span>
        </button>

        <nav class="navegation-bar">
            <router-link v-if="isAdmin" :to="{name: 'dashboard'}" :class="{'current-page': currentPage==='dashboard'}">Panel</router-link>
            <router-link :to="{name: 'home'}" :class="{'current-page': currentPage==='home'}">Inicio</router-link>
            <router-link :to="{name: 'map'}" :class="{'current-page': currentPage==='map'}">Mapa</router-link>
            <router-link :to="{name: 'searchDeceased'}" :class="{'current-page': currentPage==='searchDeceased'}">Difuntos</router-link>
            
            <div class="dropdown" @mouseenter="isDropdownOpen = true" @mouseleave="isDropdownOpen = false">
                <span class="dropdown-toggle">Cuenta</span>
                
                <Transition name="fade-slide">
                    <div class="dropdown-menu" v-if="isDropdownOpen">
                        <template v-if="isLoggedIn">
                            <router-link :to="{name: 'profile'}">Ver Perfil</router-link>
                            <button @click.prevent="handleLogOut">Cerrar Sesión</button>
                        </template>
                        <template v-else>
                            <router-link :to="{name: 'login'}">Iniciar Sesión</router-link>
                            <router-link :to="{name: 'register'}">Registrarse</router-link>
                        </template>
                    </div>
                </Transition>
            </div>
        </nav>

        <Transition name="slide-down">
            <nav v-if="isMenuOpen" class="navegation-bar-mobile">
                <router-link :to="{ name: 'home' }" @click="closeMenu">Inicio</router-link>
                <router-link :to="{ name: 'map' }" @click="closeMenu">Mapa</router-link>
                <router-link :to="{ name: 'searchDeceased' }" @click="closeMenu">Difuntos</router-link>
                <router-link v-if="isAdmin" :to="{ name: 'dashboard' }" @click="closeMenu">Panel</router-link>
                <template v-if="isLoggedIn">
                    <router-link :to="{ name: 'profile' }" @click="closeMenu">Ver Perfil</router-link>
                    <button @click.prevent="handleLogOut">Cerrar Sesión</button>
                </template>
                <template v-else>
                    <router-link :to="{ name: 'login' }" @click="closeMenu">Iniciar Sesión</router-link>
                    <router-link :to="{ name: 'register' }" @click="closeMenu">Registrarse</router-link>
                </template>
                
            </nav>
        </Transition>
    </header>
</template>

<script setup>
    import { useRoute, useRouter } from 'vue-router'
    import { ref, computed, nextTick } from 'vue'
    import { useAuthStore } from '@/stores/authStore'
    import { useToast } from '@/composables/useToast'
    import { useConfirmModal } from '@/composables/useConfirmModal'

    const { showConfirmModal } = useConfirmModal()
    const { showToast } = useToast()
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    
    const currentPage = computed(() => route.name)
    const isLoggedIn = computed(() => authStore.isLoggedIn)
    const isAdmin = computed(() => authStore.isAdmin)

    const isMenuOpen = ref(false)
    const isDropdownOpen = ref(false)

    const toggleMenu = () => {
        isMenuOpen.value = !isMenuOpen.value
    }

    const closeMenu = () => {
        isMenuOpen.value = false
    }

    const handleLogOut = async () => {
        const confirmed = await showConfirmModal('¿Estás seguro de que deseas cerrar sesión?')
        if (!confirmed) {
            return;
        }

        authStore.logout()
        closeMenu()
        showToast('Sesión cerrada correctamente', 'info')
        await nextTick()
        router.push({ name: 'login'})
    }
</script>

<style scoped>
    .header {
        display: flex;
        justify-content: space-around;
        box-shadow: 2px 2px 8px var(--shadow-color);
        position: relative;
    }

    .logo-div {
        display: flex;
        align-items: center;
    }

    .logo {
        width: 7rem;
    }

    .navegation-bar {
        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 3.5rem;
    }

    .navegation-bar a, .navegation-bar button, .navegation-bar-mobile button {
        display: flex;
        align-items: center;
        height: 100%;
        text-decoration: none;
        color: var(--font-color);
        font-size: 1.1rem;
    }

    .navegation-bar button, .navegation-bar-mobile button {
        background-color: white;
        border: none;
    }

    .navegation-bar a:hover, .navegation-bar button:hover {
        border-bottom: 4px solid var(--purple-color);
        color: var(--purple-color);
    }

    .current-page {
        border-bottom: 4px solid var(--purple-color);
        color: var(--purple-color) !important;
    }

    .dropdown {
        position: relative;
    }

    .dropdown:hover .dropdown-toggle {
        color: var(--purple-color);
    }

    .dropdown-toggle::after {
        content: "▼";
        font-size: 0.7em;
        margin-left: 4px;
    }

    .dropdown-menu {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        background-color: white;
        border-radius: 5px;
        min-width: 150px;
        z-index: 10;
        flex-direction: column;
        row-gap: 1rem;
        padding: 20px;
        box-shadow: 5px 5px 8px var(--shadow-color);
    }

    .dropdown-menu a {
        padding: 10px 5px;
    }
    
    .dropdown:hover .dropdown-menu {
        display: flex;
    }

    .hamburguer-icon {
        display: none;
        background-color: white;
        border: none;
        align-items: center;
        font-size: 2rem;
        cursor: pointer;
    }

    .navegation-bar-mobile {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: white;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1rem 0;
        z-index: 90;
        box-shadow: 0 4px 8px var(--shadow-color);
    }

    .navegation-bar-mobile a {
        text-decoration: none;
        font-size: 1.3rem;
        color: var(--font-color);
    }

    @media (max-width: 770px) { 
        .header {
            justify-content: space-between;
        }

        .navegation-bar {
            display: none;
        }

        .hamburguer-icon {
            display: flex;
            margin-right: 1.5rem;
        }
    }

    @media (min-width: 771px) {
        .navegation-bar-mobile {
            display: none;
        }
    }

    .slide-down-enter-active, .slide-down-leave-active {
        transition: all 0.2s ease;
    }

    .slide-down-enter-from, .slide-down-leave-to  {
        opacity: 0;
        transform: translateY(-20px);
    }

    .slide-down-enter-to, .slide-down-leave-from {
        opacity: 1;
        transform: translateY(0);
    }

    .fade-slide-enter-active, .fade-slide-leave-active {
        transition: opacity 0.2s ease, transform 0.2s ease;
    }

    .fade-slide-enter-from, .fade-slide-leave-to {
        opacity: 0;
        transform: translateY(-10px);
    }

    .fade-slide-enter-to, .fade-slide-leave-from {
        opacity: 1;
        transform: translateY(0);
    }
</style>