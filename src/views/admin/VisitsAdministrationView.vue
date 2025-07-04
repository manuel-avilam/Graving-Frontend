<template>
  <div class="visits-container">
    <div class="visits-center-box">
      <div class="visits-content-wrapper">
        <h2>Filtros</h2>
        <div class="search-group">
          <div class="input-group">
            <input 
              type="text" 
              v-model="searchQuery" 
              class="data-input" 
              placeholder=" " 
            />
            <label class="input-label">Buscar visitante o difunto</label>
          </div>
          <div class="input-group">
            <input 
              type="date" 
              v-model="filterDate" 
              class="data-input"
            />
            <label class="input-label">Filtrar por fecha</label>
          </div>
        </div>

        <div class="table-title">
          <h2>Listado de Visitas</h2> 
        </div>

        <div class="visits-table-wrapper">
          <table class="visits-table">
            <thead>
              <tr>
                <th>Visitante</th>
                <th>Difunto</th>
                <th>Fecha</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="visit in filteredVisits" :key="visit.id">
                <td>{{ visit.userName }}</td>
                <td>{{ visit.deceasedName }}</td>
                <td>{{ formatDate(visit.date) }}</td>
                <td>{{ formatTime(visit.date) }}</td>
              </tr>
              <tr v-if="filteredVisits.length === 0">
                <td colspan="3" class="text-muted">No hay visitas que coincidan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllVisits } from '@/services/visitService'
import { useToast } from '@/composables/useToast'

const visits = ref([])
const searchQuery = ref('')
const filterDate = ref('')
const { showToast } = useToast()

const filteredVisits = computed(() => {
  const q = searchQuery.value.toLowerCase()

  return visits.value.filter(visit => {
    const matchesText =
      visit.userName.toLowerCase().includes(q) ||
      visit.deceasedName.toLowerCase().includes(q)

    const date = new Date(visit.date)
    const localDateOnly = date.toLocaleDateString('sv-SE') // "YYYY-MM-DD"
    const matchesDate = !filterDate.value || localDateOnly === filterDate.value

    return matchesText && matchesDate
  })
})

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatTime = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

onMounted(async () => {
  try {
    visits.value = await getAllVisits()
  } catch (err) {
    showToast('Error al cargar visitas', 'error')
  }
})
</script>

<style scoped>
.visits-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 80vh;
}

.visits-center-box {
  width: 80%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.visits-content-wrapper {
  display: flex;
  flex-direction: column;
}

.search-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.input-group {
  flex: 1;
  margin: 10px;
  position: relative;
  min-width: 200px;
}

.table-title {
  margin-bottom: 10px;
}

.visits-table-wrapper {
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.visits-table {
  width: 100%;
  border-collapse: collapse;
}

.visits-table th {
  background-color: var(--purple-color);
  color: white;
  padding: 12px;
  text-align: left;
}

.visits-table td {
  padding: 10px 12px;
  border: 1px solid #eee;
}

.visits-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.text-muted {
  text-align: center;
  color: #999;
}
</style>
