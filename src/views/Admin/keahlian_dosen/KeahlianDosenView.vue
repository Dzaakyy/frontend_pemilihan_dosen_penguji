<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Daftar Keahlian Dosen">
        <KeahlianDosenComponents />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import KeahlianDosenComponents from "@/components/admin/keahlian_dosen/KeahlianDosenComponents.vue";
const currentPageTitle = ref("Keahlian Dosen");
</script>
