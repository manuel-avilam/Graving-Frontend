<template>
  <div class="user-profile-container">
    <div class="profile-center-box">
      <div class="main-content-container">
        <div class="profile-content-wrapper">
          <div class="profile-info-column">
            <div class="input-group">
              <input 
                type="text" 
                v-model="graveId" 
                class="data-input" 
                placeholder=" " 
                readonly
              />
              <label class="input-label">Número de tumba</label>
            </div>

            <div class="input-group margin-0">
              <select v-model="type" class="data-input" required>
                <option value="" disabled>Selecciona un tipo</option>
                <option value="cleaning">Limpieza</option>
                <option value="painting">Pintura</option>
                <option value="graffitiRemoval">Remoción de grafiti</option>
                <option value="landscaping">Jardinería</option>
                <option value="structureRepair">Reparación estructural</option>
                <option value="drainage">Drenaje</option>
                <option value="other">Otro</option>
              </select>
              <label class="input-label">Tipo de reparación</label>
            </div>

            <div class="input-group">
              <input 
                type="text" 
                v-model="description" 
                class="data-input" 
                placeholder=" " 
              />
              <label class="input-label">Descripción</label>
            </div>

            <div class="input-group">
              <input 
                type="date" 
                v-model="date" 
                class="data-input" 
                placeholder=" " 
              />
              <label class="input-label">Fecha</label>
            </div>

            <button 
              @click="handleSubmit" 
              class="purple-button"
              :disabled="isSubmitting"
            >
              Confirmar
            </button>
          </div>

          <div class="logo-column">
            <img 
              src="../../assets/images/logo.png" 
              alt="Logo usuario" 
              class="user-logo"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { createRepair } from '@/services/repairService'
import { repairSchema } from '@/composables/validations/useRepairValidation'
import { useSubmitGuard } from '@/composables/useSubmitGuard'

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()
const { isSubmitting, guardedSubmit } = useSubmitGuard()

const graveId = Number(route.params.graveId)
const description = ref('')
const date = ref('')
const type = ref('')

const handleSubmit = () => {
  guardedSubmit(async () => {
    try {
      const form = {
        description: description.value,
        date: date.value,
        type: type.value
      }

      await repairSchema.validate(form)

      await createRepair({
        graveId,
        description: description.value,
        date: date.value,
        type: type.value
      })

      showToast('Reparación registrada correctamente', 'success')
      await nextTick()
      router.push({ name: 'repairs' })

    } catch (err) {
      if (err.name === 'ValidationError') {
        showToast(err.message, 'error')
      } else {
        showToast('Error al registrar la reparación', 'error')
      }
    }
  })
}
</script>


<style scoped>
.user-profile-container {
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

.purple-button{
    margin-top: 30px;
    width: 200px;
    align-self: center;
}

.main-content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}

.profile-content-wrapper {
  display: flex;
  flex: 1;
  min-height: 400px;
}

.profile-info-column {
  flex: 1;  
  padding: 0 30px;  
  display: flex;
  flex-direction: column;
}

/*inputs*/

.logo-column {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.user-logo {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
}

.margin-0 {
  margin-bottom: 0;
}

@media (max-width: 768px) {
    
.profile-center-box {

  height: 100vh;

}
  .profile-content-wrapper {
    flex-direction: column;
  }
  
  .profile-info-column {
    border-right: none;
   
    padding: 20px;
  }
  
  .logo-column {
    padding: 30px;
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


  .input-group {
    margin-bottom: 25px;
  }
}

@media (max-width: 480px) {
  .user-profile-container {
    padding: 10px;
  }
  
  .profile-center-box {
    border-radius: 8px;
  }
  
  .profile-tabs-container {
    padding: 0 10px;
  }
  
  .main-content-container {
    padding: 10px 0;
  }
  
  .profile-info-column,
  .logo-column {
    padding: 15px;
  }
}
</style>