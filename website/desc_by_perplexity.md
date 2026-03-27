Pocketz - Digital Loyalty Card Wallet App
Core Concept:
Pocketz is a mobile loyalty card management application that allows users to digitally store, organize, and access all their physical loyalty cards, membership cards, and reward cards in one place. The app eliminates the need to carry physical cards by scanning barcodes and QR codes, storing them locally on the device.

Key Features:

Card Management:

Unlimited card storage capacity

Barcode and QR code scanning to add cards instantly

Support for multiple barcode formats: Code 128, Code 39, EAN-13, QR codes, and specialized formats like GS1 DataBar

Manual card entry option for cards without barcodes

Card organization and easy browsing interface

Search functionality to quickly find specific cards

Display & Scanning:

Bright screen mode that maximizes display brightness for optimal barcode scanning at checkout

High-contrast barcode display optimized for retail scanners

Full-screen barcode view for easy scanning by cashiers

Support for both horizontal and vertical barcode orientations

Apple Ecosystem Integration:

Apple Wallet integration for seamless iOS experience

iCloud sync across iPhone, iPad, and Apple Watch (no account required)

Native iOS design following Apple Human Interface Guidelines

Universal Links support via custom pocketz:// URL scheme

Privacy & Security:

Zero data collection - no analytics, tracking, or telemetry

Local-only storage on device

No user accounts or registration required

No cloud uploads of card data (except optional iCloud sync controlled by user)

GDPR compliant by design through data minimization

Client-side encryption for card sharing feature

Sharing Capabilities:

QR code-based card sharing between devices

Fragment-based encryption for secure sharing URLs (share.pocketz.app)

Encryption happens client-side, ensuring server never sees unencrypted card data

Cross-platform sharing (iOS to Android and vice versa)

Deep linking to automatically add shared cards if Pocketz is installed

Technical Architecture:

Built with Capacitor framework bridging Vue.js web code with native iOS (Swift)

Backend API at api.pocketz.app for logo fetching and card metadata

Nginx-based server infrastructure

PostgreSQL database for backend operations

Works fully offline after initial card setup

Design Philosophy:

Minimalist, clean interface with focus on simplicity

"No shit nobody needs" approach - only essential features

Bold red (#dd001d) brand color with white background

Symbol-based app icon design

Zero feature creep - focused on core use case

Use Cases:

Grocery store loyalty cards (Kroger, Safeway, etc.)

Pharmacy rewards (CVS, Walgreens)

Coffee shop punch cards (Starbucks, local cafes)

Gym memberships

Library cards

Any business with barcode/QR code loyalty programs

Market Position:

Alternative to Stocard (now owned by Klarna)

Competes with Apple Wallet but offers more flexibility

Free forever with no ads or premium tiers

Privacy-focused alternative to data-collecting competitors

Target Audience:

Users who want to declutter their physical wallet

Privacy-conscious consumers who avoid account creation

iPhone users who shop at multiple retailers

People frustrated with forgetting loyalty cards at home

Development Context:
Originally created as a 10-hour hackathon weekend project, then expanded with additional features. Built for iOS App Store with focus on German-speaking markets (DACH region) and US market. Domain: pocketz.app

This app solves the common problem of bulky wallets filled with rarely-used loyalty cards while maintaining user privacy and offering a seamless, account-free experience.
