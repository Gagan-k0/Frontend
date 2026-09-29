# WhatBoutMe LMS — Technical Requirements Document (TRD)

> **Version:** 1.0  
> **Date:** September 29, 2026  
> **Source Documents:** PRD v1.2, ARCHITECTURE v1.1, IMPLEMENTATION PLAN

---

## 1. Purpose & Scope

The Technical Requirements Document (TRD) bridges the gap between business requirements (PRD) and system design (Architecture). It defines the strict technical constraints, logical flows, and rules the development team must follow during the Implementation Plan to ensure the system behaves exactly as the client requested.

---

## 2. Technical Logic & Core Engines

### 2.1 The Progression Engine (Step Unlock Logic)

**PRD Requirement:** §9.7 "Step N+1 unlocks only when Step N's lessons are complete and its quiz is passed."
**Architecture Mapping:** Handled by NestJS `StepsModule` and `QuizzesModule`.
**Technical Rule:** 
The backend must expose a strict `checkStepUnlock(enrolmentId, stepId)` method. It is evaluated:
1. When a learner submits a quiz attempt.
2. When a learner marks a lesson as complete.
3. When an admin overrides a step's lock status (`BatchStepOverride`).

*Logic Flow:*
```typescript
if (admin.hasManualOverride(stepId)) return true;
if (batch.hasDateLock(stepId) && currentDate < lockDate) return false;
const previousStep = getPreviousStep(stepId);
if (!previousStep) return true; // Step 1 is always unlocked (if agreement signed)
const lessonsComplete = checkAllLessonsViewed(previousStep.id);
const quizPassed = checkQuizPassed(previousStep.quiz.id);
return lessonsComplete && quizPassed;
```

### 2.2 Content Protection & Media Delivery (DRM)

**PRD Requirement:** §11 "Content is view-only, no downloading, moving watermark on videos."
**Architecture Mapping:** Cloudflare R2 (PDF/Audio) + Mux (Video).
**Technical Rule:**
The Next.js frontend NEVER receives a direct URL to a file. 
1. **Request:** Frontend calls `GET /api/lessons/:id/content`
2. **Validation:** Backend verifies the JWT token, confirms the user is enrolled, and checks that `checkStepUnlock(stepId)` is true.
3. **Generation:** 
   - For Video: Backend signs a Mux JWT with the user's email embedded as a watermark payload. Expiry: 15 mins.
   - For PDF/Audio: Backend generates an AWS S3 `GetObject` presigned URL targeting Cloudflare R2. Expiry: 15 mins.
4. **Delivery:** Frontend receives the temporary URL and feeds it directly into the Mux Player or `react-pdf` canvas renderer.

### 2.3 Registration & Payment Pipeline

**PRD Requirement:** §9.3 "Stripe checkout, automatic invoice, agreement signing required before Step 1."
**Architecture Mapping:** `PaymentsModule`, `AgreementsModule`, Stripe Webhooks.
**Technical Rule:**
The onboarding state machine is strictly enforced by the backend:
`PENDING_PAYMENT` → `PENDING_AGREEMENT` → `ACTIVE`

1. **Stripe:** Use Stripe Checkout Sessions. The `metadata` field MUST contain `userId`, `programId`, `batchId`, and `couponId` to survive the webhook transition.
2. **Idempotency:** The `POST /webhooks/stripe` endpoint must catch `checkout.session.completed`. If Stripe sends this 3 times, the DB must process it exactly once using a unique constraint on `StripeTransaction.id`.
3. **Invoice Generation:** Dispatched to BullMQ immediately upon successful webhook.
4. **Agreement Barrier:** `GET /api/portal/steps` must return `403 Forbidden` with code `AGREEMENT_REQUIRED` if `enrolment.status === 'PENDING_AGREEMENT'`.

### 2.4 Synchronous Operations (Zoom & Calendar)

**PRD Requirement:** §9.10 "Schedule a session, auto-create Zoom link, sync to Outlook."
**Architecture Mapping:** `SessionsModule`, `ZoomProvider`, `OutlookProvider`.
**Technical Rule:**
When a session is created, multiple 3rd-party network calls occur. This must be handled transactionally to prevent orphaned data.
1. **Flow:** Create local DB `Session` (PENDING) → Call Zoom API for meeting URL → Call Microsoft Graph for Outlook event → Update DB `Session` (ACTIVE).
2. **Failure Handling:** If Microsoft Graph fails, the Zoom meeting must be deleted via API (rollback), and the DB record marked `FAILED_SYNC`.
3. **Booking Clashes:** When a learner views `GET /api/sessions/availability`, the backend queries Roweena's Outlook `findMeetingTimes` endpoint live. Cached for max 5 minutes.

### 2.5 Async Background Jobs & Webhooks

**PRD Requirement:** §9.11 "Pull attendance automatically", §12 "Generate certificates", §17 "Emails".
**Architecture Mapping:** BullMQ + Upstash Redis.
**Technical Rule:**
No heavy processing occurs during an HTTP request.
- **Attendance:** A cron job runs every 10 mins. It checks for `Sessions` where `endTime < NOW() - 10 mins` and `attendancePulled == false`. It queries Zoom `GET /metrics/meetings/{id}/participants`, maps emails, updates the DB, and flags `attendancePulled = true`.
- **Certificates:** Admin clicks "Approve". API returns `202 Accepted`. BullMQ worker `certificate-gen` generates PDF, uploads to R2, updates DB, sends email.

---

## 3. Data & API Constraints

### 3.1 Role & Scope Enforcement (Multi-tenancy logic)

**PRD Requirement:** §5 "Manager sees only their assigned batches."
**Technical Rule:**
The NestJS `@UseGuards(BatchAccessGuard)` intercepts every request containing a `batchId` or `enrolmentId`.
```typescript
// Inside BatchAccessGuard
const user = request.user;
if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return true;
if (user.role === 'MANAGER') {
    const isAssigned = await db.batch.findFirst({
        where: { id: req.batchId, managerId: user.id }
    });
    if (!isAssigned) throw new ForbiddenException();
    return true;
}
```

### 3.2 Timezone Normalization

**PRD Requirement:** §12 "Store times in UTC, show in user's timezone."
**Technical Rule:**
- **Database:** PostgreSQL `TIMESTAMP WITH TIME ZONE` strictly used. All writes use `new Date().toISOString()`.
- **Frontend (Next.js):** Uses `Intl.DateTimeFormat` configured with the user's saved timezone string (e.g., `Asia/Dubai`).
- **Emails/Cron:** BullMQ scheduled jobs must read the target user's timezone from the DB before rendering time strings in email templates.

### 3.3 Concurrency & Race Conditions

**PRD Requirement:** §21 RAID "Prevent concurrent quiz submissions."
**Technical Rule:**
- **Quizzes:** `POST /api/quizzes/:id/submit` must wrap grading and state-saving in a Prisma `$transaction`. A unique index on `Attempt(quizId, enrolmentId, status)` ensures a learner cannot have two "in-progress" attempts at once.
- **Waitlist:** Converting a waitlist seat to an active enrolment uses PostgreSQL row-level locking (`SELECT FOR UPDATE`) on the `Batch` capacity counter to prevent overbooking.

---

## 4. Cross-Document Traceability Matrix

This table proves how a single feature connects across the entire project lifecycle.

| Feature Flow | PRD (The "What") | Architecture (The "How") | Implementation Plan (The "When") | TRD (The "Logic") |
|--------------|------------------|--------------------------|----------------------------------|-------------------|
| **E-Signature** | §9.4 Agreement signing blocks Step 1. | `AgreementsModule`, R2 Storage, `Enrolment` schema. | Phase 1 (Sprint 3-4) | Enrolment state machine barrier. Base64 canvas → PDF → R2 upload. |
| **Quizzes** | §9.9.1 Quizzes have pass marks & retries. | `QuizzesModule`, `Attempt` model. | Phase 1 (Sprint 5-6) | Prisma transaction for grading. DB constraints block duplicate attempts. |
| **Zoom Sync** | §9.10 Auto-create meetings, pull attendance. | `ZoomProvider`, BullMQ cron. | Phase 2 (Sprint 9-10) | Sync failure rollback logic. Background task scraping 10 mins post-meeting. |
| **Chat** | §9.14 Private 1:1 chat, unread alerts. | WebSockets (Socket.IO), Redis adapter ready. | Phase 3 (Sprint 15-16) | Authenticated WebSocket handshake. Fallback REST endpoints if WS drops. |
| **Certificates** | §9.13 Issued on completion. | PDF generation worker, `Certificate` schema. | Phase 2 (Sprint 13-14) | Aggregation query checks 6 different completion flags before allowing admin approval. |

---

## 5. Non-Functional Technical Rules

1. **API Rate Limiting:** Apply NestJS `@Throttle()` guards strictly as defined in ARCH §21 (e.g., Auth endpoints: 5/min, Webhooks: 100/min).
2. **Database Pooling:** The Next.js frontend MUST NOT connect to Neon directly. All DB traffic funnels through the NestJS API utilizing PgBouncer (connection pool).
3. **Error Masking:** The `HttpExceptionFilter` must catch all 500 errors. Internal stack traces or DB constraints (e.g., Prisma `P2002`) MUST NOT be leaked to the frontend. Return generic `{"error": "Internal Server Error", "code": "E_INTERNAL"}`.
4. **Pagination:** Any `GET` endpoint returning lists (Users, Payments, Logs) must enforce a maximum `limit` of 100 to prevent DOS vector via massive table scans.
