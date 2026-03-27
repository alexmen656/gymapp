<template>
    <div class="privacy-policy">
        <Header></Header>
        <section class="hero-section">
            <div class="hero-content">
                <h1 class="hero-title">Privacy policy</h1>
                <p class="hero-subtitle">
                    We respect your privacy and believe that the less we know about you,<br />
                    the better both for you and for us.
                </p>
                <p class="effective-date"><strong>Effective date:</strong> {{ config.privacyPolicyEffectiveDate }}</p>
            </div>
        </section>
        <section class="content-section">
            <div class="content-container">
                <div class="content-text" v-html="text"></div>
            </div>
        </section>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { inject } from 'vue'

const config: any = inject('config')
const text: any = inject('privacy-policy')
</script>

<style scoped>
.privacy-policy {
    min-height: 100vh;
    background: #fff;
}

.hero-section {
    padding-top: 120px;
    padding-bottom: 60px;
    background: #F5F5F7;
    text-align: center;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 24px;
}

.hero-title {
    font-size: 56px;
    font-weight: 700;
    color: #000;
    margin: 0 0 24px 0;
    letter-spacing: -0.02em;
}

.hero-subtitle {
    font-size: 18px;
    line-height: 1.6;
    color: #333;
    margin: 0 0 24px 0;
    font-weight: 400;
}

.effective-date {
    font-size: 15px;
    color: #666;
    margin: 0;
}

.content-section {
    padding: 80px 0;
    background: #fff;
}

.content-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 24px;
}

.content-text {
    font-size: 16px;
    line-height: 1.8;
    color: #333;
}

.content-text p {
    margin: 0 0 24px 0;
}

.content-text p:last-child {
    margin-bottom: 0;
}

:deep(.section-title) {
    font-size: 32px;
    font-weight: 700;
    color: #000;
    margin: 48px 0 24px 0;
    letter-spacing: -0.01em;
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 36px;
    }

    .hero-subtitle {
        font-size: 16px;
    }

    .content-text {
        font-size: 15px;
    }

    :deep(.section-title) {
        font-size: 24px;
    }
}
</style>
