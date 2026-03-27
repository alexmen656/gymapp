<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-content">
                <div class="footer-column">
                    <div class="footer-logo">
                        <img :src="'/assets/' + config.appIcon" :alt="'Logo of ' + config.appName">
                    </div>
                </div>
                <div class="footer-column">
                    <h3 class="footer-title">{{ config.appName }}</h3>
                    <ul class="footer-links">
                        <li v-for="link in config.footer.section1.links" :key="link.name"><a :href="link.href"
                                class="footer-link">{{
                                    link.name
                                }}</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3 class="footer-title">Resources</h3>
                    <ul class="footer-links">
                        <li><router-link to="/support" class="footer-link">Support</router-link></li>
                        <li><router-link to="/blog" class="footer-link">Blog</router-link></li>
                        <li><router-link to="/terms-of-use" class="footer-link">Terms of use</router-link></li>
                        <li><router-link to="/privacy-policy" class="footer-link">Privacy policy</router-link></li>
                        <li><a href="#" class="footer-link">Media Kit</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3 class="footer-title">{{ config.footer.section3.title }}</h3>
                    <ul class="footer-links">
                        <li v-for="link in config.footer.section3.links" :key="link.name"><a :href="link.href"
                                class="footer-link">{{
                                    link.name
                                }}</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3 class="footer-title">Follow us</h3>
                    <div class="social-links">
                        <a v-for="social in socialIconLinks" :key="social.platform + social.link" :href="social.link"
                            class="social-link"
                            :aria-label="social.platform ? social.platform[0]?.toUpperCase() + social.platform.slice(1)?.toLowerCase() : ''">
                            <svg :viewBox="SOCIAL_ICON_VIEWBOX" width="20" height="20" fill="currentColor" role="img">
                                <path :d="social.icon.path" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div class="footer-divider"></div>
            <div class="footer-bottom">
                <p class="footer-copyright">© {{ year }} {{ config.copyrightCompany }}. All rights reserved.</p>
                <!--<p class="footer-trademark">All trademarks are the property of their respective owners.</p>-->
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { SimpleIcon } from 'simple-icons'
import { getSocialIcon, SOCIAL_ICON_VIEWBOX } from './socialIconRegistry'

type FooterSocialLink = {
    platform: string
    link: string
    name?: string
}

type FooterSocialLinkWithIcon = FooterSocialLink & { icon: SimpleIcon }

const config: any = inject('config')
const year = new Date().getFullYear()

const socialIconLinks = computed<FooterSocialLinkWithIcon[]>(() => {
    const links: FooterSocialLink[] = config?.socialLinks ?? []
    return links
        .map((link) => ({ ...link, icon: getSocialIcon(link.platform) }))
        .filter((link): link is FooterSocialLinkWithIcon => Boolean(link.icon))
})
</script>

<style scoped>
.footer {
    background: #1d1d1d;
    color: #f5f5f5;
    padding: 80px 0 40px 0;
}

.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 48px;
    margin-bottom: 48px;
}

.footer-column {
    display: flex;
    flex-direction: column;
}

.footer-logo {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 24px;
    overflow: hidden;
}

.footer-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.footer-title {
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 16px 0;
    color: #fff;
    text-transform: capitalize;
}

.footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.footer-link {
    color: #ccc;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s;
}

.footer-link:hover {
    color: #fff;
}

.social-links {
    display: flex;
    gap: 10px;
    /*20*/
}

.social-link {
    color: #ccc;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.social-link:hover {
    color: #fff;
}

.footer-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin-bottom: 32px;
}

.footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
}

.footer-copyright,
.footer-trademark {
    font-size: 13px;
    color: #bbb;
    margin: 0;
}

@media (max-width: 768px) {
    .footer-content {
        grid-template-columns: repeat(2, 1fr);
        gap: 32px;
    }

    .footer-bottom {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
