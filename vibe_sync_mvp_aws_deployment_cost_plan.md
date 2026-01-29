# VibeSync MVP – Ultra Low Cost AWS Deployment Plan

**Target:** MVP stage, max ~20 users
**Goal:** Minimum cost, acceptable reliability, easy future upgrade

---

## Final Architecture (MVP)

* **Backend:** Node.js / Express running in Docker on a single EC2 instance
* **Database:** Free managed PostgreSQL provider (Neon / Supabase)
* **Frontend:** Static React build hosted on S3 + CloudFront
* **Reverse Proxy:** Nginx on EC2
* **SSL:** Free (ACM or Let’s Encrypt)

This avoids over-engineering and keeps the monthly bill tiny.

---

## 1. Backend Hosting (EC2)

### Instance Choice

* Instance type: `t3.micro`
* OS: Ubuntu 22.04
* Why:

  * Burstable CPU (perfect for low traffic)
  * Cheapest practical EC2 option
  * Enough for Docker + Node backend

### What Runs on EC2

* Docker
* Backend container only
* Nginx reverse proxy

**Do NOT run frontend or database here.**

### Approx Cost

* ₹700–900 / month

---

## 2. Database (Free PostgreSQL)

### Recommended Providers

**Option A – Neon (Recommended)**

* True PostgreSQL
* Serverless (auto-sleep when idle)
* Free tier ~0.5 GB
* Automatic backups

**Option B – Supabase**

* Managed PostgreSQL
* Free tier ~500 MB
* Includes dashboard & backups

### Why Free DB Is OK for MVP

* Very low traffic
* Small data volume
* Saves ~₹1,000+/month

### Environment Variable Example

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

### Important Limits

* Low connection count
* Possible cold start delay

**Mitigation:**

* Use small connection pool (2–5 connections)
* Accept cold start for MVP

---

## 3. Frontend Hosting (Zero Servers)

### Deployment

```bash
npm run build
aws s3 sync dist/ s3://your-frontend-bucket
```

### Setup

* S3 for static hosting
* CloudFront for CDN + HTTPS

### Benefits

* No EC2 needed
* Extremely cheap
* Fast global delivery

### Approx Cost

* ₹100–200 / month

---

## 4. Docker Strategy

### Keep It Simple

* 1 container: backend
* 1 container: nginx

### Avoid

* Frontend Docker container
* PostgreSQL Docker container

Fewer containers = less RAM = cheaper instance.

---

## 5. Logging (Cost Controlled)

### Strategy

* Application logs to stdout
* CloudWatch retention: **7 days**

Why:

* MVP issues appear quickly
* Old logs add cost, not value

---

## 6. Security (Free & Enough)

* SSH access via key only
* Security Groups:

  * Allow 80 / 443 publicly
  * Backend port not public
* Database accessible only via SSL

No WAF, no Shield, no NAT Gateway.

---

## 7. Optional: Stop Resources When Idle

If app is not 24×7 critical:

* Stop EC2 at night
* Keep DB serverless (Neon auto-sleeps)

Potential savings: **30–50%**

---

## Monthly Cost Breakdown (India Region)

| Component       | Approx Cost              |
| --------------- | ------------------------ |
| EC2 (t3.micro)  | ₹800                     |
| Free PostgreSQL | ₹0                       |
| S3 + CloudFront | ₹150                     |
| Logs & misc     | ₹100                     |
| **Total**       | **₹1,000–1,200 / month** |

---

## When to Upgrade

Move to paid RDS when:

* Users > 200
* Database > 5–10 GB
* Predictable latency needed
* Business becomes revenue-critical

Migration path:

```bash
pg_dump
pg_restore
```

No rewrite required.

---

## Final Recommendation

For an MVP with ~20 users:

> **EC2 (t3.micro) + Free PostgreSQL (Neon) + S3 + CloudFront**

This is the lowest-cost setup that still behaves like a real production system.

Upgrade only when usage forces you to — not before.
