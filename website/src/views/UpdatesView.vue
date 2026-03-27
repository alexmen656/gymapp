<template>
    <div class="updates-page">
        <Header></Header>
        <section class="updates-hero">
            <div class="updates-hero-content">
                <h1 class="updates-hero-title">{{ updatesData.hero.title }}</h1>
                <p class="updates-hero-description">
                    {{ updatesData.hero.description }}
                </p>
            </div>
        </section>
        <section class="updates-content">
            <div class="updates-timeline">
                <article v-for="(release, index) in updatesData.releases" :key="index"
                    :class="['release-card', { 'release-latest': release.isLatest }]">
                    <div v-if="release.badge" class="release-badge">{{ release.badge }}</div>
                    <div class="release-header">
                        <div class="release-version">
                            <span class="version-number">{{ release.version }}</span>
                            <span class="version-date">{{ release.date }}</span>
                        </div>
                        <h2 class="release-title">{{ release.title }}</h2>
                    </div>
                    <p class="release-description">
                        {{ release.description }}
                    </p>
                    <div v-if="release.features" class="release-features">
                        <div v-for="(feature, featureIndex) in release.features" :key="featureIndex"
                            class="release-feature">
                            <div class="feature-icon">{{ feature.icon }}</div>
                            <div class="feature-content">
                                <h4>{{ feature.title }}</h4>
                                <p>{{ feature.description }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-if="release.imageUrl" class="release-image-showcase">
                        <img :src="release.imageUrl" :alt="`${release.version} Preview`" class="release-phone">
                    </div>
                    <ul v-if="release.changelog" class="release-changelog">
                        <li v-for="(item, itemIndex) in release.changelog" :key="itemIndex">{{ item }}</li>
                    </ul>
                </article>
            </div>
            <aside class="updates-sidebar">
                <div class="sidebar-card">
                    <h3>{{ updatesData.sidebar.newsletter.title }}</h3>
                    <p>{{ updatesData.sidebar.newsletter.description }}</p>
                    <div class="newsletter-form">
                        <input type="email" :placeholder="updatesData.sidebar.newsletter.placeholder"
                            class="newsletter-input">
                        <button class="newsletter-btn">Subscribe</button>
                    </div>
                </div>
                <div class="sidebar-card">
                    <h3>{{ updatesData.sidebar.quickAccess.title }}</h3>
                    <nav class="version-nav">
                        <a v-for="(link, index) in updatesData.sidebar.quickAccess.links" :key="index" href="#"
                            :class="['version-link', { active: index === 0 }]">{{ link.version }}</a>
                    </nav>
                </div>
                <div class="sidebar-card sidebar-cta">
                    <h3>{{ updatesData.sidebar.cta.title }}</h3>
                    <p>{{ updatesData.sidebar.cta.description }}</p>
                    <button class="cta-button">{{ updatesData.sidebar.cta.buttonText }}</button>
                </div>
            </aside>
        </section>
        <Footer></Footer>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import config from '../config/config.json';

const updatesData = ref(config.updatesView);
</script>

<style scoped>
.updates-page {
    min-height: 100vh;
    background: #fff;
}

.updates-hero {
    padding: 120px 40px 60px;
    text-align: center;
    /*background: linear-gradient(180deg, #f5f5f7 0%, #ffffff 100%);*/
}

.updates-hero-content {
    max-width: 700px;
    margin: 0 auto;
}

.updates-hero-title {
    font-size: 56px;
    font-weight: 700;
    color: #1d1d1f;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin: 0 0 20px 0;
}

.updates-hero-description {
    font-size: 21px;
    line-height: 1.5;
    color: #424245;
    margin: 0;
}

.updates-content {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 60px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 40px 100px;
}

.updates-timeline {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.release-card {
    background: #fff;
    border-radius: 24px;
    padding: 40px;
    box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.04),
        0 4px 12px rgba(0, 0, 0, 0.04),
        0 12px 32px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.release-card:hover {
    transform: translateY(-4px);
    box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.04),
        0 8px 24px rgba(0, 0, 0, 0.08),
        0 24px 48px rgba(0, 0, 0, 0.1);
}

.release-latest {
    background: linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%);
    color: #fff;
}

.release-badge {
    display: inline-block;
    background: #007AFF;
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 20px;
}

.release-header {
    margin-bottom: 20px;
}

.release-version {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.version-number {
    font-size: 14px;
    font-weight: 600;
    color: #007AFF;
}

.release-latest .version-number {
    color: #64D2FF;
}

.version-date {
    font-size: 14px;
    color: #86868b;
}

.release-latest .version-date {
    color: rgba(255, 255, 255, 0.6);
}

.release-title {
    font-size: 32px;
    font-weight: 700;
    color: #1d1d1f;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin: 0;
}

.release-latest .release-title {
    color: #fff;
}

.release-description {
    font-size: 17px;
    line-height: 1.6;
    color: #424245;
    margin: 0 0 24px 0;
}

.release-latest .release-description {
    color: rgba(255, 255, 255, 0.8);
}

.release-features {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 32px;
}

.release-feature {
    display: flex;
    gap: 16px;
    align-items: flex-start;
}

.feature-icon {
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}

.feature-content h4 {
    font-size: 17px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 4px 0;
}

.feature-content p {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    line-height: 1.4;
}

.release-image-showcase {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.release-phone {
    height: 400px;
    width: auto;
    filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3));
}

.release-changelog {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.release-changelog li {
    font-size: 15px;
    color: #424245;
    padding-left: 24px;
    position: relative;
    line-height: 1.5;
}

.release-changelog li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: #007AFF;
    font-weight: 600;
}

.updates-sidebar {
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: sticky;
    top: 100px;
    height: fit-content;
}

.sidebar-card {
    background: #f5f5f7;
    border-radius: 20px;
    padding: 24px;
}

.sidebar-card h3 {
    font-size: 17px;
    font-weight: 600;
    color: #1d1d1f;
    margin: 0 0 8px 0;
}

.sidebar-card p {
    font-size: 14px;
    color: #86868b;
    margin: 0 0 16px 0;
    line-height: 1.5;
}

.newsletter-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.newsletter-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #d2d2d7;
    border-radius: 12px;
    font-size: 15px;
    background: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.newsletter-input:focus {
    outline: none;
    border-color: #007AFF;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.newsletter-btn {
    background: #007AFF;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.newsletter-btn:hover {
    background: #0051D5;
}

.version-nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.version-link {
    font-size: 14px;
    color: #424245;
    text-decoration: none;
    padding: 8px 12px;
    border-radius: 8px;
    transition: background 0.2s, color 0.2s;
}

.version-link:hover {
    background: rgba(0, 0, 0, 0.04);
}

.version-link.active {
    background: #007AFF;
    color: white;
}

.sidebar-cta {
    background: linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%);
}

.sidebar-cta h3 {
    color: #fff;
}

.sidebar-cta p {
    color: rgba(255, 255, 255, 0.7);
}

.cta-button {
    width: 100%;
    background: #007AFF;
    color: white;
    border: none;
    padding: 14px 24px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
}

.cta-button:hover {
    background: #0051D5;
    transform: scale(1.02);
}

@media (max-width: 1000px) {
    .updates-content {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .updates-sidebar {
        position: static;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .sidebar-card {
        flex: 1;
        min-width: 280px;
    }
}

@media (max-width: 768px) {
    .updates-hero {
        padding: 100px 20px 40px;
    }

    .updates-hero-title {
        font-size: 36px;
    }

    .updates-hero-description {
        font-size: 18px;
    }

    .updates-content {
        padding: 40px 20px 60px;
    }

    .release-card {
        padding: 28px;
    }

    .release-title {
        font-size: 24px;
    }

    .release-phone {
        height: 300px;
    }

    .updates-sidebar {
        flex-direction: column;
    }

    .sidebar-card {
        min-width: 100%;
    }
}
</style>