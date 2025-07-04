<template>
  <div class="user-profile-container">
    <div class="profile-center-box">
      <div class="profile-tabs-container">
        <div class="profile-tabs">
          <router-link to="/profile" class="tab-button" :class="{ 'active': $route.path === '/profile' }">Perfil</router-link>
          <router-link to="/editProfile" class="tab-button" :class="{ 'active': $route.path === '/editProfile' }">Editar Perfil</router-link>
          <router-link to="/visits" class="tab-button" :class="{ 'active': $route.path === '/visits' }">Historial de Visitas</router-link>
        </div>
      </div>

      <div class="main-content-container">
        <div class="profile-content-wrapper">
          <div class="profile-info-column">
            <div class="input-group">
              <input type="text" v-model="user.name" class="data-input" placeholder=" " />
              <label class="input-label">Nombre</label>
            </div>

            <div class="input-group">
              <input type="email" v-model="user.email" class="data-input" placeholder=" " />
              <label class="input-label">Correo</label>
            </div>

            <div class="input-group">
              <input type="text" v-model="user.phoneNumber" class="data-input" placeholder=" " />
              <label class="input-label">Teléfono</label>
            </div>

            <div class="input-group">
              <input type="password" v-model="password" class="data-input" placeholder=" " />
              <label class="input-label">Contraseña Actual</label>
            </div>

            <div class="input-group">
              <input type="password" v-model="newPassword" class="data-input" placeholder=" " />
              <label class="input-label">Nueva Contraseña (opcional)</label>
            </div>

            <div class="input-group">
              <input type="password" v-model="confirmPassword" class="data-input" placeholder=" " />
              <label class="input-label">Confirmar Nueva Contraseña</label>
            </div>

            <button @click="handleSubmit" class="purple-button" :disabled="isSubmitting">Confirmar</button>
          </div>

          <div class="logo-column">
            <img src="../../assets/images/logo.png" alt="Logo usuario" class="user-logo" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getMyProfile, updateMyProfile } from '@/services/userService'
import { useToast } from '@/composables/useToast'
import { useSubmitGuard } from '@/composables/useSubmitGuard'
import { editProfileSchema } from '@/composables/validations/useEditProfileValidation'

const { showToast } = useToast()
const { isSubmitting, guardedSubmit } = useSubmitGuard()

const user = reactive({
  name: '',
  email: '',
  phoneNumber: ''
})

const password = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

onMounted(async () => {
  try {
    const data = await getMyProfile()
    user.name = data.name || ''
    user.email = data.email || ''
    user.phoneNumber = data.phoneNumber || ''
  } catch (err) {
    showToast('Error al cargar tu perfil', 'error')
  }
})

const handleSubmit = () => {
  guardedSubmit(async () => {
    try {
      const form = {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: password.value,
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value
      }

      await editProfileSchema.validate(form, { abortEarly: false })

      const payload = {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: password.value,
        newPassword: newPassword.value || undefined
      }

      await updateMyProfile(payload)
      showToast('Perfil actualizado correctamente', 'success')

      password.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    } catch (err) {
      if (err.name === 'ValidationError') {
        err.errors.forEach(msg => showToast(msg, 'error'))
      } else if (err.response?.data?.error) {
        showToast(err.response.data.error, 'error')
      } else {
        showToast('Error al actualizar perfil', 'error')
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