EMAIL BRANDING RULES Brand styling: Primary colour: Navy Accent colour: Teal
Background: White Text: Dark grey Font: System default (no custom fonts) Email
layout rules: Centered container Max width 600px Clear hierarchy No icons unless
functional No images unless absolutely necessary Text first design

REQUIRED SYSTEM EMAILS (MANDATORY) Each email below must be implemented as a
separate Resend template and triggered by the backend.

EMAIL 1: EMAIL VERIFICATION Trigger: User signs up From: no-reply@yieldpulse.ae
Subject: Verify your email address Content: Greeting using first name if
available Explain account creation Verification button Fallback plain link
Support contact line CTA: Verify Email

EMAIL 2: ACCOUNT CONFIRMED Trigger: Email verified successfully From:
no-reply@yieldpulse.ae Subject: Your YieldPulse account is ready Content:
Confirmation message What user can do next Link to dashboard CTA: Go to
Dashboard

EMAIL 3: PASSWORD RESET Trigger: User requests password reset From:
no-reply@yieldpulse.ae Subject: Reset your YieldPulse password Content: Security
focused copy Reset button Expiry notice Ignore if not requested CTA: Reset
Password

EMAIL 4: PREMIUM REPORT PURCHASE CONFIRMATION Trigger: Stripe payment successful
From: no-reply@yieldpulse.ae Subject: Premium report purchase confirmed Content:
Confirmation of payment Property reference What happens next Support contact
Trigger: Premium report generation completed From: no-reply@yieldpulse.ae
Subject: Your Premium Investment Report is ready Content: Clear confirmation
Property name What the report includes Link to view report CTA: View Premium
Report EMAIL 6: PAYMENT FAILED Trigger: Stripe payment failure From:
no-reply@yieldpulse.ae Subject: Payment failed – action required Content:
Neutral tone Payment did not go through No blame language Retry guidance CTA:
Retry Payment

EMAIL 7: SUPPORT CONTACT CONFIRMATION Trigger: User submits contact form From:
support@yieldpulse.ae Subject: We’ve received your message Content: Confirmation
Expected response time Reference number if available

5. OPTIONAL (PHASE 2 – NOT REQUIRED NOW) Do NOT implement unless requested
   later: Marketing emails Usage reminders Upsells Newsletters

6. TECHNICAL REQUIREMENTS All emails must be triggered via backend events, not
   frontend. Each email template must accept variables: first_name property_name
   report_id dashboard_url verification_url reset_url All URLs must be absolute
   and environment aware. No inline business logic inside templates.

7. TESTING REQUIREMENTS Before sign off: Test each email manually Test mobile
   and desktop Test dark mode Test resend delivery logs Confirm correct sender
   and subject Confirm no emails go to spam

8. FINAL ACCEPTANCE CRITERIA This is complete when: All seven emails exist in
   Resend All triggers are wired Brand styling consistent Copy professional No
   placeholder text Emails received within seconds Sample and paid flows both
   covered
