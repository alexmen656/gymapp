<template>
    <nav
        :class="['navbar', { 'support-theme': isSupportAtTop, 'blog-updates-theme': isBlogOrUpdatesAtTop, 'no-border': isTransparentAtTop }]">
        <div class="nav-container">
            <div class="nav-left">
                <div @click="router.push('/')" class="logo">
                    <span class="logo-icon"><img :src="'/assets/' + config.appIcon"
                            :alt="'Logo of ' + config.appName"></span>
                    <span class="logo-text">{{ config.appName }}</span>
                </div>
            </div>
            <div class="nav-center">
                <a :href="link.href" class="nav-link" v-for="link in config.links" :key="link.name">{{ link.name }}</a>
            </div>
            <div class="nav-right">
                <a class="cta-a" :href="os == 'android' ? config.androidLink : config.iosLink"><button
                        class="cta-button">
                        <p style="text-align: center; font-weight: 500;">{{
                            config.ctaButtonText }}</p>
                    </button></a>
                <div class="menu-icon-con" @click="toggleMobileMenu" :class="{ active: mobileMenuOpen }">
                    <div class="menu-icon-1"></div>
                    <div class="menu-icon-2"></div>
                </div>
            </div>
        </div>
        <Transition name="dropdown">
            <div v-if="mobileMenuOpen" class="dropdown-menu">
                <a v-for="link in config.links" :key="link.name" :href="link.href" class="dropdown-link"
                    @click="closeMobileMenu">
                    {{ link.name }}
                </a>
                <a :href="os == 'android' ? config.androidLink : config.iosLink" class="dropdown-cta"
                    @click="closeMobileMenu">
                    {{ config.ctaButtonText }}
                </a>
            </div>
        </Transition>
    </nav>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { inject, ref, computed, onMounted, onUnmounted } from 'vue'

const config: any = inject('config')
const router = useRouter();
const route = useRoute();
const mobileMenuOpen = ref(false);

const isAtTop = ref(true);

function updateIsAtTop() {
    isAtTop.value = (typeof window !== 'undefined') ? window.scrollY === 0 : true;
}

onMounted(() => {
    updateIsAtTop();
    window.addEventListener('scroll', updateIsAtTop, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('scroll', updateIsAtTop);
});

const isSupportAtTop = computed(() => {
    return isAtTop.value && (route.name === 'support' || route.name === 'support-detail' || route.name === 'privacy-policy' || route.name === 'terms-of-use');
});

const isBlogOrUpdatesAtTop = computed(() => {
    return isAtTop.value && (route.name === 'blog' || route.name === 'updates');
});

//debug - I was testing production site lol
console.log(route.name);

const isTransparentAtTop = computed(() => {
    return isAtTop.value && (route.name === 'home' || route.name === 'support' || route.name === 'support-detail' || route.name === 'terms-of-use' || route.name === 'privacy-policy' || route.name === 'blog' || route.name === 'updates');
});

function getOS() {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';

    if (/android/i.test(ua)) return "android";
    if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return "ios";

    return "unknown";
}

const os = getOS();

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
};
</script>

<style scoped>
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    z-index: 100;
    padding: 14px 0;
}

.navbar.no-border {
    border-bottom: none;
}

.navbar.support-theme {
    background: #F5F5F7;
    backdrop-filter: none;
}

.navbar.blog-updates-theme {
    background: linear-gradient(180deg, #f5f5f7 0%, #ffffff 100%);
    backdrop-filter: none;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-left {
    flex: 1;
}

.logo {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 10px;
}

.logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 20px;
    overflow: hidden;
}

.logo-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.logo-text {
    font-size: 20px;
    font-weight: 600;
    color: #000;
    font-family: "system-ui", -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif, "System Default", sans-serif;
    letter-spacing: -0.4px;
}

.nav-center {
    display: flex;
    gap: 32px;
    flex: 2;
    justify-content: center;
}

.nav-link {
    color: rgb(16, 16, 16);
    font-weight: 500;
    text-decoration: none;
    font-size: 15px;
    font-family: "system-ui", -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif, "System Default", sans-serif;
    letter-spacing: -0.2px;
    transition: color 0.2s;
}

.nav-link:hover {
    color: rgb(0, 136, 255);
}

.nav-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
    padding: 2px 0;
}

.cta-button {
    background: rgb(0, 136, 255);
    height: 36px;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 100px;
    font-size: 15px;
    font-weight: 500;
    font-family: "system-ui", -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif, "System Default", sans-serif;
    letter-spacing: -0.4px;
    cursor: pointer;
    transition: background 0.2s;
}

.cta-button:hover {
    background: #0051D5;
}

.menu-icon-con {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    width: 24px;
    height: 18px;
    justify-content: center;
}

.menu-icon-1,
.menu-icon-2 {
    width: 24px;
    height: 2px;
    background-color: #000;
    border-radius: 1px;
    transition: all 0.3s ease;
}

.menu-icon-con.active .menu-icon-1 {
    transform: rotate(45deg) translateY(5px);
}

.menu-icon-con.active .menu-icon-2 {
    transform: rotate(-45deg) translateY(-5px);
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    z-index: 99;
    display: flex;
    flex-direction: column;
}

.dropdown-link {
    color: #000;
    text-decoration: none;
    padding: 16px 24px;
    font-size: 15px;
    font-weight: 500;
    border-bottom: 1px solid #F5F5F7;
    transition: background 0.2s;
}

.dropdown-link:last-of-type {
    border-bottom: none;
}

.dropdown-link:hover {
    background: #F5F5F7;
}

.dropdown-cta {
    background: rgb(0, 136, 255);
    color: white;
    text-decoration: none;
    padding: 12px 24px;
    margin: 8px;
    font-size: 15px;
    font-weight: 600;
    text-align: center;
    border-radius: 8px;
    transition: background 0.2s;
}

.dropdown-cta:hover {
    background: #0051D5;
}

.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.3s ease;
}

.dropdown-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

@media (max-width: 768px) {
    .nav-center {
        display: none;
    }

    .menu-icon-con {
        display: flex;
    }

    .cta-a {
        display: none;
    }

    .cta-button {
        padding: 8px 16px;
        font-size: 14px;
    }
}
</style>