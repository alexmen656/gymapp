<template>
    <div class="suggest-feature">
        <Header></Header>
        <section class="hero-section">
            <div class="hero-content">
                <h1 class="hero-title">Suggest a Feature</h1>
                <p class="hero-description">Help us make Pocketz better. Share your ideas and vote for features you'd
                    love to see.</p>
            </div>
        </section>
        <section class="submit-section">
            <div class="section-container">
                <div class="submit-card">
                    <h2 class="submit-title">Share Your Idea</h2>
                    <form @submit.prevent="submitFeature" class="submit-form">
                        <div class="form-group">
                            <label for="title">Feature Title</label>
                            <input type="text" id="title" v-model="newFeature.title"
                                placeholder="e.g., Apple Wallet Integration" required />
                        </div>
                        <div class="form-group">
                            <label for="category">Category</label>
                            <select id="category" v-model="newFeature.category">
                                <option value="general">General</option>
                                <option value="cards">Cards & Barcodes</option>
                                <option value="widgets">Widgets</option>
                                <option value="sharing">Sharing</option>
                                <option value="sync">Sync & Backup</option>
                                <option value="ui">User Interface</option>
                                <option value="watch">Apple Watch</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea id="description" v-model="newFeature.description"
                                placeholder="Describe your feature idea in detail..." rows="4" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="email">Email (optional)</label>
                            <input type="email" id="email" v-model="newFeature.email" placeholder="your@email.com" />
                            <span class="form-hint">We'll notify you when your feature gets implemented</span>
                        </div>
                        <button type="submit" class="submit-button" :disabled="isSubmitting">
                            <span v-if="isSubmitting">Submitting...</span>
                            <span v-else>Submit Feature</span>
                        </button>
                        <div v-if="submitMessage" class="submit-message"
                            :class="{ success: submitSuccess, error: !submitSuccess }">
                            {{ submitMessage }}
                        </div>
                    </form>
                </div>
            </div>
        </section>
        <section class="roadmap-section">
            <div class="section-container">
                <h2 class="section-title">Community Feature Requests</h2>
                <p class="section-subtitle">Vote for features you'd like to see in Pocketz</p>
                <div class="filter-tabs">
                    <button v-for="tab in filterTabs" :key="tab.value" class="filter-tab"
                        :class="{ active: activeFilter === tab.value }" @click="activeFilter = tab.value">
                        {{ tab.label }}
                    </button>
                </div>
                <div class="features-list" v-if="filteredFeatures.length > 0">
                    <div v-for="feature in filteredFeatures" :key="feature.id" class="feature-card">
                        <div class="vote-section">
                            <button class="vote-button" @click="voteForFeature(feature)"
                                :disabled="votedFeatures.includes(feature.id)">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 4l6 8H4l6-8z" fill="currentColor" />
                                </svg>
                            </button>
                            <span class="vote-count">{{ feature.votes || 0 }}</span>
                        </div>
                        <div class="feature-content">
                            <div class="feature-header">
                                <span class="feature-category" :class="feature.category">{{
                                    getCategoryLabel(feature.category) }}</span>
                                <span class="feature-status" :class="feature.status">{{ getStatusLabel(feature.status)
                                    }}</span>
                            </div>
                            <h3 class="feature-title">{{ feature.title }}</h3>
                            <p class="feature-description">{{ feature.description }}</p>
                        </div>
                    </div>
                </div>

                <div v-else class="empty-state">
                    <p>No feature requests yet. Be the first to suggest one!</p>
                </div>
            </div>
        </section>
        <Footer></Footer>
    </div>
</template>

<script setup lang="ts">
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { ref, computed, onMounted } from 'vue';

interface Feature {
    id: number;
    title: string;
    description: string;
    email?: string;
    category: string;
    votes: number;
    status: string;
    createdAt: string;
}

const API_BASE = 'http://localhost:3000';

const newFeature = ref({
    title: '',
    description: '',
    email: '',
    category: 'general'
});

const features = ref<Feature[]>([]);
const isSubmitting = ref(false);
const submitMessage = ref('');
const submitSuccess = ref(false);
const activeFilter = ref('all');
const votedFeatures = ref<number[]>([]);

const filterTabs = [
    { label: 'All', value: 'all' },
    { label: 'Most Voted', value: 'popular' },
    { label: 'Planned', value: 'planned' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' }
];

const filteredFeatures = computed(() => {
    let result = [...features.value];

    if (activeFilter.value === 'popular') {
        result.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    } else if (activeFilter.value !== 'all') {
        result = result.filter(f => f.status === activeFilter.value);
    }

    return result;
});

const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
        general: 'General',
        cards: 'Cards & Barcodes',
        widgets: 'Widgets',
        sharing: 'Sharing',
        sync: 'Sync & Backup',
        ui: 'UI/UX',
        watch: 'Apple Watch'
    };
    return labels[category] || category;
};

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        pending: 'Under Review',
        planned: 'Planned',
        'in-progress': 'In Progress',
        completed: 'Completed'
    };
    return labels[status] || status;
};

const loadFeatures = async () => {
    try {
        const response = await fetch(`${API_BASE}/suggested-features`);
        if (response.ok) {
            features.value = await response.json();
        }
    } catch (error) {
        console.error('Failed to load features:', error);
    }
};

const submitFeature = async () => {
    if (!newFeature.value.title || !newFeature.value.description) return;

    isSubmitting.value = true;
    submitMessage.value = '';

    try {
        const response = await fetch(`${API_BASE}/suggest-feature`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newFeature.value)
        });

        if (response.ok) {
            const result = await response.json();
            features.value.push(result.data);
            newFeature.value = { title: '', description: '', email: '', category: 'general' };
            submitSuccess.value = true;
            submitMessage.value = 'Thank you! Your feature suggestion has been submitted.';
        } else {
            throw new Error('Failed to submit');
        }
    } catch (error) {
        submitSuccess.value = false;
        submitMessage.value = 'Something went wrong. Please try again.';
    } finally {
        isSubmitting.value = false;
        setTimeout(() => {
            submitMessage.value = '';
        }, 5000);
    }
};

const voteForFeature = async (feature: Feature) => {
    if (votedFeatures.value.includes(feature.id)) return;

    try {
        const response = await fetch(`${API_BASE}/vote-feature/${feature.id}`, {
            method: 'POST'
        });

        if (response.ok) {
            feature.votes = (feature.votes || 0) + 1;
            votedFeatures.value.push(feature.id);
            localStorage.setItem('votedFeatures', JSON.stringify(votedFeatures.value));
        }
    } catch (error) {
        console.error('Failed to vote:', error);
    }
};

onMounted(() => {
    loadFeatures();

    const stored = localStorage.getItem('votedFeatures');
    if (stored) {
        votedFeatures.value = JSON.parse(stored);
    }
});
</script>

<style scoped>
.suggest-feature {
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
    max-width: 700px;
    margin: 0 auto;
    padding: 0 24px;
}

.hero-title {
    font-size: 56px;
    font-weight: 700;
    color: #000;
    margin: 0 0 16px 0;
    letter-spacing: -0.02em;
}

.hero-description {
    font-size: 21px;
    color: #86868B;
    margin: 0;
    line-height: 1.5;
}

/* Submit Section */
.submit-section {
    background: white;
    padding: 80px 0;
}

.section-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.submit-card {
    max-width: 600px;
    margin: 0 auto;
    background: #F5F5F7;
    border-radius: 20px;
    padding: 48px;
}

.submit-title {
    font-size: 28px;
    font-weight: 700;
    color: #000;
    margin: 0 0 32px 0;
    text-align: center;
}

.submit-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 14px;
    font-weight: 600;
    color: #000;
}

.form-group input,
.form-group textarea,
.form-group select {
    padding: 14px 16px;
    border: 1px solid #E5E5E7;
    border-radius: 12px;
    font-size: 16px;
    color: #000;
    background: white;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
    outline: none;
    border-color: #007AFF;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.form-group textarea {
    resize: vertical;
    min-height: 120px;
}

.form-hint {
    font-size: 12px;
    color: #86868B;
}

.submit-button {
    background: #007AFF;
    color: white;
    border: none;
    padding: 16px 32px;
    border-radius: 30px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
}

.submit-button:hover:not(:disabled) {
    background: #0051D5;
    transform: scale(1.02);
}

.submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.submit-message {
    text-align: center;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 15px;
}

.submit-message.success {
    background: #D1FAE5;
    color: #065F46;
}

.submit-message.error {
    background: #FEE2E2;
    color: #991B1B;
}

/* Roadmap Section */
.roadmap-section {
    background: #F5F5F7;
    padding: 80px 0 120px;
}

.section-title {
    font-size: 40px;
    font-weight: 700;
    color: #000;
    margin: 0 0 12px 0;
    text-align: center;
    letter-spacing: -0.02em;
}

.section-subtitle {
    font-size: 18px;
    color: #86868B;
    margin: 0 0 40px 0;
    text-align: center;
}

.filter-tabs {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 40px;
    flex-wrap: wrap;
}

.filter-tab {
    background: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    color: #86868B;
    cursor: pointer;
    transition: all 0.2s;
}

.filter-tab:hover {
    color: #000;
}

.filter-tab.active {
    background: #000;
    color: white;
}

.features-list {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.feature-card {
    display: flex;
    gap: 20px;
    background: white;
    border-radius: 16px;
    padding: 24px;
    transition: box-shadow 0.2s;
}

.feature-card:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.vote-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 50px;
}

.vote-button {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 2px solid #E5E5E7;
    background: white;
    color: #86868B;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.vote-button:hover:not(:disabled) {
    border-color: #007AFF;
    color: #007AFF;
    background: #F0F7FF;
}

.vote-button:disabled {
    border-color: #007AFF;
    color: #007AFF;
    background: #F0F7FF;
    cursor: default;
}

.vote-count {
    font-size: 15px;
    font-weight: 600;
    color: #000;
}

.feature-content {
    flex: 1;
}

.feature-header {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
}

.feature-category {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 4px 10px;
    border-radius: 6px;
    background: #F5F5F7;
    color: #86868B;
}

.feature-category.cards {
    background: #FEF3C7;
    color: #92400E;
}

.feature-category.widgets {
    background: #DBEAFE;
    color: #1E40AF;
}

.feature-category.sharing {
    background: #FCE7F3;
    color: #9D174D;
}

.feature-category.sync {
    background: #D1FAE5;
    color: #065F46;
}

.feature-category.ui {
    background: #EDE9FE;
    color: #5B21B6;
}

.feature-category.watch {
    background: #FEE2E2;
    color: #991B1B;
}

.feature-status {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 4px 10px;
    border-radius: 6px;
}

.feature-status.pending {
    background: #F5F5F7;
    color: #86868B;
}

.feature-status.planned {
    background: #DBEAFE;
    color: #1E40AF;
}

.feature-status.in-progress {
    background: #FEF3C7;
    color: #92400E;
}

.feature-status.completed {
    background: #D1FAE5;
    color: #065F46;
}

.feature-title {
    font-size: 18px;
    font-weight: 600;
    color: #000;
    margin: 0 0 6px 0;
}

.feature-description {
    font-size: 15px;
    color: #86868B;
    margin: 0;
    line-height: 1.5;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 16px;
    max-width: 500px;
    margin: 0 auto;
}

.empty-state p {
    font-size: 17px;
    color: #86868B;
    margin: 0;
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 36px;
    }

    .hero-description {
        font-size: 18px;
    }

    .submit-card {
        padding: 32px 24px;
    }

    .section-title {
        font-size: 32px;
    }

    .feature-card {
        flex-direction: column;
        gap: 16px;
    }

    .vote-section {
        flex-direction: row;
        justify-content: flex-start;
    }

    .filter-tabs {
        gap: 6px;
    }

    .filter-tab {
        padding: 8px 14px;
        font-size: 13px;
    }
}
</style>