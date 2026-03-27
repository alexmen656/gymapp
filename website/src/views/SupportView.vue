<template>
    <div class="support">
        <Header></Header>
        <section class="hero-section">
            <div class="hero-content">
                <h1 class="hero-title">{{ config.supportTitle }}</h1>
                <div class="search-container">
                    <div class="search-box">
                        <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <input type="text" :placeholder="config.supportSearchPlaceholder" class="search-input"
                            v-model="searchQuery" />
                    </div>
                </div>
            </div>
        </section>
        <section class="getting-started">
            <div class="section-container">
                <h2 class="section-title">{{ config.supportSectionTitle }}</h2>
                <div class="cards-grid">
                    <router-link v-for="category in supportCategories" :key="category.id"
                        :to="`/support/${category.id}`" class="card">
                        <div class="card-icon" v-html="category.icon"></div>
                        <h3 class="card-title">{{ category.title }}</h3>
                        <p class="card-description">{{ category.description }}</p>
                    </router-link>
                </div>
            </div>
        </section>
        <section class="popular-articles">
            <div class="section-container">
                <h2 class="section-title">Popular Articles</h2>
                <div class="articles-list">
                    <router-link v-for="article in popularArticles" :key="article.id"
                        :to="`/support/${article.categoryId}`" class="article-item">
                        <div class="article-info">
                            <span class="article-category">{{ article.category }}</span>
                            <h3 class="article-title">{{ article.title }}</h3>
                        </div>
                        <svg class="article-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </router-link>
                </div>
            </div>
        </section>
        <section class="contact-section">
            <div class="section-container">
                <div class="contact-card">
                    <div class="contact-icon">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20z"
                                stroke="currentColor" stroke-width="2" />
                            <path d="M18 18c0-3.314 2.686-6 6-6s6 2.686 6 6c0 3.314-3 4.5-3 7.5" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" />
                            <circle cx="24" cy="32" r="1.5" fill="currentColor" />
                        </svg>
                    </div>
                    <h3 class="contact-title">Still need help?</h3>
                    <p class="contact-description">Can't find what you're looking for? We're here to help.</p>
                    <a href="mailto:support@pocketz.app" class="contact-button">Contact Support</a>
                </div>
            </div>
        </section>
        <Footer></Footer>
    </div>
</template>

<script setup lang="ts">
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { inject, ref } from 'vue';

const config: any = inject('config');
const searchQuery = ref('');

const supportCategories = config.supportCategories2;
const popularArticles = config.popularArticles;
</script>

<style scoped>
.support {
    min-height: 100vh;
    background: #F5F5F7;
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
    margin: 0 0 40px 0;
    letter-spacing: -0.02em;
}

.search-container {
    display: flex;
    justify-content: center;
}

.search-box {
    width: 100%;
    max-width: 480px;
    background: white;
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.search-icon {
    color: #999;
    flex-shrink: 0;
}

.search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 16px;
    color: #000;
}

.search-input::placeholder {
    color: #999;
}

.getting-started {
    background: white;
    padding: 80px 0;
}

.section-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.section-title {
    font-size: 48px;
    font-weight: 700;
    color: #000;
    margin: 0 0 48px 0;
    text-align: center;
    letter-spacing: -0.02em;
}

.cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    max-width: 1000px;
    margin: 0 auto;
}

.card {
    text-align: center;
    padding: 40px 24px;
    background: #F5F5F7;
    border-radius: 20px;
    transition: all 0.3s ease;
    cursor: pointer;
    text-decoration: none;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.card-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-title {
    font-size: 20px;
    font-weight: 600;
    color: #000;
    margin: 0 0 8px 0;
}

.card-description {
    font-size: 14px;
    color: #86868B;
    margin: 0;
    line-height: 1.5;
}

.popular-articles {
    background: #F5F5F7;
    padding: 80px 0;
}

.articles-list {
    max-width: 700px;
    margin: 0 auto;
    background: white;
    border-radius: 16px;
    overflow: hidden;
}

.article-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #E5E5E7;
    text-decoration: none;
    transition: background 0.2s;
}

.article-item:last-child {
    border-bottom: none;
}

.article-item:hover {
    background: #F5F5F7;
}

.article-info {
    flex: 1;
}

.article-category {
    font-size: 12px;
    font-weight: 500;
    color: #007AFF;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
    display: block;
}

.article-title {
    font-size: 17px;
    font-weight: 500;
    color: #000;
    margin: 0;
}

.article-chevron {
    color: #C7C7CC;
    flex-shrink: 0;
    margin-left: 16px;
}

.contact-section {
    background: white;
    padding: 80px 0 120px;
}

.contact-card {
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
    padding: 48px;
    background: #F5F5F7;
    border-radius: 20px;
}

.contact-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 24px;
    color: #007AFF;
}

.contact-title {
    font-size: 28px;
    font-weight: 700;
    color: #000;
    margin: 0 0 12px 0;
}

.contact-description {
    font-size: 16px;
    color: #86868B;
    margin: 0 0 24px 0;
    line-height: 1.5;
}

.contact-button {
    display: inline-block;
    background: #007AFF;
    color: white;
    padding: 14px 32px;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
    transition: background 0.2s;
}

.contact-button:hover {
    background: #0051D5;
}

@media (max-width: 1000px) {
    .cards-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 36px;
    }

    .section-title {
        font-size: 32px;
    }

    .cards-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .card {
        padding: 32px 20px;
    }

    .contact-card {
        padding: 32px 24px;
    }
}
</style>
