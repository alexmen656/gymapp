<template>
    <div class="support-detail">
        <Header></Header>
        <section class="hero-section">
            <div class="hero-content">
                <div class="breadcrumb">
                    <router-link to="/support" class="breadcrumb-link">Support</router-link>
                    <span class="breadcrumb-separator">›</span>
                    <span class="breadcrumb-current">{{ currentCategory?.title }}</span>
                </div>
                <h1 class="hero-title">{{ currentCategory?.title }}</h1>
            </div>
        </section>
        <section class="articles-section">
            <div class="section-container">
                <div class="articles-grid">
                    <article v-for="article in currentCategory?.articles" :key="article.id" class="article-card"
                        @click="openArticle(article)">
                        <div class="article-icon" v-if="article.icon">
                            <img :src="article.icon" :alt="article.title" />
                        </div>
                        <div class="article-content">
                            <h3 class="article-title">{{ article.title }}</h3>
                            <p class="article-description">{{ article.description }}</p>
                        </div>
                        <svg class="article-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </article>
                </div>
            </div>
        </section>
        <Teleport to="body">
            <div v-if="selectedArticle" class="modal-overlay" @click="closeArticle">
                <div class="modal-container" @click.stop>
                    <div class="modal-header">
                        <button class="modal-close" @click="closeArticle">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>
                    <div class="modal-content">
                        <h1 class="modal-title">{{ selectedArticle.title }}</h1>
                        <p class="modal-intro">{{ selectedArticle.intro }}</p>

                        <div v-for="(section, index) in selectedArticle.sections" :key="index" class="content-section">
                            <h2 class="section-heading">{{ section.heading }}</h2>
                            <p class="section-text" v-html="section.content"></p>
                            <div v-if="section.image" class="section-image">
                                <img :src="section.image" :alt="section.heading" />
                            </div>
                            <ul v-if="section.list" class="section-list">
                                <li v-for="item in section.list" :key="item">{{ item }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
        <Footer></Footer>
    </div>
</template>

<script setup lang="ts">
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { inject } from 'vue';

const config: any = inject('config');

interface ArticleSection {
    heading: string;
    content: string;
    image?: string;
    list?: string[];
}

interface Article {
    id: string;
    title: string;
    description: string;
    icon?: string;
    intro: string;
    sections: ArticleSection[];
}

interface SupportCategory {
    id: string;
    title: string;
    articles: Article[];
}

const route = useRoute();
const selectedArticle = ref<Article | null>(null);
const supportCategories: SupportCategory[] = config.supportCategories;

const currentCategory = computed(() => {
    const categoryId = route.params.category as string;
    return supportCategories.find(cat => cat.id === categoryId);
});

const openArticle = (article: Article) => {
    selectedArticle.value = article;
    document.body.style.overflow = 'hidden';
};

const closeArticle = () => {
    selectedArticle.value = null;
    document.body.style.overflow = '';
};
</script>

<style scoped>
.support-detail {
    min-height: 100vh;
    background: #F5F5F7;
}

.hero-section {
    padding-top: 100px;
    padding-bottom: 40px;
    background: #F5F5F7;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 24px;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    font-size: 14px;
}

.breadcrumb-link {
    color: #007AFF;
    text-decoration: none;
}

.breadcrumb-link:hover {
    text-decoration: underline;
}

.breadcrumb-separator {
    color: #86868B;
}

.breadcrumb-current {
    color: #86868B;
}

.hero-title {
    font-size: 48px;
    font-weight: 700;
    color: #000;
    margin: 0;
    letter-spacing: -0.02em;
}

.articles-section {
    background: white;
    padding: 60px 0 120px;
}

.section-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 24px;
}

.articles-grid {
    display: flex;
    flex-direction: column;
    gap: 1px;
    background: #E5E5E7;
    border-radius: 16px;
    overflow: hidden;
}

.article-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    background: white;
    cursor: pointer;
    transition: background 0.2s;
}

.article-card:hover {
    background: #F5F5F7;
}

.article-icon {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.article-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.article-content {
    flex: 1;
}

.article-title {
    font-size: 17px;
    font-weight: 600;
    color: #000;
    margin: 0 0 4px 0;
}

.article-description {
    font-size: 14px;
    color: #86868B;
    margin: 0;
}

.article-chevron {
    color: #C7C7CC;
    flex-shrink: 0;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.modal-container {
    background: white;
    border-radius: 20px;
    max-width: 680px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
}

.modal-header {
    position: sticky;
    top: 0;
    background: white;
    padding: 16px 24px;
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid #E5E5E7;
    z-index: 10;
}

.modal-close {
    background: #F5F5F7;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #86868B;
    transition: all 0.2s;
}

.modal-close:hover {
    background: #E5E5E7;
    color: #000;
}

.modal-content {
    padding: 32px 40px 48px;
}

.modal-title {
    font-size: 32px;
    font-weight: 700;
    color: #000;
    margin: 0 0 16px 0;
    letter-spacing: -0.02em;
}

.modal-intro {
    font-size: 17px;
    color: #86868B;
    line-height: 1.6;
    margin: 0 0 40px 0;
}

.content-section {
    margin-bottom: 32px;
}

.content-section:last-child {
    margin-bottom: 0;
}

.section-heading {
    font-size: 22px;
    font-weight: 600;
    color: #000;
    margin: 0 0 12px 0;
}

.section-text {
    font-size: 16px;
    color: #1D1D1F;
    line-height: 1.6;
    margin: 0;
}

.section-image {
    margin-top: 20px;
    border-radius: 12px;
    overflow: hidden;
    background: #F5F5F7;
}

.section-image img {
    width: 100%;
    display: block;
}

.section-list {
    margin: 16px 0 0 0;
    padding-left: 24px;
}

.section-list li {
    font-size: 16px;
    color: #1D1D1F;
    line-height: 1.8;
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 32px;
    }

    .modal-content {
        padding: 24px;
    }

    .modal-title {
        font-size: 24px;
    }

    .section-heading {
        font-size: 18px;
    }
}
</style>
