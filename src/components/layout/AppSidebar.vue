<template>
  <aside :class="[
    'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
    {
      'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
      'lg:w-[90px]': !isExpanded && !isHovered,
      'translate-x-0 w-[290px]': isMobileOpen,
      '-translate-x-full': !isMobileOpen,
      'lg:translate-x-0': true,
    },
  ]" @mouseenter="handleMouseEnter" @mouseleave="isHovered = false">
    <div :class="[
      'py-8 flex',
      !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
    ]">
      <!-- <router-link to="/">
        <img v-if="isExpanded || isHovered || isMobileOpen" class="dark:hidden" src="/logo.svg" alt="Logo"
          width="150" height="40" />
        <img v-if="isExpanded || isHovered || isMobileOpen" class="hidden dark:block" src="/logo.svg"
          alt="Logo" width="150" height="40" />
        <img v-else src="/logo.svg" alt="Logo" width="32" height="32" />
      </router-link> -->
    </div>
    <div class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2 :class="[
              'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
              !isExpanded && !isHovered
                ? 'lg:justify-center'
                : 'justify-start',
            ]">
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name" v-show="canViewMenu(item.roles)">
                <button v-if="item.subItems" @click="toggleSubmenu(groupIndex, index)" :class="[
                  'menu-item group w-full',
                  {
                    'menu-item-active': isSubmenuOpen(groupIndex, index),
                    'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                  },
                  !isExpanded && !isHovered
                    ? 'lg:justify-center'
                    : 'lg:justify-start',
                ]">
                  <span :class="[
                    isSubmenuOpen(groupIndex, index)
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive',
                  ]">
                    <component :is="item.icon" />
                  </span>
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{ item.name }}</span>
                  <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen" :class="[
                    'ml-auto w-5 h-5 transition-transform duration-200',
                    {
                      'rotate-180 text-brand-500': isSubmenuOpen(
                        groupIndex,
                        index
                      ),
                    },
                  ]" />
                </button>
                <router-link v-else-if="item.path" :to="item.path" :class="[
                  'menu-item group',
                  {
                    'menu-item-active': isActive(item.path),
                    'menu-item-inactive': !isActive(item.path),
                  },
                ]">
                  <span :class="[
                    isActive(item.path)
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive',
                  ]">
                    <component :is="item.icon" />
                  </span>
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{ item.name }}</span>
                </router-link>
                <transition @enter="startTransition" @after-enter="endTransition" @before-leave="startTransition"
                  @after-leave="endTransition">
                  <div v-show="isSubmenuOpen(groupIndex, index) &&
                    (isExpanded || isHovered || isMobileOpen)
                    ">
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link :to="subItem.path" :class="[
                          'menu-dropdown-item',
                          {
                            'menu-dropdown-item-active': isActive(
                              subItem.path
                            ),
                            'menu-dropdown-item-inactive': !isActive(
                              subItem.path
                            ),
                          },
                        ]">
                          {{ subItem.name }}
                          <span class="flex items-center gap-1 ml-auto">
                            <span v-if="subItem.new" :class="[
                              'menu-dropdown-badge',
                              {
                                'menu-dropdown-badge-active': isActive(
                                  subItem.path
                                ),
                                'menu-dropdown-badge-inactive': !isActive(
                                  subItem.path
                                ),
                              },
                            ]">
                              new
                            </span>
                            <span v-if="subItem.pro" :class="[
                              'menu-dropdown-badge',
                              {
                                'menu-dropdown-badge-active': isActive(
                                  subItem.path
                                ),
                                'menu-dropdown-badge-inactive': !isActive(
                                  subItem.path
                                ),
                              },
                            ]">
                              pro
                            </span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <!-- <SidebarWidget v-if="isExpanded || isHovered || isMobileOpen" /> -->
    </div>
  </aside>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";
import { useRoute } from "vue-router";
import type { Component } from "vue";

import {
  GridIcon,
  // CalenderIcon,
  UserCircleIcon,
  // PieChartIcon,
  ChevronDownIcon,
  HorizontalDots,
  PageIcon,
  TableIcon,
  ListIcon,
  PlugInIcon,
} from "../../icons";
// import SidebarWidget from "./SidebarWidget.vue";
import BoxCubeIcon from "@/icons/BoxCubeIcon.vue";
import { useSidebar } from "@/composables/useSidebar";

interface MenuSubItem {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
  roles?: string[];
}

interface MenuItem {
  icon?: Component;
  name: string;
  path?: string;
  subItems?: MenuSubItem[];
  roles?: string[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const route = useRoute();
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();
const getStoredRoles = () => {
  const stored = localStorage.getItem('userRoles');
  try {
    const parsed = JSON.parse(stored || '[]');
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return (stored || '').split(',').map(r => r.trim());
  }
};

const userRoles = ref<string[]>(getStoredRoles());

const menuGroups: MenuGroup[] = [
  {
    title: "Menu",
    items: [
      {
        icon: GridIcon,
        name: "Dashboard",
        roles: ['Admin', 'Kaprodi'],
        subItems: [{ name: "Dashboard", path: "/dashboard", pro: false }],
      },
      {
        icon: ListIcon,
        name: "Data Prodi",
        path: "/prodi",
        roles: ['Admin']
      },
      {
        icon: PageIcon,
        name: "Topik TA",
        path: "/topik-ta",
        roles: ['Admin']
      },
      {
        icon: TableIcon,
        name: "Keahlian Dosen",
        path: "/keahlian-dosen",
        roles: ['Admin', 'Kaprodi']
      },
      {
        icon: UserCircleIcon,
        name: "User",
        roles: ['Admin', 'Kaprodi'],
        subItems: [
          { name: "Dosen", path: "/dosen", pro: false },
          { name: "Mahasiswa", path: "/mahasiswa", pro: false }
        ],
      },
      {
        icon: BoxCubeIcon,
        name: "Penguji TA",
        roles: ['Kaprodi'],
        subItems: [
          { name: "Matching TA", path: "/matching-ta", pro: false },
          { name: "Penugasan Penguji", path: "/penugasan-penguji", pro: false }
        ],
      },
      {
        icon: PlugInIcon,
        name: "Mahasiswa",
        path: "/mahasiswa-diuji",
        roles: ['Dosen']
      },
      {
        icon: PlugInIcon,
        name: "Tugas Akhir",
        path: "/dosen-penguji",
        roles: ['Mahasiswa']
      },
      // {
      //   icon: CalenderIcon,
      //   name: "Calendar",
      //   path: "/calendar",
      // },
      // {
      //   icon: UserCircleIcon,
      //   name: "User Profile",
      //   path: "/profile",
      // },
      // {
      //   name: "Forms",
      //   icon: ListIcon,
      //   subItems: [
      //     { name: "Form Elements", path: "/form-elements", pro: false },
      //   ],
      // },
      // {
      //   name: "Tables",
      //   icon: TableIcon,
      //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
      // },
      // {
      //   name: "Pages",
      //   icon: PageIcon,
      //   subItems: [
      //     { name: "Black Page", path: "/blank", pro: false },
      //     { name: "404 Page", path: "/error-404", pro: false },
      //   ],
      // },
    ],
  },
  // {
  //   title: "Others",
  //   items: [
  //     {
  //       icon: PieChartIcon,
  //       name: "Charts",
  //       subItems: [
  //         { name: "Line Chart", path: "/line-chart", pro: false },
  //         { name: "Bar Chart", path: "/bar-chart", pro: false },
  //       ],
  //     },
  //     {
  //       icon: BoxCubeIcon,
  //       name: "Ui Elements",
  //       subItems: [
  //         { name: "Alerts", path: "/alerts", pro: false },
  //         { name: "Avatars", path: "/avatars", pro: false },
  //         { name: "Badge", path: "/badge", pro: false },
  //         { name: "Buttons", path: "/buttons", pro: false },
  //         { name: "Images", path: "/images", pro: false },
  //         { name: "Videos", path: "/videos", pro: false },
  //       ],
  //     },
  //     {
  //       icon: PlugInIcon,
  //       name: "Authentication",
  //       subItems: [
  //         { name: "Signin", path: "/signin", pro: false },
  //         { name: "Signup", path: "/signup", pro: false },
  //       ],
  //     },
  //   ],
  // },
];

const canViewMenu = (roles?: string[]) => {
  if (!roles || roles.length === 0) return true;
  const userRolesLower = userRoles.value.map(r => typeof r === 'string' ? r.toLowerCase() : '');
  return roles.some((role) => userRolesLower.includes(role.toLowerCase()));
};

const handleMouseEnter = () => {
  if (!isExpanded.value) {
    isHovered.value = true;
  }
};

const isActive = (path: string) => route.path === path;

const toggleSubmenu = (groupIndex: number, itemIndex: number) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};


const updateActiveSubmenu = () => {
  let found = false;
  menuGroups.forEach((group, gIndex) => {
    group.items.forEach((item, iIndex) => {
      if (item.subItems && item.subItems.some((subItem) => isActive(subItem.path))) {
        openSubmenu.value = `${gIndex}-${iIndex}`; // Buka menu ini!
        found = true;
      }
    });
  });

  if (!found) {
    openSubmenu.value = null;
  }
};

const isSubmenuOpen = (groupIndex: number, itemIndex: number) => {
  return openSubmenu.value === `${groupIndex}-${itemIndex}`;
};

watch(() => route.path, () => {
  updateActiveSubmenu();
}, { immediate: true });


const startTransition = (el: Element) => {
  const htmlEl = el as HTMLElement;

  htmlEl.style.height = "auto";
  const height = htmlEl.scrollHeight;
  htmlEl.style.height = "0px";

  void htmlEl.offsetHeight;

  htmlEl.style.height = height + "px";
};

const endTransition = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = "";
};
</script>
