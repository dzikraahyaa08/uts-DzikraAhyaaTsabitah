const URL_API = 'https://api.tif.uin-suska.ac.id' 
const PATH = '/setoran-dev/v1' 
const API_KEY = 'tif-uin-suska'

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
})

// 1. Ambil Profil Dosen & Daftar Mahasiswa (sekarang satu endpoint)
export const getPaSaya = () => 
  fetch(`${URL_API}${PATH}/dosen/pa-saya?apikey=${API_KEY}`, { headers: getHeaders() })
    .then(async res => {
      const data = await res.json();
      if (!res.ok || data.response === false) throw new Error(data.message || 'Gagal memuat data');
      return data.data || data;
    });

// 2. Ambil Detail Satu Mahasiswa & Progres Hafalan (sekarang /mahasiswa/setoran/:nim)
export const getSetoranMahasiswa = (nim) => 
  fetch(`${URL_API}${PATH}/mahasiswa/setoran/${nim}?apikey=${API_KEY}`, { headers: getHeaders() })
    .then(async res => {
      const data = await res.json();
      if (!res.ok || data.response === false) throw new Error(data.message || 'Gagal memuat detail mahasiswa');
      return data.data || data;
    });

// 3. Simpan Setoran
export const simpanSetoran = (nim, payload) => 
  fetch(`${URL_API}${PATH}/mahasiswa/setoran/${nim}?apikey=${API_KEY}`, { 
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  })
    .then(async res => {
      const data = await res.json();
      if (!res.ok || data.response === false) throw new Error(data.message || 'Gagal memvalidasi setoran');
      return data.data || data;
    });

// 4. Hapus Setoran
export const hapusSetoran = (nim, payload) => 
  fetch(`${URL_API}${PATH}/mahasiswa/setoran/${nim}?apikey=${API_KEY}`, { 
    method: 'DELETE',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  })
    .then(async res => {
      const data = await res.json();
      if (!res.ok || data.response === false) throw new Error(data.message || 'Gagal menghapus setoran');
      return data.data || data;
    });