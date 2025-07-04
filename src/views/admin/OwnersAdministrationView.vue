<template>
  <div class="grave-owners-container">
    <div class="grave-owners-box">
      <h2>Filtros</h2>
      <div class="search-group">
        <div class="input-group">
          <input 
            type="text" 
            v-model="filterName" 
            class="data-input" 
            placeholder=" "
          />
          <label class="input-label">Nombre</label>
        </div>

        <div class="input-group">
          <input 
            type="text" 
            v-model="filterEmail" 
            class="data-input" 
            placeholder=" "
          />
          <label class="input-label">Correo</label>
        </div>

        <div class="input-group">
          <input 
            type="text" 
            v-model="filterPhone" 
            class="data-input" 
            placeholder=" "
          />
          <label class="input-label">Teléfono</label>
        </div>
      </div>

      <div class="table-title">
        <h2>Listado de Representantes</h2>
      </div>

      <div class="owners-table-wrapper">
        <table class="owners-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Curp</th>
              <th>Difunto</th>
              <th>Funciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(owner, index) in filteredOwners" :key="index">
              <td>{{ owner.name }}</td>
              <td>{{ owner.phone }}</td>
              <td>{{ owner.email }}</td>
              <td>{{ owner.curp }}</td>
              <td>{{ owner.deceasedName }}</td>
              <td class="actions">
                <router-link :to="{ name: 'editDeceased', params: { id: owner.deceasedId } }" class="purple-button">Editar</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllOwners } from '@/services/ownerService'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

const owners = ref([])

const filterName = ref('')
const filterEmail = ref('')
const filterPhone = ref('')

const filteredOwners = computed(() => {
  return owners.value.filter(owner => {
    const matchesName = owner.name.toLowerCase().includes(filterName.value.toLowerCase())
    const matchesEmail = owner.email.toLowerCase().includes(filterEmail.value.toLowerCase())
    const matchesPhone = owner.phone.includes(filterPhone.value)
    return matchesName && matchesEmail && matchesPhone
  })
})

onMounted(async () => {
  try {
    const response = await getAllOwners()
    owners.value = response
  } catch (err) {
    showToast('Error al obtener propietarios', 'error')
  }
})
</script>

<style scoped>
.grave-owners-container {
  display: flex;
  justify-content: center;
  min-height: 80vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.grave-owners-box {
  margin-top: 20px;
  width: 80%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.search-group {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  align-items: center;
}

.table-title {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.table-title h2 {
  color: #333;
  font-size: 1.5rem;
  margin: 0;
}

.purple-button {
  width: 4rem;
}

.input-group {
  margin: 20px;
}

.owners-table-wrapper {
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.owners-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.owners-table th {
  background-color: var(--purple-color);
  color: white;
  padding: 12px;
  text-align: left;
  position: sticky;
  top: 0;
  z-index: 1;
  border: 1px solid #e0e0e0;
}

.owners-table td {
  border: 1px solid #e0e0e0;
  padding: 10px 12px;
}

.owners-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.owners-table tr:hover {
  background-color: #f1f1f1;
}

/* Estilos para los textos clickeables */
.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-link {
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  padding: 2px 4px;
  border-radius: 3px;
  white-space: nowrap;
}

.edit-link {
  color: #4a7cff;
}

.delete-link {
  color: #ff4a4a;
}

.action-link:hover {
  text-decoration: underline;
  background-color: rgba(0, 0, 0, 0.05);
}

.action-link:active {
  transform: translateY(1px);
}

/* Responsive */
@media (max-width: 768px) {
  .search-group {
    flex-direction: column;
    gap: 10px;
  }
  
  .owners-table-wrapper {
    max-height: none;
    overflow-x: auto;
  }
  
  .owners-table {
    min-width: 700px;
  }
  
  .actions {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .grave-owners-container {
    padding: 10px;
  }
  
  .grave-owners-box {
    width: 100%;
    padding: 15px;
  }
  
  .table-title h2 {
    font-size: 1.3rem;
  }
  
  .action-link {
    padding: 4px 8px;
  }
}
</style>