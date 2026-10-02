# Backend Development Guide

## 1. Overview
The backend is built using NestJS and follows a modular architecture.

## 2. Modules
- AuthModule: Handles authentication and token rotation.
- UsersModule: Manages user profiles and roles.
- ProgramsModule: Manages courses and steps.
- PaymentsModule: Handles Stripe integrations.

## 3. Core Principles
- All business logic lives in services.
- Use Prisma for database access.
- Controllers only handle HTTP routing and DTO validation.
