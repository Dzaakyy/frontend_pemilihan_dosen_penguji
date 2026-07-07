<template>
  <div class="min-h-screen bg-white">
    <!-- ====== Navigation ====== -->
    <header class="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm transition-all">
      <div class="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <router-link to="/" class="flex items-center gap-2.5">
          <img src="/images/logo/logo.svg" alt="SIRUJI TA Logo" class="h-10 w-10 object-contain" />
          <span class="text-lg font-bold text-gray-800">
            SIRUJI
            <span class="text-blue-600">TA</span>
          </span>
        </router-link>

        <nav class="hidden items-center gap-8 md:flex">
          <a href="#fitur" class="text-sm font-medium text-gray-600 transition hover:text-blue-600">Fitur</a>
          <a href="#cara-kerja-pso" class="text-sm font-medium text-gray-600 transition hover:text-blue-600">Cara Kerja
            PSO</a>
          <a href="#langkah" class="text-sm font-medium text-gray-600 transition hover:text-blue-600">Langkah</a>
          <a href="#manfaat" class="text-sm font-medium text-gray-600 transition hover:text-blue-600">Manfaat</a>
        </nav>

        <div class="flex items-center gap-3">
          <router-link to="/login"
            class="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105 hover:shadow-blue-600/40">
            Masuk
          </router-link>
        </div>
      </div>
    </header>

    <!-- ====== Hero Section ====== -->
    <section class="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div class="absolute inset-0 -z-10">
        <div class="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-100/30 blur-3xl"></div>
        <div
          class="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-50/30 blur-2xl">
        </div>
      </div>

      <div class="container mx-auto px-4 md:px-6">
        <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div class="space-y-6">
            <div
              class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-blue-100">
              <Sparkles class="h-4 w-4" />
              <span>Berbasis Algoritma PSO</span>
            </div>

            <h1 class="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Sistem Rekomendasi
              <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Dosen Penguji
              </span>
              Tugas Akhir
            </h1>

            <p class="max-w-lg text-lg text-gray-600">
              Optimalkan pemilihan dosen penguji dengan kecerdasan kolektif <strong class="text-gray-800">Particle Swarm
                Optimization</strong> — cepat, objektif, dan merata.
            </p>

            <div class="flex flex-wrap items-center gap-4">
              <router-link to="/login"
                class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105 hover:shadow-blue-600/40">
                Mulai Sekarang
                <ArrowRight class="h-5 w-5" />
              </router-link>
              <a href="#fitur"
                class="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3.5 font-medium text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50">
                <Play class="h-4 w-4" />
                Lihat Fitur
              </a>
            </div>
          </div>

          <!-- Right Content - Rekomendasi Berdasarkan Bidang Keahlian -->
          <div class="relative flex justify-center lg:justify-end">
            <div class="relative w-full max-w-md">
              <div class="rounded-2xl bg-white p-6 shadow-2xl shadow-blue-500/10 ring-1 ring-gray-100">
                <div class="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div class="flex items-center gap-2">
                    <div class="h-2.5 w-2.5 rounded-full bg-green-400"></div>
                    <div class="h-2.5 w-2.5 rounded-full bg-yellow-400"></div>
                    <div class="h-2.5 w-2.5 rounded-full bg-red-400"></div>
                  </div>
                  <span class="text-xs font-medium text-gray-400">Rekomendasi Berdasarkan Keahlian</span>
                </div>
                <div class="mt-4 space-y-3">
                  <div v-for="(item, idx) in mockRecommendations" :key="idx"
                    class="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition hover:bg-blue-50">
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {{ idx + 1 }}
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-800">{{ item.name }}</p>
                      <p class="text-xs text-gray-500">{{ item.expertise }}</p>
                    </div>
                    <div class="text-sm font-semibold text-green-600">{{ item.score }}%</div>
                  </div>
                </div>
                <div
                  class="mt-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-3 text-center text-xs text-gray-600">
                  <span class="font-medium text-blue-700">⚙️ PSO</span> · Optimasi berbasis kecerdasan swarm · Efisien &
                  Akurat
                </div>
              </div>
              <div class="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-blue-500/10 blur-xl"></div>
              <div class="absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-indigo-500/10 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== fitur Section ====== -->
    <section id="fitur" class="py-20 md:py-28">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto mb-16 max-w-2xl text-center">
          <span class="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">Fitur
            Unggulan</span>
          <h2 class="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Fitur <span class="text-blue-600">Unggulan</span> SIRUJI TA
          </h2>
          <p class="mt-4 text-gray-600">
            Sistem ini dirancang untuk membantu Ketua Program Studi dalam menugaskan dosen penguji secara optimal dan
            transparan.
          </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(feature, idx) in fitur" :key="idx"
            class="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5">
            <div
              class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 transition group-hover:scale-110">
              <component :is="feature.icon" class="h-6 w-6" />
            </div>
            <h3 class="mb-2 text-lg font-semibold text-gray-900">{{ feature.title }}</h3>
            <p class="text-sm text-gray-500">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== Cara Kerja PSO ====== -->
    <section id="cara-kerja-pso" class="py-16 md:py-24 bg-gray-50">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-3xl text-center">
          <span class="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">Algoritma
            PSO</span>
          <h2 class="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Bagaimana Algoritma <span class="text-blue-600">PSO</span> Bekerja?
          </h2>
          <p class="mt-2 text-gray-500">3 tahap sederhana menuju rekomendasi optimal</p>
        </div>

        <div class="mt-10 grid gap-6 md:grid-cols-3">
          <div
            class="group rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100 transition hover:shadow-md hover:-translate-y-1">
            <div
              class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl transition group-hover:scale-110">
              🎯
            </div>
            <h4 class="text-xl font-semibold text-gray-900">1. Inisialisasi</h4>
            <p class="mt-2 text-sm text-gray-500 leading-relaxed">
              Sistem membangkitkan <strong>kawanan partikel</strong> secara acak.
              Setiap partikel merepresentasikan satu kombinasi penugasan dosen penguji untuk seluruh mahasiswa.
            </p>
            <div class="mt-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              Swarm Partikel
            </div>
          </div>

          <div
            class="group rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100 transition hover:shadow-md hover:-translate-y-1">
            <div
              class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-3xl transition group-hover:scale-110">
              🔄
            </div>
            <h4 class="text-xl font-semibold text-gray-900">2. Evaluasi &amp; Update</h4>
            <p class="mt-2 text-sm text-gray-500 leading-relaxed">
              Setiap partikel dievaluasi menggunakan <strong>fungsi fitness</strong> (keahlian + distribusi).
              Partikel bergerak menuju posisi terbaik pribadi (Pbest) dan global (Gbest).
            </p>
            <div class="mt-4 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              Fitness = Keahlian + Distribusi
            </div>
          </div>

          <div
            class="group rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100 transition hover:shadow-md hover:-translate-y-1">
            <div
              class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-3xl transition group-hover:scale-110">
              ✅
            </div>
            <h4 class="text-xl font-semibold text-gray-900">3. Konvergensi</h4>
            <p class="mt-2 text-sm text-gray-500 leading-relaxed">
              Setelah iterasi maksimal tercapai, partikel berkumpul di solusi terbaik.
              Sistem menghasilkan <strong>3 dosen penguji</strong> dengan nilai fitness tertinggi.
            </p>
            <div class="mt-4 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              Top 3 Rekomendasi
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== Alur Penggunaan Sistem ====== -->
    <section id="langkah" class="bg-white py-20 md:py-28">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto mb-16 max-w-2xl text-center">
          <span class="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">Alur
            Sistem</span>
          <h2 class="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
            4 Langkah <span class="text-blue-600">Penggunaan</span> Sistem
          </h2>
          <p class="mt-4 text-gray-600">
            Dari pengelolaan data hingga penetapan dosen penguji, semua terintegrasi dalam satu platform.
          </p>
        </div>

        <div class="mx-auto max-w-3xl space-y-6">
          <div v-for="(step, idx) in steps" :key="idx"
            class="flex items-start gap-5 rounded-2xl bg-gray-50 p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
            <div
              class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-blue-600/25">
              {{ idx + 1 }}
            </div>
            <div class="flex-1">
              <h3 class="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <component :is="step.icon" class="h-5 w-5 text-blue-600" />
                {{ step.title }}
              </h3>
              <p class="mt-1 text-sm text-gray-500">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== Contoh Rekomendasi Detail ====== -->
    <section id="contoh-rekomendasi" class="py-16 md:py-24 bg-gray-50">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-3xl text-center">
          <span class="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">Contoh
            Hasil</span>
          <h2 class="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Rekomendasi <span class="text-blue-600">Dosen Penguji</span>
          </h2>
          <p class="mt-2 text-gray-500">Skor dihitung dari poin keahlian + poin distribusi beban</p>
        </div>

        <div class="mx-auto mt-10 max-w-2xl space-y-4">
          <div v-for="(item, idx) in detailedRecommendations" :key="idx"
            class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
            <div class="flex items-center gap-4">
              <div
                class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {{ idx + 1 }}
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="font-semibold text-gray-800">{{ item.name }}</h4>
                  <span class="text-lg font-bold text-green-600">{{ item.score }}%</span>
                </div>
                <p class="text-sm text-gray-500">{{ item.expertise }}</p>
                <div class="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  <span class="flex items-center gap-1">
                    <span class="inline-block h-2 w-2 rounded-full bg-blue-400"></span>
                    🔬 {{ item.detail.keahlian }} poin
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="inline-block h-2 w-2 rounded-full bg-green-400"></span>
                    📊 {{ item.detail.distribusi }} poin
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="inline-block h-2 w-2 rounded-full bg-orange-400"></span>
                    📋 Beban {{ item.detail.beban }} tugas
                  </span>
                  <span class="flex items-center gap-1 text-gray-300">|</span>
                  <span class="text-gray-400">Iterasi ke-{{ item.detail.iterasi }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mx-auto mt-6 max-w-2xl rounded-xl bg-blue-50 p-4 text-center text-sm text-blue-700">
          💡 <span class="font-medium">Skor Maksimal 100%</span> ·
          Keahlian (75 poin) + Distribusi Beban (25 poin) ·
          Semakin tinggi = semakin optimal
        </div>
      </div>
    </section>

    <!-- ====== manfaat Section ====== -->
    <section id="manfaat" class="py-20 md:py-28 bg-white">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto mb-16 max-w-2xl text-center">
          <span
            class="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">Manfaat</span>
          <h2 class="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Manfaat <span class="text-blue-600">Sistem</span>
          </h2>
        </div>

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div v-for="(benefit, idx) in manfaat" :key="idx" class="text-center">
            <div
              class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600">
              <component :is="benefit.icon" class="h-8 w-8" />
            </div>
            <h4 class="text-lg font-semibold text-gray-900">{{ benefit.title }}</h4>
            <p class="mt-1 text-sm text-gray-500">{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== CTA Section ====== -->
    <section class="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 py-16 md:py-20">
      <div class="absolute inset-0 opacity-10"
        style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px); background-size: 30px 30px;">
      </div>
      <div class="container relative mx-auto px-4 text-center md:px-6">
        <h2 class="text-3xl font-bold text-white md:text-4xl">
          Siap Mengoptimalkan Penugasan Penguji?
        </h2>
        <p class="mx-auto mt-4 max-w-lg text-blue-100">
          Mulai gunakan sistem rekomendasi berbasis PSO untuk hasil yang lebih cepat dan objektif.
        </p>
        <router-link to="/login"
          class="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 shadow-lg shadow-blue-700/30 transition-all hover:scale-105 hover:shadow-xl">
          Masuk ke Sistem
          <ArrowRight class="h-5 w-5" />
        </router-link>
      </div>
    </section>

    <!-- ====== Footer ====== -->
    <footer class="border-t border-gray-200 bg-gray-50">
      <div class="container mx-auto px-4 py-8 md:py-12">
        <div class="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div class="flex items-center gap-3">
            <img src="/images/logo/logo.svg" alt="SIRUJI TA Logo" class="h-10 w-10 object-contain" />
            <div>
              <span class="text-lg font-bold text-gray-800">SIRUJI <span class="text-blue-600">TA</span></span>
              <p class="text-sm text-gray-500">Sistem Rekomendasi Dosen Penguji Tugas Akhir</p>
            </div>
          </div>
          <nav class="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#fitur" class="text-gray-600 hover:text-blue-600 transition">Fitur</a>
            <a href="#cara-kerja-pso" class="text-gray-600 hover:text-blue-600 transition">Cara Kerja PSO</a>
            <a href="#langkah" class="text-gray-600 hover:text-blue-600 transition">Langkah</a>
            <a href="#manfaat" class="text-gray-600 hover:text-blue-600 transition">Manfaat</a>
            <router-link to="/login" class="text-gray-600 hover:text-blue-600 transition">Masuk</router-link>
          </nav>
        </div>
        <div class="mt-6 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          &copy; {{ new Date().getFullYear() }} SIRUJI TA · Sistem Rekomendasi Dosen Penguji Tugas Akhir
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  Sparkles,
  ArrowRight,
  Play,
  Brain,
  Users,
  Scale,
  BookOpen,
  Zap,
  Eye,
  Database,
  Settings,
  CheckCircle,
  Clock,
  Shield
} from 'lucide-vue-next'

// ====== Mock Rekomendasi (Hero) ======
const mockRecommendations = [
  {
    name: 'Machine Learning',
    expertise: 'Deep Learning · CNN · NLP · Data Mining',
    score: 100,
  },
  {
    name: 'UI/UX Design',
    expertise: 'User Experience · Design Thinking · Prototyping',
    score: 97,
  },
  {
    name: 'Pemrograman Web',
    expertise: 'Framework · Database · API · Fullstack',
    score: 95,
  },
]

// ====== Detail Rekomendasi (Tambahan) ======
const detailedRecommendations = [
  {
    name: 'Dosen 1',
    expertise: 'Machine Learning · Deep Learning · CNN · NLP · Data Mining',
    score: 100,
    detail: {
      keahlian: 75,
      distribusi: 25,
      beban: 0,
      iterasi: 8,
    },
  },
  {
    name: 'Dosen 2',
    expertise: 'UI/UX Design · User Experience · Design Thinking · Prototyping',
    score: 97,
    detail: {
      keahlian: 75,
      distribusi: 22,
      beban: 1,
      iterasi: 12,
    },
  },
  {
    name: 'Dosen 3',
    expertise: 'Pemrograman Web · Framework · Database · API · Fullstack',
    score: 94,
    detail: {
      keahlian: 75,
      distribusi: 19,
      beban: 2,
      iterasi: 15,
    },
  },
]

// ====== Fitur ======
const fitur = [
  {
    icon: Brain,
    title: 'Optimasi PSO',
    description: 'Algoritma Particle Swarm Optimization untuk mencari kombinasi penugasan terbaik secara iteratif.',
  },
  {
    icon: Users,
    title: 'Kesesuaian Keahlian',
    description: 'Pencocokan otomatis antara topik TA mahasiswa dengan bidang kepakaran dosen penguji.',
  },
  {
    icon: Scale,
    title: 'Pemerataan Beban',
    description: 'Distribusi beban menguji yang adil dengan batasan kuota harian untuk setiap dosen.',
  },
  {
    icon: BookOpen,
    title: 'Sinkronisasi Google Scholar',
    description: 'Ekstraksi data kepakaran dosen secara otomatis dari profil Google Scholar.',
  },
  {
    icon: Zap,
    title: 'Cepat & Objektif',
    description: 'Proses rekomendasi dalam hitungan detik, bebas dari subjektivitas manual.',
  },
  {
    icon: Eye,
    title: 'Transparansi Penuh',
    description: 'Mahasiswa dapat melihat dosen penguji, dosen melihat daftar mahasiswa yang diuji.',
  },
]

// ====== 4 Langkah ======
const steps = [
  {
    icon: Database,
    title: 'Kelola Data Master',
    description: 'Admin mengelola data prodi, topik TA, keahlian dosen, serta akun dosen dan mahasiswa.',
  },
  {
    icon: Settings,
    title: 'Jalankan Matching PSO',
    description: 'Kaprodi menentukan parameter dan menjalankan algoritma PSO untuk mencocokkan dosen dengan mahasiswa.',
  },
  {
    icon: CheckCircle,
    title: 'Terima Rekomendasi',
    description: 'Sistem menampilkan 3 dosen penguji terbaik beserta nilai kecocokan untuk setiap mahasiswa.',
  },
  {
    icon: Users,
    title: 'Tetapkan Penugasan',
    description: 'Kaprodi memvalidasi dan menetapkan susunan tim penguji secara final di dalam sistem.',
  },
]

// ====== Manfaat (Dampak bagi Pengguna) ======
const manfaat = [
  {
    icon: Clock,
    title: 'Efisiensi Waktu Kaprodi',
    description: 'Kaprodi tidak perlu memeriksa dosen satu per satu. Cukup klik tombol, rekomendasi langsung muncul.',
  },
  {
    icon: Shield,
    title: 'Keputusan Objektif',
    description: 'Rekomendasi berdasarkan data, bukan ingatan atau penilaian pribadi Kaprodi. Hasilnya lebih adil.',
  },
  {
    icon: Scale,
    title: 'Beban Menguji Merata',
    description: 'Tidak ada dosen yang kelebihan jadwal menguji. Semua dosen mendapat giliran yang adil.',
  },
  {
    icon: Eye,
    title: 'Transparansi untuk Semua',
    description: 'Dosen tahu siapa yang harus diuji. Mahasiswa tahu siapa pengujinya. Semua informasi jelas.',
  },
]
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>

<style>
html {
  scroll-behavior: smooth;
}

section[id] {
  scroll-margin-top: 80px;
}
</style>
