/**
 * Analytics Instrumentation Hooks
 * 
 * Lightweight placeholder for future analytics integration.
 * NO-OP in production. Logs to console in development only.
 * No network calls, no data storage, no external SDKs.
 * 
 * Usage: import { trackEvent } from './utils/analytics'
 */

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track a user event (no-op in production, console log in dev)
 */
export function trackEvent(eventName: string, properties?: EventProperties): void {
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventName, properties || {});
  }
  // Production: no-op
}

/**
 * Track page view
 */
export function trackPageView(pageName: string): void {
  if (import.meta.env.DEV) {
    console.log('[Analytics] Page View:', pageName);
  }
  // Production: no-op
}

/**
 * Track premium unlock
 */
export function trackPremiumUnlock(analysisId: string): void {
  if (import.meta.env.DEV) {
    console.log('[Analytics] Premium Unlocked:', { analysis_id: analysisId });
  }
  // Production: no-op
}

/**
 * Track PDF download
 */
export function trackPdfDownload(analysisId: string): void {
  if (import.meta.env.DEV) {
    console.log('[Analytics] PDF Downloaded:', { analysis_id: analysisId });
  }
  // Production: no-op
}

/**
 * Track comparison view
 */
export function trackComparisonStarted(reportCount: number): void {
  if (import.meta.env.DEV) {
    console.log('[Analytics] Comparison Started:', { report_count: reportCount });
  }
  // Production: no-op
}