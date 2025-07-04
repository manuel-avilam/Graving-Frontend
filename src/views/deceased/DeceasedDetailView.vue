<template>
  <div class="view-deceased-container">
    <div class="left-section">
      <div class="photo-upload">
        <img v-if="imageUrl" :src="imageUrl" alt="Foto del difunto" class="deceased-photo">
        <img v-else src="../../assets/images/deceasedPlaceholder.png" alt="Foto del difunto" class="deceased-photo">
      </div>
      <div class="actions-container" v-if="isActive">
        <router-link v-if="isLoggedIn" :to="{ name: 'visit', params: { id: deceasedId.id } }" class="purple-button edit-button">Visitar</router-link>
        <template v-if="isAdmin">
          <router-link :to="{name: 'editDeceased', params: {id: deceasedId}}" class="outline-white-button edit-button">Editar</router-link>
          <button  @click="handleDelete" class="delete-button">Eliminar</button>
        </template>
      </div>
    </div>  
    <div class="right-section">
      <div class="form-container">
        <div class="input-group">
          <input 
            type="text" 
            v-model="name" 
            class="data-input" 
            readonly 
            placeholder=" " 
          />
          <label class="input-label">Nombre completo</label>
        </div>
        <div class="input-group">
          <input 
            type="text" 
            v-model="epitaph" 
            class="data-input" 
            readonly 
            placeholder=" " 
          />
          <label class="input-label">Epitafio</label>
        </div>
        <div class="input-group">  
          <input 
            type="date" 
            v-model="birthDate" 
            class="data-input" 
            readonly
          />
          <label class="input-label">Fecha de nacimiento</label>
        </div>
        <div class="input-group">  
          <input 
            type="date" 
            v-model="deathDate" 
            class="data-input" 
            readonly
          />
          <label class="input-label">Fecha de defunción</label>
        </div>
        <div class="tomb-info">
          <h3>Número de tumba</h3>
          <p class="tomb-number">{{ graveNumber }}</p>
        </div>

        <div
          v-if="isAdmin && deathCertificateUrl"
          class="certificate-view-container"
        >
          <a
            :href="deathCertificateUrl"
            target="_blank"
            class="view-certificate-button"
          >
            📄 Ver acta de defunción
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick, computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { getDeceasedById, deleteDeceased } from '@/services/deceasedService'
  import { useToast } from '@/composables/useToast'
  import { useConfirmModal } from '@/composables/useConfirmModal'
  import { useAuthStore } from '@/stores/authStore'

  const authStore = useAuthStore()
  const isLoggedIn = computed(() => authStore.isLoggedIn)
  const isAdmin = computed(() => authStore.isAdmin)

  const { showToast } = useToast()
  const { showConfirmModal } = useConfirmModal()
  const router = useRouter()
  const route = useRoute()
  const deceasedId = route.params.id

  const name = ref('')
  const epitaph = ref('')
  const birthDate = ref('')
  const deathDate = ref('')
  const graveNumber = ref('')
  const imageUrl = ref('')
  const deathCertificateUrl = ref('')
  const isActive = ref(false)

  onMounted(async () => {
    try {
      const deceased = await getDeceasedById(deceasedId)
      name.value = deceased.name
      epitaph.value = deceased.epitaph
      birthDate.value = deceased.birthDate?.slice(0, 10)
      deathDate.value = deceased.deathDate?.slice(0, 10)
      graveNumber.value = deceased.graveNumber
      imageUrl.value = deceased.imageUrl
      deathCertificateUrl.value = deceased.deathCertificateUrl
      isActive.value = deceased.isActive !== 0
    } catch (err) {
      showToast('Difunto no encontrado', 'error')
      await nextTick();
      router.push({ name: 'searchDeceased' })
    }
  })

  const handleDelete = async () => {
    const confirmed = await showConfirmModal(`¿Deseas eliminar a ${name.value}? (Esta acción es irreversible)`)

    if (!confirmed) return

    try {
      const result = await deleteDeceased(deceasedId)
      showToast(`Se elimino a ${result.name} correctamente`, 'success')
      await nextTick();
      router.push({ name: 'searchDeceased' })
    } catch (error) {
      showToast('Error al eliminar al difunto', 'error')
    }
  }
</script>

<style scoped>
.view-deceased-container {
  width: 100vw;
  display: flex;
  flex-direction: row;
}

.left-section {
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.right-section {
  width: 60%;
  padding: 50px;
}

.image-upload {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.photo-upload {
  width: 380px;
  height: 380px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: white;
  transition: all 0.3s ease;
  margin: 60px ;
}

.deceased-photo {
  width: 100%;
  height: 100%;
}

.edit-button,
.delete-button,
.outline-white-button {
  width: 165px;
}

.certificate-view-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.view-certificate-button {
  display: inline-block;
  width: 100%;
  max-width: 380px;
  padding: 10px 15px;
  background-color: #fff;
  border: 2px dashed #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #555;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
}

.view-certificate-button:hover {
  border-color: #888;
  color: #333;
}

.actions-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.form-container {
  padding: 40px;
  background-color: #ffffff;
  border-radius: 5px;
  width: 70%;
  margin-left: 45px;
}

.tomb-info{
  margin-top: 30px;
}

.input-group {
  position: relative;
  width: 89%;
  margin-bottom: 20px;
  margin-top: 40px;
}

.data-input {
  border-bottom: 1px solid #7E57C2;
}

.data-input:not(:placeholder-shown) + .input-label {
  color: #000;
}

/* Estilo ESPECÍFICO para inputs de fecha */
.data-input[type="date"]:not(:placeholder-shown) + .input-label {
  color: #000;
}

.data-input[type="date"] + .input-label {
  top: -15px; 
  font-size: 12px;
}

.data-input[type="date"]::-webkit-datetime-edit {
  color: #000;
}

.edit-button {
  width: 165px;
}


@media (max-width: 1024px) {
  .view-deceased-container {
    flex-direction: column;
    align-items: center;
  }
  
  .left-section, .right-section {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
  
  .form-container {
   
    margin-left: 12px;
    padding: 30px;
    margin-bottom: 10px;
  }
  
  .confirm-btn {
    margin-bottom: 30px;
  }

  
  
}

@media (max-width: 768px) {
  
  section {
  width: 100%;
  padding: 50px;
}
  .right-section {
  width: 100%;
  
  
}
.form-container {
  background-color: #ffffff;
  border-radius: 5px;
  width: 83%;
  height: 90%;
  
}

}

@media (max-width: 480px) {
  
  .right-section {
    padding: 20px;
  }
  
  .form-container {
    padding: 20px;
  }

  .photo-upload {
    width: 250px;
    height: 250px;
  }
}
</style>