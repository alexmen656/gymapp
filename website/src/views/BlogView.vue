<template>
    <div class="blog-page">
        <Header></Header>
        <section class="blog-hero">
            <div class="blog-hero-content">
                <h1 class="blog-hero-title">{{ config.blogView.hero.title }}</h1>
                <p class="blog-hero-description">
                    {{ config.blogView.hero.description }}
                </p>
            </div>
        </section>
        <section class="blog-content">
            <div class="blog-grid">
                <article class="blog-card blog-featured">
                    <div class="blog-card-image">
                        <img :src="config.blogView.featuredPost.image" alt="Featured Post">
                        <span class="blog-category">{{ config.blogView.featuredPost.category }}</span>
                    </div>
                    <div class="blog-card-content">
                        <div class="blog-meta">
                            <span class="blog-date">{{ config.blogView.featuredPost.date }}</span>
                            <span class="blog-read-time">{{ config.blogView.featuredPost.readTime }}</span>
                        </div>
                        <h2 class="blog-card-title">{{ config.blogView.featuredPost.title }}</h2>
                        <p class="blog-card-excerpt">
                            {{ config.blogView.featuredPost.excerpt }}
                        </p>
                        <a :href="config.blogView.featuredPost.link" class="blog-read-more">Read more →</a>
                    </div>
                </article>
                <article v-for="post in config.blogView.posts" :key="post.title" class="blog-card">
                    <div class="blog-card-image">
                        <img :src="post.image" alt="Blog Post">
                        <span class="blog-category">{{ post.category }}</span>
                    </div>
                    <div class="blog-card-content">
                        <div class="blog-meta">
                            <span class="blog-date">{{ post.date }}</span>
                            <span class="blog-read-time">{{ post.readTime }}</span>
                        </div>
                        <h3 class="blog-card-title">{{ post.title }}</h3>
                        <p class="blog-card-excerpt">
                            {{ post.excerpt }}
                        </p>
                        <a :href="post.link" class="blog-read-more">Read more →</a>
                    </div>
                </article>
            </div>
            <aside class="blog-sidebar">
                <div class="sidebar-card">
                    <h3>{{ config.blogView.sidebar.categories.title }}</h3>
                    <nav class="category-nav">
                        <a v-for="category in config.blogView.sidebar.categories.items" :key="category.name"
                            :href="category.link" class="category-link">
                            <span>{{ category.name }}</span>
                            <span class="category-count">{{ category.count }}</span>
                        </a>
                    </nav>
                </div>
                <div class="sidebar-card">
                    <h3>{{ config.blogView.sidebar.newsletter.title }}</h3>
                    <p>{{ config.blogView.sidebar.newsletter.description }}</p>
                    <div class="newsletter-form">
                        <input type="email" :placeholder="config.blogView.sidebar.newsletter.placeholder"
                            class="newsletter-input">
                        <button class="newsletter-btn">{{ config.blogView.sidebar.newsletter.buttonText }}</button>
                    </div>
                </div>
                <div class="sidebar-card sidebar-popular">
                    <h3>{{ config.blogView.sidebar.popularPosts.title }}</h3>
                    <div class="popular-posts">
                        <a v-for="post in config.blogView.sidebar.popularPosts.posts" :key="post.number"
                            :href="post.link" class="popular-post">
                            <span class="popular-number">{{ post.number }}</span>
                            <span class="popular-title">{{ post.title }}</span>
                        </a>
                    </div>
                </div>
                <div class="sidebar-card sidebar-cta">
                    <h3>{{ config.blogView.sidebar.cta.title }}</h3>
                    <p>{{ config.blogView.sidebar.cta.description }}</p>
                    <button class="cta-button">{{ config.blogView.sidebar.cta.buttonText }}</button>
                </div>
            </aside>
        </section>
        <div class="load-more-container">
            <button class="load-more-btn">{{ config.blogView.loadMore.buttonText }}</button>
        </div>
        <Footer></Footer>
    </div>
</template>

<script setup lang="ts">
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { inject } from 'vue'

const config: any = inject('config')
</script>

<style scoped>
.blog-page {
    min-height: 100vh;
    background: #fff;
}

.blog-hero {
    padding: 120px 40px 60px;
    text-align: center;
}

.blog-hero-content {
    max-width: 700px;
    margin: 0 auto;
}

.blog-hero-title {
    font-size: 56px;
    font-weight: 700;
    color: #1d1d1f;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin: 0 0 20px 0;
}

.blog-hero-description {
    font-size: 21px;
    line-height: 1.5;
    color: #424245;
    margin: 0;
}

.blog-content {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 60px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 40px 40px;
}

.blog-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
}

.blog-card {
    background: #fff;
    border-radius: 24px;
    overflow: hidden;
    box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.04),
        0 4px 12px rgba(0, 0, 0, 0.04),
        0 12px 32px rgba(0, 0, 0, 0.06);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.blog-card:hover {
    transform: translateY(-6px);
    box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.04),
        0 8px 24px rgba(0, 0, 0, 0.08),
        0 24px 48px rgba(0, 0, 0, 0.12);
}

.blog-featured {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.blog-featured .blog-card-image {
    height: 100%;
    min-height: 350px;
}

.blog-featured .blog-card-content {
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.blog-featured .blog-card-title {
    font-size: 28px;
}

.blog-card-image {
    position: relative;
    height: 200px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    overflow: hidden;
}

.blog-card-image img {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    height: 180px;
    width: auto;
    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
}

.blog-featured .blog-card-image img {
    height: 280px;
    bottom: -30px;
}

.blog-category {
    position: absolute;
    top: 16px;
    left: 16px;
    background: rgba(255, 255, 255, 0.95);
    color: #1d1d1f;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.02em;
}

.blog-card-content {
    padding: 24px;
}

.blog-meta {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
}

.blog-date,
.blog-read-time {
    font-size: 13px;
    color: #86868b;
}

.blog-card-title {
    font-size: 20px;
    font-weight: 600;
    color: #1d1d1f;
    line-height: 1.3;
    margin: 0 0 12px 0;
    letter-spacing: -0.01em;
}

.blog-card-excerpt {
    font-size: 15px;
    line-height: 1.6;
    color: #424245;
    margin: 0 0 16px 0;
}

.blog-read-more {
    font-size: 15px;
    font-weight: 600;
    color: #007AFF;
    text-decoration: none;
    transition: color 0.2s;
}

.blog-read-more:hover {
    color: #0051D5;
}

.blog-sidebar {
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
    margin: 0 0 16px 0;
}

.sidebar-card p {
    font-size: 14px;
    color: #86868b;
    margin: 0 0 16px 0;
    line-height: 1.5;
}

.category-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.category-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    border-radius: 10px;
    text-decoration: none;
    color: #1d1d1f;
    font-size: 15px;
    transition: background 0.2s;
}

.category-link:hover {
    background: rgba(0, 0, 0, 0.04);
}

.category-count {
    font-size: 13px;
    color: #86868b;
    background: #fff;
    padding: 2px 10px;
    border-radius: 12px;
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

.popular-posts {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.popular-post {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    text-decoration: none;
    padding: 8px 0;
    transition: opacity 0.2s;
}

.popular-post:hover {
    opacity: 0.7;
}

.popular-number {
    font-size: 14px;
    font-weight: 700;
    color: #007AFF;
    min-width: 24px;
}

.popular-title {
    font-size: 14px;
    color: #1d1d1f;
    line-height: 1.4;
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

.load-more-container {
    display: flex;
    justify-content: center;
    padding: 40px;
}

.load-more-btn {
    background: #f5f5f7;
    color: #1d1d1f;
    border: none;
    padding: 16px 40px;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
}

.load-more-btn:hover {
    background: #e8e8ed;
    transform: scale(1.02);
}

@media (max-width: 1100px) {
    .blog-content {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .blog-sidebar {
        position: static;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .sidebar-card {
        flex: 1;
        min-width: 280px;
    }
}

@media (max-width: 900px) {
    .blog-featured {
        grid-template-columns: 1fr;
    }

    .blog-featured .blog-card-image {
        min-height: 250px;
    }
}

@media (max-width: 768px) {
    .blog-hero {
        padding: 100px 20px 40px;
    }

    .blog-hero-title {
        font-size: 36px;
    }

    .blog-hero-description {
        font-size: 18px;
    }

    .blog-content {
        padding: 40px 20px;
    }

    .blog-grid {
        grid-template-columns: 1fr;
        gap: 24px;
    }

    .blog-card-content {
        padding: 20px;
    }

    .blog-featured .blog-card-content {
        padding: 24px;
    }

    .blog-featured .blog-card-title {
        font-size: 22px;
    }

    .blog-sidebar {
        flex-direction: column;
    }

    .sidebar-card {
        min-width: 100%;
    }
}
</style>
