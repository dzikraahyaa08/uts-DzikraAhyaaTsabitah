<template>
  <v-container fluid class="pa-0 fill-height bg-grey-lighten-4">
    <v-row no-gutters class="fill-height">
      <!-- Left Side - Visual/Branding -->
      <v-col cols="12" md="6" class="d-none d-md-flex align-center justify-center position-relative overflow-hidden" style="background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);">
        <div class="position-absolute" style="width: 600px; height: 600px; background: rgba(255,255,255,0.1); border-radius: 50%; top: -10%; left: -20%; filter: blur(40px);"></div>
        <div class="position-absolute" style="width: 400px; height: 400px; background: rgba(255,255,255,0.05); border-radius: 50%; bottom: -10%; right: -10%; filter: blur(30px);"></div>
        
        <div class="text-center text-white px-10 position-relative z-index-1">
          <v-icon size="80" class="mb-6 opacity-80">mdi-book-open-page-variant</v-icon>
          <h1 class="text-h3 font-weight-black mb-4">Setoran Hafalan</h1>
          <p class="text-h6 opacity-80 font-weight-light px-10">Pantau dan kelola progres hafalan mahasiswa dengan mudah, cepat, dan terintegrasi.</p>
        </div>
      </v-col>

      <!-- Right Side - Login Form -->
      <v-col cols="12" md="6" class="d-flex align-center justify-center bg-white">
        <v-card class="elevation-0 pa-8 pa-sm-12 w-100" max-width="550" color="transparent">
          <v-card-text>
            <div class="text-center mb-10">
              <div class="d-md-none mb-6">
                <v-icon size="64" color="indigo-accent-4">mdi-book-open-page-variant</v-icon>
              </div>
              <h2 class="text-h4 font-weight-black text-indigo-darken-4 mb-2">Selamat Datang 👋</h2>
              <p class="text-grey-darken-1 text-subtitle-1">Silakan masuk menggunakan akun UIN Suska Anda.</p>
            </div>
            
            <v-alert v-if="errorMsg" type="error" variant="tonal" class="mb-6 rounded-lg">
              {{ errorMsg }}
            </v-alert>

            <v-form @submit.prevent="handleLogin" v-model="isFormValid">
              <v-text-field
                v-model="form.username"
                label="Email atau Username"
                placeholder="muhammad.fikri@uin-suska.ac.id"
                prepend-inner-icon="mdi-account-circle-outline"
                variant="outlined"
                color="indigo-accent-4"
                rounded="lg"
                class="mb-4"
                :rules="[v => !!v || 'Email/Username wajib diisi']"
                hide-details="auto"
              ></v-text-field>

              <v-text-field
                v-model="form.password"
                label="Password"
                placeholder="Masukkan password Anda"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                color="indigo-accent-4"
                rounded="lg"
                class="mb-6"
                :rules="[v => !!v || 'Password wajib diisi']"
                hide-details="auto"
              ></v-text-field>

              <v-btn
                type="submit"
                color="indigo-accent-4"
                size="x-large"
                block
                rounded="lg"
                class="font-weight-bold text-body-1 mt-2 mb-6"
                elevation="2"
                :loading="loading"
                :disabled="loading"
              >
                MASUK SEKARANG
              </v-btn>
              
              <div class="text-center">
                <p class="text-caption text-grey">Kesulitan untuk masuk? <a href="#" class="text-indigo-accent-4 text-decoration-none font-weight-medium">Hubungi Admin TIF</a></p>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/auth'

const router = useRouter()
const loading = ref(false)
const showPassword = ref(false)
const isFormValid = ref(false)
const errorMsg = ref('')

const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.username || !form.password) return
  
  loading.value = true
  errorMsg.value = ''

  try {
    const data = await login(form.username.trim(), form.password)
    
    if (data && data.access_token) {
      router.push('/home') 
    }
  } catch (error) {
    console.error("Login Error:", error)
    errorMsg.value = error.message || "Username atau Password salah!"
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.z-index-1 {
  z-index: 1;
}

/* Customizing the input fields slightly to look more modern */
:deep(.v-field--outlined) {
  background: #f8fafc;
  transition: all 0.3s ease;
}

:deep(.v-field--focused) {
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(67, 56, 202, 0.08) !important;
}

:deep(.v-btn) {
  text-transform: none;
  letter-spacing: 0.5px;
}
</style>