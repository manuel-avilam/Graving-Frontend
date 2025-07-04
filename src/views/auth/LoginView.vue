<template>
  <div class="login-container">
    <img src="../../assets/images/logo.png" class="logo" alt="Graving-logo">
    <h1 class="login-title">Iniciar sesión</h1>
    
    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <input 
          type="email" 
          v-model="email" 
          class="data-input"
          required
          placeholder=" " 
        >
        <label class="input-label" :class="{ 'input-label-focused': email }">Correo</label>
      </div>
      
     <div class="input-group">
        <input 
          type="password" 
          v-model="password" 
          class="data-input"
          required
          placeholder=" " 
        >
        <label class="input-label" :class="{ 'input-label-focused': password }">Contraseña</label>
      </div>

      <button type="submit" class="purple-button" :disabled="isSubmitting">
        Iniciar sesión
      </button>
    </form>

    <button @click="handleLoginGoogle" class="google-signin-btn">
      <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" class="google-logo">
      <span>Iniciar Sesión con Google</span>
    </button>
    <div class="separator"></div>
    <p class="login-label">¿Aún no tienes una cuenta?</p>
    <router-link :to="{name: 'register'}" class="purple-button medium-size">Registrate</router-link>
    <router-link :to="{name: 'home'}" class="outline-white-button">Regresar</router-link>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { login, loginGoogle } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import { loginSchema } from '@/composables/validations/useLoginValidation'
import { useSubmitGuard } from '@/composables/useSubmitGuard'

const { showToast } = useToast()
const { isSubmitting, guardedSubmit } = useSubmitGuard()

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = () => {
  guardedSubmit(async () => {
    try {
      const form = {
        email: email.value,
        password: password.value
      }

      await loginSchema.validate(form)

      const data = await login(form)
      authStore.setAuth(data.token, data.user)
      showToast('Inicio de sesión exitoso!', 'success')
      await nextTick()
      router.push({ name: 'searchDeceased' })
    } catch (error) {
      if (error.name === 'ValidationError') {
        showToast(error.message, 'error')
      } else {
        showToast('Error al iniciar sesión. Verifica tus datos o intenta más tarde.', 'error')
      }
    }
  })
}

const handleLoginGoogle = async () => {
  try {
    const data = await loginGoogle()
    authStore.setAuth(data.token, data.user)
    showToast('Inicio de sesión exitoso!', 'success')
    await nextTick()
    router.push({ name: 'searchDeceased' })
  } catch (error) {
    showToast('Error al iniciar sesión con Google.', 'error')
  }
}
</script>


<style scoped>

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
}

.logo {
  margin-top: 30px;
  width: 230px;
  height: 140px;
}

.login-title {
  font-size: 30px;
  margin-bottom: 25px;
  color: #333;
}




.separator {
  height: 1px;
  background-color: #ddd;
  margin: 20px 0;
  width: 100%;
}

.login-label {
  text-align: center;
  color: #666;
  font-size: 12px;
  
}

.outline-white-button {
  margin-top: 30px;
  width: 180px;
  
}
.purple-button {
  margin-top: 40px;
  margin-bottom: 20px;
  width: 280px;
}
</style>