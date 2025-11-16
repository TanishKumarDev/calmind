// ======================================================================
// safeJson Utility
//
// Purpose:
// Safely parses AI model responses that may include invalid JSON,
// extra formatting, or code fences like ```json. Prevents app crashes.
//
// Usage:
// const data = safeJson(aiText);
// Returns: parsed object OR null if invalid
// ======================================================================

export function safeJson(text: string): any {
  if (!text || typeof text !== "string") return null;

  try {
    // Remove code fences (```json or ```)
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return null;
  }
}
