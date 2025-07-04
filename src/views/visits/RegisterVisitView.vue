<template>
  <div class="visit-registration-container">
    <div class="left-section">
      <div class="left-section-components">
        <div class="container-tittle-visit-data">
          <h1 class="tittle-visit-data">Datos de tu Visita</h1>
        </div>
        <div class="info-card">
          <div class="photo-upload">
            <img v-if="imageUrl" :src="imageUrl" alt="Foto del difunto" class="deceased-photo">
            <img v-else src="../../assets/images/deceasedPlaceholder.png" alt="Foto del difunto" class="deceased-photo">
          </div>

          <div class="info-content">
            <div class="info-field">
              <label>Nombre</label>
              <p class="info-value">{{ name }}</p>
            </div>

            <div class="info-field">
              <label>Fecha de Defunción</label>
              <p class="info-value">{{ deathDate }}</p>
            </div>

            <div class="info-field">
              <label>Número de Tumba</label>
              <p class="info-value">{{ graveNumber }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="right-section">
      <div class="right-section-components">
        <div class="container-tittle-your-data">
          <h1 class="tittle-your-data">Fecha</h1>
        </div>

        <div class="form-card">
          <div class="date-time-group">
            <div class="input-group">
              <input 
                type="date" 
                v-model="visitDate" 
                class="data-input" 
                required
              />
              <label class="input-label">Fecha</label>
            </div>

            <div class="input-group">
              <input 
                type="time" 
                v-model="visitTime" 
                class="data-input" 
                required
              />
              <label class="input-label">Hora</label>
            </div>
          </div>

          <div v-if="isAdmin" class="input-group">
            <select v-model="selectedUserId" class="data-input" required>
              <option disabled value="">Selecciona un visitante</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
            <label class="input-label">Seleccionar visitante</label>
          </div>

          <div class="action-buttons">
            <button 
              @click="handleRegisterVisit" 
              class="purple-button"
              :disabled="isSubmitting"
            >
              Registrar Visita
            </button>
            <router-link :to="{name: 'searchDeceased'}" class="outline-white-button">Cancelar</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getDeceasedById } from '@/services/deceasedService'
import { getAllUsers } from '@/services/userService'
import { createVisit, createVisitAsAdmin } from '@/services/visitService'
import { useToast } from '@/composables/useToast'
import { visitSchema } from '@/composables/validations/useVisitValidation'
import { useAuthStore } from '@/stores/authStore'
import { useSubmitGuard } from '@/composables/useSubmitGuard'

const { showToast } = useToast()
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const { isSubmitting, guardedSubmit } = useSubmitGuard()

const visitDate = ref('')
const visitTime = ref('')
const users = ref([])
const selectedUserId = ref('')

const deceasedId = route.params.id
const name = ref('')
const epitaph = ref('')
const birthDate = ref('')
const deathDate = ref('')
const graveNumber = ref('')
const imageUrl = ref(null)

const isAdmin = computed(() => auth.isAdmin)

onMounted(async () => {
  try {
    const deceased = await getDeceasedById(deceasedId)
    name.value = deceased.name
    epitaph.value = deceased.epitaph
    birthDate.value = deceased.birthDate?.slice(0, 10)
    deathDate.value = deceased.deathDate?.slice(0, 10)
    graveNumber.value = deceased.graveNumber
    imageUrl.value = deceased.imageUrl

    if (isAdmin.value) {
      users.value = await getAllUsers()
    }
  } catch (err) {
    showToast('Error al cargar datos', 'error')
    await nextTick()
    router.push({ name: 'searchDeceased' })
  }
})

const handleRegisterVisit = () => {
  guardedSubmit(async () => {
    try {
      await visitSchema.validate(
        {
          visitDate: visitDate.value,
          visitTime: visitTime.value,
          dateTime: `${visitDate.value}T${visitTime.value}`
        },
        { abortEarly: false }
      )

      const dateTime = `${visitDate.value} ${visitTime.value}`

      if (isAdmin.value) {
        if (!selectedUserId.value) {
          showToast('Debes seleccionar un visitante', 'error')
          return
        }

        await createVisitAsAdmin({
          deceasedId,
          userId: selectedUserId.value,
          date: dateTime
        })
      } else {
        await createVisit({
          deceasedId,
          date: dateTime
        })
      }

      showToast('Visita registrada correctamente', 'success')
      await nextTick()
      router.push({ name: 'visits' })
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.errors.forEach(msg => showToast(msg, 'error'))
      } else {
        showToast('Error al registrar la visita', 'error')
      }
    }
  })
}
</script>


<style scoped>
.visit-registration-container {
  display: flex;
  min-height: 80vh;
  font-family: Arial, sans-serif;
 
}

.left-section, .right-section {
  width: 50%;
  padding-top: 40px;
  padding-right: 40px;
 
  box-sizing: border-box;
}

h1 {
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
}
.right-section{
 width: 55%;
}
.left-section{
  padding-left: 4%;
  width: 45%;
  display: flex;             
  flex-direction: column;      
  align-items: center;        
  text-align: center;      


}
.container-tittle-visit-data,
.container-tittle-your-data{
  
  text-align: left;
 
}

.info-card {
  width: 400px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 20px;
}


.form-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.photo-upload {
  width: 180px;
  height: 180px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 auto 30px;
  background-color: #fafafa;
}

.deceased-photo {
  width: 100%;
  height: 100%;
}

.info-content {
  margin-top: 20px;
}

.info-field {
  margin-bottom: 20px;
}

.info-field label {
  display: block;
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.info-value {
  font-weight: bold;
  color: #333;
  font-size: 16px;
}
.form-card{
  width: 80%;
}

.action-buttons {
  display: flex;
  justify-content:center;
  margin-top: 40px;
}

.action-buttons button, .action-buttons a {
  width: 150px;
  padding: 10px 0;
}

.purple-button{
  margin-right:40px;
}


.data-input[type="date"],
.data-input[type="time"] {
  width: 77%;
}



.date-time-group {
  display: flex;
  gap: 20px;
}

.date-time-group .input-group {
  flex: 1;
}

@media (max-width: 1235px) {
  .visit-registration-container {
    flex-direction: column;
  }
  
  .left-section, .right-section {
    width: 100%;
    padding: 25px;
  }
  .right-section-components {
  display: flex;
  flex-direction: column;
  align-items: center; 
  margin-bottom: 40px;
  }
  .container-tittle-your-data{
    width: 84%;
  }

  
  .info-card, .form-card {
    padding: 20px;
  }
  
  .date-time-group {
    flex-direction: column;
    gap: 0;
  }
  

  .action-buttons {
  display: flex;
  justify-content:center;
  margin-top: 20px;
  margin-bottom: 20px;
}
.purple-button{
  margin-right:40px ;
}

  
  .data-input[type="date"],
  .data-input[type="time"],
  .data-input {
  width: 97%;
}

@media (max-width: 500px) {
  .info-card {
    width: 90%;
  }

  .action-buttons button, .action-buttons a{
    width: 100px;
    font-size: 0.7rem;
  }
}


}
</style>