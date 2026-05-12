# Metrics

## North Star Metric

### Monthly Qualified Consultations Generated

Specifically:

```txt
# of startups that:
completed an audit
AND booked a Credex consultation
```

This is the most important metric because BurnRate is fundamentally a lead-generation and qualification tool, not a standalone SaaS product.

Raw traffic or audit volume alone does not create value for Credex. The product only becomes economically meaningful when it consistently produces high-intent startups willing to discuss infrastructure spend optimization.

A completed audit without downstream commercial intent is effectively just usage vanity.

---

# Input Metrics

## 1. Audit Completion Rate

```txt
completed audits / landing page visitors
```

This measures whether:

* the positioning is compelling
* the onboarding friction is low
* the form UX is understandable

If users abandon before completing an audit, nothing downstream matters.

Target:

```txt
>25%
```

---

## 2. Consultation Booking Rate

```txt
consultation bookings / completed audits
```

This measures whether the audit output is valuable enough to create commercial intent.

A strong audit should make users think:

```txt
“We’re probably overspending and should talk to someone.”
```

Target:

```txt
8–12%
```

---

## 3. Average Savings Identified Per Audit

```txt
total savings identified / completed audits
```

This is a proxy for perceived value.

If audits consistently identify meaningful savings, users are more likely to:

* trust the recommendations
* share the tool
* book consultations

Target:

```txt
>$300/month
```

average identified savings.

---

# What I Would Instrument First

The first analytics events I would add:

```txt
landing_page_view
audit_started
audit_completed
email_submitted
consultation_cta_clicked
```

Additionally:

* time-to-complete audit
* drop-off per form field
* most common tools submitted
* average identified savings
* audit completion device split

These would help identify whether the problem is:

* acquisition quality
* UX friction
* weak recommendations
* weak monetization conversion

---

# Pivot Threshold

I would seriously reconsider the product direction if:

```txt
consultation booking rate < 3%
```

after at least:

```txt
1,000 completed audits
```

That would likely indicate one of two things:

* startups do not perceive AI spend optimization as painful enough
* the audit results are not compelling enough to create action

Similarly, if average identified savings remained consistently low:

```txt
<$100/month average savings
```

the product would struggle to justify Credex’s involvement economically.

At that point, I would likely pivot BurnRate into either:

* a broader AI infrastructure analytics product
  OR
* a lightweight internal lead qualification tool rather than a public acquisition product.