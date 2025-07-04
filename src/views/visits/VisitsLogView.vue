<template>
  <div class="user-visits-container">
    <div class="profile-center-box">
      <div class="profile-tabs-container">
        <div class="profile-tabs">
          <router-link 
            to="/profile" 
            class="tab-button"
            :class="{ 'active': $route.path === '/profile' }"
          >
            Perfil
          </router-link>
          <router-link 
            to="/editProfile" 
            class="tab-button"
            :class="{ 'active': $route.path === '/editProfile' }"
          >
            Editar Perfil
          </router-link>
          <router-link 
            to="/visits" 
            class="tab-button"
            :class="{ 'active': $route.path === '/visits' }"
          >
            Historial de Visitas
          </router-link>
        </div>
      </div>

      <!-- TABLA DE VISITAS -->
      <div class="visits-table-wrapper">
        <table class="visits-table">
          <thead>
            <tr>
              <th>Nombre del difunto</th>
              <th>Hora</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(visit, index) in visits" :key="index">
              <td>{{ visit.deceasedName }}</td>
              <td>{{ formatTime(visit.date) }}</td>
              <td>{{ formatDate(visit.date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script setup>
// deceased.deathDate?.slice(0, 10)
import { ref, onMounted } from 'vue'
import { getMyVisits } from '@/services/userService'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()
const visits = ref([])

onMounted(async () => {
  try {
    visits.value = await getMyVisits()
  } catch (err) {
    showToast('Error al cargar las visitas', 'error')
  }
})

const formatDate = (rawDate) => {
  const date = new Date(rawDate)
  return date.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const formatTime = (rawDate) => {
  const date = new Date(rawDate)
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}
</script>

<style scoped>.user-visits-container {
  display: flex;
  justify-content: center;
  min-height: 70vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.profile-center-box {
  margin-top: 30px;
  width: 80%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.profile-tabs-container {
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.profile-tabs {
  display: flex;
  max-width: 100%;
  margin: 0 auto;
}

.tab-button {
  flex: 1;
  padding: 15px 20px;
  text-align: center;
  text-decoration: none;
  color: #666;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  min-width: 120px;
}

.tab-button:hover {
  background-color: #f9f9f9;
  color: var(--purple-color);
}

.tab-button.active {
  color: var(--purple-color);
  font-weight: 600;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: var(--purple-color);
}

.purple-button {
  margin-top: 30px;
  width: 200px;
  align-self: center;
}

/* NUEVOS ESTILOS PARA LA TABLA */
.visits-table-wrapper {
  
  max-height: 600px; 
  overflow-y: auto;
  margin: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
}


.visits-table {
   
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
}

.visits-table th {
  background-color: #6b2c7d;
  color: white;
  padding: 12px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 1;
}

.visits-table td {
  border: 1px solid #e0e0e0;
  padding: 10px;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-center-box {
    height: 100vh;
  }

  .profile-tabs {
    flex-direction: column;
  }

  .tab-button {
    text-align: left;
    padding: 12px 20px;
  }

  .tab-button.active::after {
    top: 0;
    bottom: auto;
    left: 0;
    right: auto;
    width: 3px;
    height: 100%;
    
  }
  .visits-table-wrapper {
  
  max-height: 750px; 
 
}
}

@media (max-width: 480px) {
  .profile-center-box {
    border-radius: 8px;
  }

  .profile-tabs-container {
    padding: 0 10px;
  }
}

</style> 