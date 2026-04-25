<template>
  <div class="bg-grey-lighten-4 min-vh-100 pb-10">
    <!-- Header Banner -->
    <div class="header-banner pt-10 pb-16 px-6 position-relative overflow-hidden">
      <div class="banner-bg"></div>
      <v-container class="position-relative z-1">
        <v-row align="center">
          <v-col cols="12" md="8">
            <h1 class="text-h3 font-weight-black text-white mb-2" style="letter-spacing: -1px;">
              Dashboard Dosen
            </h1>
            <p class="text-h6 font-weight-regular text-white opacity-80" v-if="profile">
              Selamat datang kembali, {{ profile.nama }}
            </p>
          </v-col>
          <v-col cols="12" md="4" class="text-md-right">
            <div class="d-flex align-center justify-md-end bg-white-transparent py-2 px-4 rounded-xl d-inline-flex" v-if="profile">
              <v-icon color="white" class="mr-2">mdi-identifier</v-icon>
              <span class="text-white font-weight-medium">{{ profile.nip || '-' }}</span>
            </div>
            <v-btn color="white" variant="text" prepend-icon="mdi-logout" class="ml-4 font-weight-bold" @click="logout">
              Keluar
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Main Content -->
    <v-container class="mt-n10 position-relative z-2">
      <!-- Loading State -->
      <v-row v-if="loading" justify="center" class="mt-10">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate color="indigo-accent-4" size="64" width="6"></v-progress-circular>
          <p class="mt-4 text-grey-darken-1 font-weight-medium">Sinkronisasi data dengan sistem...</p>
        </v-col>
      </v-row>

      <!-- Error State -->
      <v-row v-else-if="errorMessage">
        <v-col cols="12">
          <v-alert type="error" variant="tonal" class="rounded-xl border border-error bg-white shadow-sm pa-6" border-color="error">
            <h3 class="text-h6 font-weight-bold mb-2">Gagal Memuat Data</h3>
            <p>{{ errorMessage }}</p>
            <v-btn color="error" variant="flat" class="mt-4 rounded-lg px-6 font-weight-bold" @click="fetchData">Coba Lagi</v-btn>
          </v-alert>
        </v-col>
      </v-row>

      <!-- Data State -->
      <template v-else>
        <!-- Global Summary Cards -->
        <v-row class="mb-6">
          <v-col cols="12" sm="6" md="2" lg="2">
            <v-card class="rounded-xl shadow-sm border-0 pa-5 h-100 bg-indigo-accent-4 text-white">
              <div class="text-overline font-weight-bold opacity-80">TOTAL MAHASISWA</div>
              <div class="d-flex align-end mt-2">
                <div class="text-h4 font-weight-black">{{ students.length }}</div>
                <div class="text-subtitle-2 ml-2 mb-1 opacity-80">Orang</div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3" lg="2">
            <v-card class="rounded-xl shadow-sm border-0 pa-5 h-100">
              <div class="text-overline font-weight-bold text-grey">TOTAL WAJIB</div>
              <div class="d-flex align-end mt-2">
                <div class="text-h4 font-weight-black text-grey-darken-4">{{ totalStats.wajib }}</div>
                <div class="text-subtitle-1 ml-2 mb-1 text-grey font-weight-bold">Surah</div>
              </div>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6" md="3">
            <v-card class="rounded-xl shadow-sm border-0 pa-5 h-100 bg-emerald text-white">
              <div class="text-overline font-weight-bold opacity-80">SUDAH SETOR</div>
              <div class="d-flex align-end mt-2">
                <div class="text-h4 font-weight-black">{{ totalStats.sudah }}</div>
                <div class="text-subtitle-1 ml-2 mb-1 opacity-80 font-weight-bold">Surah</div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card class="rounded-xl shadow-sm border-0 pa-5 h-100">
              <div class="text-overline font-weight-bold text-grey">BELUM SETOR</div>
              <div class="d-flex align-end mt-2">
                <div class="text-h4 font-weight-black text-red-darken-1">{{ totalStats.belum }}</div>
                <div class="text-subtitle-1 ml-2 mb-1 text-grey font-weight-bold">Surah</div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card class="rounded-xl shadow-sm border-0 pa-5 h-100">
              <div class="text-overline font-weight-bold text-grey">PROGRESS TOTAL</div>
              <div class="mt-2">
                <div class="text-h4 font-weight-black text-indigo-accent-4">{{ totalStats.progress }}%</div>
                <v-progress-linear :model-value="totalStats.progress" color="indigo-accent-4" rounded height="6" class="mt-2"></v-progress-linear>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Batch Summary Section -->
        <v-card class="rounded-xl shadow-sm border-0 pa-6 mb-6">
          <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-4 d-flex align-center">
            <v-icon color="grey-darken-1" class="mr-2">mdi-chart-box-outline</v-icon>
            Ringkasan Angkatan
          </h3>
          <v-row>
            <v-col v-for="item in angkatanSummary" :key="item.tahun" cols="12" sm="6" md="4" lg="3">
              <div class="d-flex align-center justify-space-between pa-3 rounded-lg bg-grey-lighten-5 border">
                <span class="font-weight-medium text-grey-darken-2">Angkatan {{ item.tahun }}</span>
                <v-chip size="small" color="indigo-lighten-5" class="text-indigo-accent-4 font-weight-bold">
                  {{ item.total }} mahasiswa
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Filter/Toolbar -->
        <div class="d-flex align-center justify-space-between mb-6 bg-white pa-4 rounded-xl shadow-sm">
          <h2 class="text-h5 font-weight-bold text-indigo-accent-4 mb-0 d-flex align-center">
            <v-icon color="indigo-accent-4" class="mr-2 pb-1">mdi-account-group</v-icon>
            Mahasiswa Bimbingan
            <v-chip class="ml-3 font-weight-bold" color="indigo-accent-4" size="small">{{ students.length }}</v-chip>
          </h2>
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            label="Cari mahasiswa..."
            variant="solo-filled"
            flat
            density="compact"
            hide-details
            rounded="lg"
            class="search-input bg-grey-lighten-4"
            style="max-width: 300px;"
          ></v-text-field>
        </div>

        <v-row v-if="filteredStudents.length > 0">
          <v-col v-for="mhs in filteredStudents" :key="mhs.nim" cols="12" sm="6" lg="4">
            <v-card class="student-card rounded-xl shadow-sm border-0 h-100 d-flex flex-column" @click="router.push('/detail/' + mhs.nim)">
              <v-card-text class="pa-5 flex-grow-1">
                <div class="d-flex justify-space-between align-start mb-4">
                  <v-avatar color="indigo-lighten-5" size="56" class="rounded-lg shadow-sm">
                    <span class="text-indigo-accent-4 text-h5 font-weight-bold">{{ mhs.nama.charAt(0).toUpperCase() }}</span>
                  </v-avatar>
                  <v-chip size="small" :color="mhs.info_setoran?.persentase_progres_setor === 100 ? 'success' : 'indigo-accent-1'" class="font-weight-bold">
                    Angkatan {{ mhs.angkatan }}
                  </v-chip>
                </div>
                
                <h3 class="text-h6 font-weight-bold text-grey-darken-4 line-clamp-1 mb-1" :title="mhs.nama">{{ mhs.nama }}</h3>
                <p class="text-subtitle-2 text-grey mb-4 d-flex align-center">
                  <v-icon size="small" class="mr-1">mdi-card-account-details-outline</v-icon>
                  {{ mhs.nim }}
                </p>

                <!-- Progress Section -->
                <div class="progress-section bg-grey-lighten-5 pa-4 rounded-lg mt-auto">
                  <div class="d-flex justify-space-between text-caption font-weight-bold text-grey-darken-1 mb-2">
                    <span>Progres Hafalan</span>
                    <span class="text-indigo-accent-4">{{ mhs.info_setoran?.persentase_progres_setor || 0 }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="mhs.info_setoran?.persentase_progres_setor || 0"
                    color="indigo-accent-4"
                    height="8"
                    rounded
                    class="mb-3"
                  ></v-progress-linear>
                  
                  <div class="d-flex justify-space-between align-center">
                    <div class="text-caption text-grey">
                      <span class="font-weight-bold text-grey-darken-3">{{ mhs.info_setoran?.total_sudah_setor || 0 }}</span> dari {{ mhs.info_setoran?.total_wajib_setor || 37 }} Surah
                    </div>
                    <div class="text-caption text-grey d-flex align-center">
                      <v-icon size="small" class="mr-1" color="grey">mdi-clock-outline</v-icon>
                      {{ mhs.info_setoran?.terakhir_setor || 'Belum ada' }}
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else justify="center" class="mt-10">
          <v-col cols="12" md="6" class="text-center py-10">
            <div class="empty-state-icon bg-white d-inline-flex pa-6 rounded-circle shadow-sm mb-6">
              <v-icon size="80" color="grey-lighten-1">mdi-account-search-outline</v-icon>
            </div>
            <h2 class="text-h5 font-weight-bold text-grey-darken-2 mt-4">Tidak ada data ditemukan</h2>
            <p class="text-grey text-body-1 mt-2">Coba ubah kata kunci pencarian Anda atau Anda belum memiliki mahasiswa bimbingan.</p>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getPaSaya } from '../services/dosen'
import { logout as authLogout } from '../services/auth'

const students = ref([])
const angkatanSummary = ref([])
const profile = ref(null)
const loading = ref(true)
const errorMessage = ref('')
const searchQuery = ref('')
const router = useRouter()

const logout = async () => { 
  await authLogout(); 
  router.push('/'); 
}

const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value;
  const q = searchQuery.value.toLowerCase();
  return students.value.filter(s => 
    s.nama.toLowerCase().includes(q) || 
    s.nim.includes(q) ||
    s.angkatan.includes(q)
  );
})

const totalStats = computed(() => {
  if (students.value.length === 0) return { wajib: 0, sudah: 0, belum: 0, progress: 0 };
  
  const wajib = students.value.reduce((acc, m) => acc + (m.info_setoran?.total_wajib_setor || 37), 0);
  const sudah = students.value.reduce((acc, m) => acc + (m.info_setoran?.total_sudah_setor || 0), 0);
  const belum = wajib - sudah;
  const progress = wajib > 0 ? Math.round((sudah / wajib) * 100) : 0;
  
  return { wajib, sudah, belum, progress };
})

const fetchData = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const resPaSaya = await getPaSaya()
    
    if (resPaSaya === undefined || resPaSaya.response === false) {
       errorMessage.value = resPaSaya?.message || "Gagal mengambil data PA"
    } else {
       profile.value = {
         nama: resPaSaya.nama,
         nip: resPaSaya.nip
       }
       
        if (resPaSaya.info_mahasiswa_pa && resPaSaya.info_mahasiswa_pa.daftar_mahasiswa) {
         // Tampilkan semua data mahasiswa tanpa filter
         students.value = resPaSaya.info_mahasiswa_pa.daftar_mahasiswa
         angkatanSummary.value = resPaSaya.info_mahasiswa_pa.ringkasan || []
       } else {
         students.value = []
         angkatanSummary.value = []
       }
    }
  } catch (e) {
    console.error("Error Fetching:", e)
    errorMessage.value = "Terjadi kesalahan saat menghubungi server. Pastikan koneksi internet Anda stabil."
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}

.header-banner {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
}

.banner-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%),
                    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 40%);
}

.z-1 { z-index: 1; }
.z-2 { z-index: 2; }

.bg-white-transparent {
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
}

.shadow-sm {
  box-shadow: 0 4px 20px rgba(0,0,0,0.03) !important;
}

.student-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.student-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(30, 58, 138, 0.1) !important;
  border-color: rgba(30, 58, 138, 0.2) !important;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.search-input :deep(.v-field__overlay) {
  background-color: transparent !important;
}

.search-input :deep(.v-field) {
  border: 1px solid rgba(0,0,0,0.05);
}

.search-input :deep(.v-field--focused) {
  border-color: #1e3a8a;
  background-color: white !important;
}

.bg-emerald {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
}
</style>