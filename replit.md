# Overview

This Next.js web application is for "ديار جدة" (Deyar Jeddah), a Saudi Arabian construction company. It provides a comprehensive business website with advanced portfolio management, automatic watermarking, AI-powered competitor analysis, and robust content management. The project aims to enhance the company's online presence, streamline content updates, improve SEO, and boost user engagement, positioning it as a leading online platform in the Saudi Arabian construction sector.

# User Preferences

Preferred communication style: Simple, everyday language.
Image storage: Cloudinary preferred over local storage for better performance, automatic optimization, and SEO benefits.

# System Architecture

## Frontend
- **Framework**: Next.js 15.5.0 (App Router, React 18).
- **Styling**: Tailwind CSS, Shadcn/UI, Radix UI, Noto Sans Arabic typography.
- **Animations**: Framer Motion.
- **Image Optimization**: Next.js Image component (WebP/AVIF).
- **UI/UX**: Responsive, mobile-first, WCAG 2.1 AA accessibility compliant design.
- **Internationalization**: Next-intl for multi-language support (Arabic default, English).

## Backend
- **API Routes**: Next.js App Router API routes.
- **Authentication**: JWT-based admin authentication.
- **File Upload**: Multi-format uploads with Cloudinary integration for images and videos.
- **Content Management**: RESTful API for project and content CRUD operations.

## Database
- **ORM**: Prisma ORM.
- **Schema**: Models for Projects, Articles, Admin Users, and analytics.

## Content Management System (CMS)
- **Features**: Advanced project showcase, blog/articles, dynamic sitemap, media management, admin dashboard.
- **Advanced Portfolio Exhibition System**: Supports 10 unified categories with automatic watermarking via Cloudinary and media optimization.
- **FAQ Management System**: Admin CRUD interface with SEO fields, AI duplicate detection, analytics, dynamic sitemap, rich FAQ schema, and categorization.
- **Category Unification System**: Standardized 10 main categories across all content types with automatic normalization.

## SEO & Performance
- **SEO**: Automated sitemap/robots.txt, structured data, canonical URLs, hreflang, Google Business Profile integration, IndexNow API.
- **AI-Powered SEO Agent**: Utilizes Groq AI (Llama 3.3 70B) for content analysis, keyword intelligence, article writing, project descriptions, meta tag generation, and competitor analysis within the admin dashboard.
- **AI Article Agent**: Generates SEO-optimized articles with automated image selection (Google Custom Search API) and AI-generated alt text.
- **Automated Indexing System**: Notifies search engines (IndexNow, Bing Webmaster API) about content changes.
- **Enhanced Portfolio Rich Media SEO**: Implements multi-image OpenGraph, advanced VideoObject, ImageObject, and Review schemas.
- **Performance Optimizations**: CSS (cssnano, critical CSS), JavaScript (ES2022), build (SWC minification), image (responsive, lazy loading, AVIF/WebP), Core Web Vitals, PWA capabilities.
- **AI-Assisted Content Creation**: Real-time AI suggestions during project submission for keywords, titles, descriptions, and meta tags.
- **Intelligent Competitor Analysis System**: Automated competitor analysis using GROQ AI (Llama 3.3 70B) for market insights and content strategy.
- **Dynamic Routing & Caching**: Configured for immediate accessibility of new content with cache revalidation.
- **Security**: Secure admin login, Zod schemas for input validation, rate limiting, and DOMPurify for HTML rendering.
- **Intelligent Content Automation**: Complete automation system for generating SEO-optimized articles and FAQs using Groq AI, with scheduled generation and dashboard control.

# External Dependencies

## Core Technologies
- **Next.js**: Full-stack React framework.
- **Prisma**: Database ORM.
- **Tailwind CSS**: Utility-first CSS framework.
- **TypeScript**: For type safety.

## UI/UX Libraries
- **Radix UI**: Headless UI components.
- **Framer Motion**: Animation library.
- **Lucide React**: Icon set.
- **Swiper**: Touch-enabled carousel.
- **next-intl**: Internationalization.

## Database & Storage
- **PostgreSQL**: Primary database (Neon-backed).
- **Cloudinary**: Unified cloud storage for all images and videos, providing automatic optimization, CDN delivery, and automatic watermarking.

## Authentication & Security
- **bcryptjs**: Password hashing.
- **jsonwebtoken**: JWT token management.
- **DOMPurify**: HTML sanitization.
- **Zod**: Runtime type validation.

## Analytics & AI
- **Google Analytics 4**: Site analytics and Web Vitals tracking.
- **Groq AI**: Llama 3.3 70B model for SEO analysis, content generation, and competitor analysis.
- **Google Custom Search API**: Image search for automated article image selection.