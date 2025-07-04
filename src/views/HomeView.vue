<template>
  <div class="home-view-top">
    <div class="home-view-logo">
               
          <img src="../assets/images/logo.png" class="logo" alt="Graving-logo">
        
    </div>
    <div class="home-view-components">
        <h1>
          Busca tumbas, recuerda historias
        </h1>
        <p class="subtitle">
          Busca, encuentra y recuerda. Este sitio fue creado para rendir homenaje a tus seres queridos.
        </p>
        <router-link v-if="isLoggedIn" :to="{name: 'searchDeceased'}" class="purple-button">Difuntos</router-link>
        <router-link v-else :to="{name: 'login'}" class="purple-button">Iniciar Sesión</router-link>
        <router-link :to="{name: 'map'}" class="outline-white-button">Mapa</router-link>
    </div>
  </div>
  <GraveMap />
</template>

<script setup>
  import GraveMap from '@/components/map/GraveMap.vue'
  import { computed } from 'vue'
  import { useAuthStore } from '@/stores/authStore'

  const authStore = useAuthStore()
  const isLoggedIn = computed(() => authStore.isLoggedIn)
</script>

<style scoped>
.home-view-top {
  display: flex;
  min-height: 75vh;
  text-align: center;
  
}
.home-view-components{
  display: flex;
  flex-direction: column; 
  align-items: center;    
  justify-content: center;
  gap: 2rem;            
  width: 40%;
  text-align: center;    
  padding: 1rem;
}

.home-view-components a{
  width: 50%;
}

.home-view-logo{
  display: flex;
  flex-direction: column; 
  align-items: center;   
  width: 50%;
  justify-content: center; 
  gap: 2rem;            
  text-align: center;   
  padding: 1rem;       
}

.logo{
  width: 650px;
  height: 500px;
}

.purple-button{
  margin-top: 30px;
}

.subtitle {
  font-size: 20px;
  line-height: 1.6;
  color: #555;
  margin-top: -15px;
}

h1{
  font-size: 40px;
}

label{
  font-size: 20px;
}

@media (max-width: 800px) {
  .home-view-top {
    flex-direction: column; 
    height: auto; 
    padding: 2rem 0; 
  }
  .home-view-logo,
  .home-view-components {
    width: 90%; 
    margin: auto;
  }
  .home-view-logo {
    order: 1; 
    padding-bottom: 0;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  .logo{
    width: 90%;
    max-width: 450px;
    height: auto;
    max-height: 300px;
    margin: auto;
  }
  h1{
    font-size: 30px;
  }
  label{
    font-size: 15px;
  }
  .home-view-components {
    order: 2; 
    gap: 1rem; 
  }
}
</style>