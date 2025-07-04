<template>
  <div class="admin-container">
    <h1 class="admin-title">Panel de Administración</h1>
    <div class="dashboard-grid">
  
      <router-link :to="{name: 'searchDeceased'}" class="dashboard-card">
        <div class="image-container">
          <img src="../../assets/images/deceasedAdministration.webp" alt="Gestión Difuntos" class="faded-image">
          <div class="image-overlay">
            <h2>Buscador de Difuntos</h2>
          </div>
        </div>
      </router-link>
        
      <router-link :to="{name: 'graves'}" class="dashboard-card">
        <div class="image-container">
          <img src="../../assets/images/gravesAdministration.jpg" alt="Gestión tumbas" class="faded-image">
          <div class="image-overlay">
            <h2>Gestión de Tumbas</h2>
          </div>
        </div>
      </router-link>
        
      <router-link :to="{name: 'owners'}" class="dashboard-card">
        <div class="image-container">
          <img src="../../assets/images/ownersAdministration.jpg" alt="Gestión Representantes" class="faded-image">
          <div class="image-overlay">
            <h2>Gestión de Representantes</h2>
          </div>
        </div>
      </router-link>
      
      <router-link :to="{name: 'systemLog'}" class="dashboard-card">
        <div class="image-container">
          <img src="../../assets/images/systemLog.jpg" alt="Bitácora del sistema" class="faded-image">
          <div class="image-overlay">
            <h2>Bitácora del Sistema</h2>
          </div>
        </div>
      </router-link>

      <router-link :to="{name: 'repairs'}" class="dashboard-card">
        <div class="image-container">
          <img src="../../assets/images/repairsAdministration.jpg" alt="Bitácora del sistema" class="faded-image">
          <div class="image-overlay">
            <h2>Reparaciones de tumbas</h2>
          </div>
        </div>
      </router-link>

      <router-link :to="{name: 'visitsAdmin'}" class="dashboard-card">
        <div class="image-container">
          <img src="../../assets/images/visitsAdministration.webp" alt="Bitácora del sistema" class="faded-image">
          <div class="image-overlay">
            <h2>Visitas</h2>
          </div>
        </div>
      </router-link>
      
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.admin-container {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.admin-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 2.5rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.dashboard-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.image-container {
  position: relative;
  width: 100%;
  height: 380px;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: all 0.3s ease;
}

.faded-image {
  opacity: 1;
  filter: brightness(0.9) contrast(.6);
}

.dashboard-card:hover .faded-image {
  opacity: 1;
  filter: brightness(1) contrast();
}


.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent 100%);
  padding: 1.5rem 1rem;
  color: white;
  text-align: center;
}
.image-overlay h2 {
  margin: 0;
  font-size: 1.5rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}


@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .image-container {
    height: 200px;
  }
  
  .admin-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .admin-container {
    padding: 1rem;
  }
  
  .image-overlay h2 {
    font-size: 1.3rem;
  }
  
  .image-container {
    height: 180px;
  }
}
</style>