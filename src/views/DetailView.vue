<template>
  <div class="bg-grey-lighten-4 min-vh-100 pb-10">
    <!-- Header Banner -->
    <div class="header-banner pt-6 pb-16 px-6 position-relative overflow-hidden">
      <div class="banner-bg"></div>
      <v-container class="position-relative z-1">
        <v-btn prepend-icon="mdi-arrow-left" color="white" variant="text" to="/home" class="mb-6 font-weight-bold px-0">
          Kembali ke Dashboard
        </v-btn>
        <v-row v-if="student" align="center">
          <v-col cols="12" md="8">
            <div class="d-flex align-center">
              <v-avatar color="white" size="80" class="mr-6 shadow-md elevation-10">
                <span class="text-indigo-accent-4 text-h4 font-weight-black">{{ student.nama.charAt(0).toUpperCase() }}</span>
              </v-avatar>
              <div>
                <h1 class="text-h3 font-weight-black text-white mb-2" style="letter-spacing: -1px;">
                  {{ student.nama }}
                </h1>
                <div class="d-flex flex-wrap gap-2 text-white opacity-90 font-weight-medium align-center">
                  <span class="d-flex align-center"><v-icon size="small" class="mr-1">mdi-card-account-details-outline</v-icon> {{ student.nim }}</span>
                  <span class="mx-2">•</span>
                  <span class="d-flex align-center"><v-icon size="small" class="mr-1">mdi-email-outline</v-icon> {{ student.email || '-' }}</span>
                  <span class="mx-2">•</span>
                  <v-chip size="small" color="white" variant="outlined" class="font-weight-bold">Angkatan {{ student.angkatan }}</v-chip>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Main Content -->
    <v-container class="mt-n12 position-relative z-2">
      <!-- Loading State -->
      <v-row v-if="loading" justify="center" class="mt-10">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate color="indigo-accent-4" size="64" width="6"></v-progress-circular>
        </v-col>
      </v-row>

      <v-row v-else-if="student">
        <!-- Progress Summary -->
        <v-col cols="12" md="4">
          <v-card class="rounded-xl shadow-sm border-0 pa-6 h-100 d-flex flex-column align-center text-center">
            <h3 class="text-h6 font-weight-bold text-indigo-accent-4 mb-6">Total Progres</h3>
            
            <v-progress-circular
              :model-value="summary?.persentase_progres_setor || 0"
              :color="summary?.persentase_progres_setor === 100 ? 'success' : 'indigo-accent-4'"
              size="160"
              width="15"
              class="mb-6 progress-glow"
            >
              <div class="text-center">
                <div class="text-h4 font-weight-black text-grey-darken-4">{{ summary?.persentase_progres_setor || 0 }}%</div>
              </div>
            </v-progress-circular>
            
            <v-row class="w-100 mt-2 text-center" no-gutters>
              <v-col cols="6" class="border-right px-2">
                <div class="text-h5 font-weight-black text-indigo-accent-4">{{ summary?.total_sudah_setor || 0 }}</div>
                <div class="text-caption text-grey font-weight-bold text-uppercase">Sudah</div>
              </v-col>
              <v-col cols="6" class="px-2">
                <div class="text-h5 font-weight-black text-orange-darken-1">{{ summary?.total_belum_setor || 0 }}</div>
                <div class="text-caption text-grey font-weight-bold text-uppercase">Belum</div>
              </v-col>
            </v-row>
            
            <v-divider class="w-100 my-4"></v-divider>
            
            <div class="text-body-2 text-grey-darken-1 d-flex align-center justify-center w-100 mb-2">
              <v-icon size="small" class="mr-2" color="indigo-lighten-2">mdi-history</v-icon>
              Setor terakhir: <strong class="ml-1 text-grey-darken-3">{{ summary?.terakhir_setor || 'Belum ada' }}</strong>
            </div>
            
            <v-alert v-if="actionMessage" :type="actionType" variant="tonal" class="mt-4 text-left rounded-lg w-100">
              {{ actionMessage }}
            </v-alert>
          </v-card>
        </v-col>

        <!-- Main Actions -->
        <v-col cols="12" md="8">
          <v-card class="rounded-xl shadow-sm border-0 overflow-hidden h-100 d-flex flex-column">
            <v-tabs v-model="tab" color="indigo-accent-4" align-tabs="start" class="bg-grey-lighten-5 px-4 pt-2">
              <v-tab value="sudah">
                <v-icon start>mdi-check-decagram-outline</v-icon>
                Riwayat Setoran
                <v-chip size="x-small" class="ml-2 font-weight-bold" color="success">{{ progressList.length }}</v-chip>
              </v-tab>
              <v-tab value="belum">
                <v-icon start>mdi-book-plus-multiple-outline</v-icon>
                Validasi Baru
                <v-chip size="x-small" class="ml-2 font-weight-bold" color="orange">{{ belumSetorList.length }}</v-chip>
              </v-tab>
            </v-tabs>
            
            <v-divider></v-divider>

            <v-window v-model="tab" class="flex-grow-1">
              <!-- Tab: Riwayat Setoran -->
              <v-window-item value="sudah">
                <div class="pa-4 pb-0 d-flex justify-space-between align-center" v-if="progressList.length > 0">
                  <p class="text-caption text-grey">Pilih surah yang ingin dibatalkan validasinya.</p>
                  <v-btn 
                    color="error" 
                    variant="tonal" 
                    :disabled="selectedSudahSetor.length === 0 || actionLoading"
                    :loading="actionLoading"
                    @click="handleHapus"
                  >
                    <v-icon start>mdi-delete-outline</v-icon> Batalkan ({{ selectedSudahSetor.length }})
                  </v-btn>
                </div>
                
                <v-table hover class="bg-transparent mt-2" v-if="progressList.length > 0">
                  <thead>
                    <tr>
                      <th style="width: 50px;" class="pl-4">
                        <v-checkbox-btn v-model="selectAllSudah" @change="toggleSelectAllSudah" color="error"></v-checkbox-btn>
                      </th>
                      <th class="text-left font-weight-bold text-uppercase text-caption text-grey-darken-1">Surah</th>
                      <th class="text-left font-weight-bold text-uppercase text-caption text-grey-darken-1">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in progressList" :key="item.id" class="table-row">
                      <td class="pl-4">
                        <v-checkbox-btn v-model="selectedSudahSetor" :value="item" color="error"></v-checkbox-btn>
                      </td>
                      <td class="py-3">
                        <div class="d-flex align-center">
                          <v-avatar color="indigo-lighten-5" size="36" class="mr-3 text-indigo-accent-4 font-weight-bold text-caption">
                            {{ item.external_id }}
                          </v-avatar>
                          <div>
                            <div class="font-weight-bold text-grey-darken-4">{{ item.nama }} <span class="text-grey-darken-1 text-caption ml-1">{{ item.nama_arab }}</span></div>
                            <div class="text-caption text-indigo-lighten-1">{{ item.label || 'Wajib' }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="text-grey-darken-2 font-weight-medium text-body-2">
                        {{ formatDate(item.info_setoran?.tgl_setoran) }}
                      </td>
                    </tr>
                  </tbody>
                </v-table>
                
                <div v-else class="text-center pa-10">
                  <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-book-remove-multiple-outline</v-icon>
                  <h4 class="text-h6 text-grey-darken-1 font-weight-bold">Belum ada setoran</h4>
                  <p class="text-grey mt-2">Mahasiswa ini belum memiliki riwayat setoran hafalan yang disahkan.</p>
                </div>
              </v-window-item>

              <!-- Tab: Validasi Baru -->
              <v-window-item value="belum">
                <div class="pa-4 bg-indigo-lighten-5 border-bottom d-flex flex-wrap align-center gap-4" v-if="belumSetorList.length > 0">
                  <v-text-field
                    v-model="tglSetoran"
                    type="date"
                    label="Tanggal Setoran (Opsional)"
                    variant="outlined"
                    density="compact"
                    hide-details
                    bg-color="white"
                    style="max-width: 250px;"
                  ></v-text-field>
                  
                  <v-spacer></v-spacer>
                  
                  <v-btn 
                    color="indigo-accent-4" 
                    elevation="2"
                    :disabled="selectedBelumSetor.length === 0 || actionLoading"
                    :loading="actionLoading"
                    @click="handleSimpan"
                  >
                    <v-icon start>mdi-check-all</v-icon> Validasi ({{ selectedBelumSetor.length }}) Surah
                  </v-btn>
                </div>
                
                <v-table hover class="bg-transparent" v-if="belumSetorList.length > 0">
                  <thead>
                    <tr>
                      <th style="width: 50px;" class="pl-4">
                        <v-checkbox-btn v-model="selectAllBelum" @change="toggleSelectAllBelum" color="indigo-accent-4"></v-checkbox-btn>
                      </th>
                      <th class="text-left font-weight-bold text-uppercase text-caption text-grey-darken-1">Surah</th>
                      <th class="text-left font-weight-bold text-uppercase text-caption text-grey-darken-1">Kategori</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in belumSetorList" :key="item.id" class="table-row">
                      <td class="pl-4">
                        <v-checkbox-btn v-model="selectedBelumSetor" :value="item" color="indigo-accent-4"></v-checkbox-btn>
                      </td>
                      <td class="py-3">
                        <div class="d-flex align-center">
                          <v-avatar color="grey-lighten-4" size="36" class="mr-3 text-grey-darken-2 font-weight-bold text-caption">
                            {{ item.external_id }}
                          </v-avatar>
                          <div>
                            <div class="font-weight-bold text-grey-darken-4">{{ item.nama }} <span class="text-grey-darken-1 text-caption ml-1">{{ item.nama_arab }}</span></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <v-chip size="small" color="orange-darken-1" variant="tonal" class="font-weight-bold">{{ item.label || 'Wajib' }}</v-chip>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
                
                <div v-else class="text-center pa-10">
                  <v-icon size="64" color="success" class="mb-4 opacity-50">mdi-party-popper</v-icon>
                  <h4 class="text-h6 text-success font-weight-bold">Alhamdulillah Luar Biasa!</h4>
                  <p class="text-grey mt-2">Mahasiswa ini sudah menyetorkan semua hafalan wajibnya.</p>
                </div>
              </v-window-item>
            </v-window>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getSetoranMahasiswa, simpanSetoran, hapusSetoran } from '../services/dosen'

const route = useRoute()
const student = ref(null)
const rawProgress = ref([])
const summary = ref(null)
const loading = ref(true)

const tab = ref('sudah')
const actionLoading = ref(false)
const actionMessage = ref('')
const actionType = ref('success')
const tglSetoran = ref('')

const selectedSudahSetor = ref([])
const selectedBelumSetor = ref([])
const selectAllSudah = ref(false)
const selectAllBelum = ref(false)

const progressList = computed(() => {
  return rawProgress.value.filter(item => item.sudah_setor)
})

const belumSetorList = computed(() => {
  return rawProgress.value.filter(item => !item.sudah_setor)
})

watch(selectedSudahSetor, (val) => {
  selectAllSudah.value = val.length === progressList.value.length && val.length > 0;
})

watch(selectedBelumSetor, (val) => {
  selectAllBelum.value = val.length === belumSetorList.value.length && val.length > 0;
})

const toggleSelectAllSudah = () => {
  if (selectAllSudah.value) {
    selectedSudahSetor.value = [...progressList.value]
  } else {
    selectedSudahSetor.value = []
  }
}

const toggleSelectAllBelum = () => {
  if (selectAllBelum.value) {
    selectedBelumSetor.value = [...belumSetorList.value]
  } else {
    selectedBelumSetor.value = []
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const options = { day: 'numeric', month: 'long', year: 'numeric' }
    return new Date(dateString).toLocaleDateString('id-ID', options)
  } catch (e) {
    return dateString
  }
}

const loadData = async (nim) => {
  loading.value = true
  try {
    const data = await getSetoranMahasiswa(nim)
    if (data) {
      student.value = data.info
      // FILTER: Hanya ambil surah mulai dari Adh-Dhuha (ID 93) ke atas
      rawProgress.value = (data.setoran?.detail || []).filter(item => parseInt(item.external_id) >= 93)
      summary.value = data.setoran?.info_dasar || null
      // Reset selections
      selectedSudahSetor.value = []
      selectedBelumSetor.value = []
      selectAllSudah.value = false
      selectAllBelum.value = false
    }
  } finally {
    loading.value = false
  }
}

const handleSimpan = async () => {
  if (selectedBelumSetor.value.length === 0) return;
  
  actionLoading.value = true
  actionMessage.value = ''
  
  const payload = {
    data_setoran: selectedBelumSetor.value.map(item => ({
      nama_komponen_setoran: item.nama,
      id_komponen_setoran: item.id
    })),
    tgl_setoran: tglSetoran.value || null
  }
  
  try {
    const res = await simpanSetoran(route.params.nim, payload)
    actionType.value = 'success'
    actionMessage.value = `Berhasil memvalidasi ${selectedBelumSetor.value.length} surah!`
    await loadData(route.params.nim)
    tab.value = 'sudah'
  } catch (e) {
    actionType.value = 'error'
    actionMessage.value = e.message || "Gagal menyimpan setoran"
  } finally {
    actionLoading.value = false
    setTimeout(() => { actionMessage.value = '' }, 5000)
  }
}

const handleHapus = async () => {
  if (selectedSudahSetor.value.length === 0) return;
  
  if (!confirm(`Yakin ingin membatalkan validasi ${selectedSudahSetor.value.length} surah?`)) return;
  
  actionLoading.value = true
  actionMessage.value = ''
  
  const payload = {
    data_setoran: selectedSudahSetor.value.map(item => ({
      id: item.info_setoran?.id,
      id_komponen_setoran: item.id,
      nama_komponen_setoran: item.nama
    }))
  }
  
  try {
    const res = await hapusSetoran(route.params.nim, payload)
    actionType.value = 'success'
    actionMessage.value = `Berhasil membatalkan ${selectedSudahSetor.value.length} surah!`
    await loadData(route.params.nim)
  } catch (e) {
    actionType.value = 'error'
    actionMessage.value = e.message || "Gagal menghapus setoran"
  } finally {
    actionLoading.value = false
    setTimeout(() => { actionMessage.value = '' }, 5000)
  }
}

onMounted(() => {
  const nim = route.params.nim
  if (nim) loadData(nim)
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

.shadow-sm {
  box-shadow: 0 4px 20px rgba(0,0,0,0.03) !important;
}

.border-right {
  border-right: 1px solid rgba(0,0,0,0.05);
}

.border-bottom {
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.gap-2 {
  gap: 8px;
}
.gap-4 {
  gap: 16px;
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f8fafc !important;
}

:deep(.v-table) {
  background: transparent !important;
}

:deep(.v-table th) {
  border-bottom: 1px solid rgba(0,0,0,0.05) !important;
  background-color: #f8fafc !important;
}

:deep(.v-table td) {
  border-bottom: 1px solid rgba(0,0,0,0.03) !important;
}

.progress-glow {
  filter: drop-shadow(0 0 10px rgba(67, 56, 202, 0.2));
}

/* Custom checkbox spacing inside table */
:deep(.v-checkbox-btn) {
  min-height: 32px;
}
</style>