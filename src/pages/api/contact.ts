import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const CONTACT_TO_EMAIL = import.meta.env.CONTACT_TO_EMAIL || "ignacioamat@ignathedev.com";
const CONTACT_FROM_EMAIL = import.meta.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
const MIN_FORM_TIME_MS = 3500;
const MAX_MESSAGE_LENGTH = 500;

type ContactLang = "es" | "en";

const escapeHtml = (input: string) =>
  input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getLang = (lang: string | null): ContactLang => (lang === "es" ? "es" : "en");

const sanitizeReason = (value: string) => value.replace(/\s+/g, " ").trim().slice(0, 200);

const COPY = {
  es: {
    successTitle: "Mensaje enviado",
    successMessage: "Mensaje enviado. Te responderé en menos de 24 horas.",
    doneTitle: "Listo",
    doneMessage: "Mensaje enviado correctamente.",
    errorTitle: "Error",
    sendFailed: "No se pudo enviar el mensaje.",
    configReason: "El servicio de correo no está configurado en el servidor.",
    antiSpamReason: "Verificación anti-spam fallida. Inténtalo de nuevo.",
    requiredReason: "Completa todos los campos obligatorios.",
    invalidReason: "Revisa nombre, email y mensaje (entre 10 y 500 caracteres).",
    providerPrefix: "Motivo:",
    providerUnknown: "Error del proveedor de email.",
    unexpectedPrefix: "Detalle:",
    unexpectedReason: "Error inesperado en el servidor.",
  },
  en: {
    successTitle: "Message sent",
    successMessage: "Message sent. I will reply in less than 24 hours.",
    doneTitle: "Done",
    doneMessage: "Message sent successfully.",
    errorTitle: "Error",
    sendFailed: "Failed to send message.",
    configReason: "Email service is not configured on the server.",
    antiSpamReason: "Anti-spam verification failed. Please try again.",
    requiredReason: "Please complete all required fields.",
    invalidReason: "Please review name, email, and message (between 10 and 500 characters).",
    providerPrefix: "Reason:",
    providerUnknown: "Email provider returned an unknown error.",
    unexpectedPrefix: "Details:",
    unexpectedReason: "Unexpected server error.",
  },
} as const;

const jsonResponse = (status: number, payload: Record<string, unknown>) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

export const POST: APIRoute = async ({ request }) => {
  let lang: ContactLang = "en";

  try {
    const formData = await request.formData();
    lang = getLang((formData.get("lang") as string | null) ?? null);
    const copy = COPY[lang];

    if (!resend) {
      return jsonResponse(500, {
        success: false,
        error: copy.sendFailed,
        reason: copy.configReason,
        title: copy.errorTitle,
      });
    }

    const spamTrap = (formData.get("website") as string | null)?.trim();
    const formStartedAt = Number(formData.get("form_started_at") as string | null);

    if (spamTrap) {
      return jsonResponse(200, {
        success: true,
        message: copy.doneMessage,
        title: copy.doneTitle,
      });
    }

    if (!Number.isFinite(formStartedAt) || Date.now() - formStartedAt < MIN_FORM_TIME_MS) {
      return jsonResponse(400, {
        success: false,
        error: copy.sendFailed,
        reason: copy.antiSpamReason,
        title: copy.errorTitle,
      });
    }

    const name = ((formData.get('name') as string | null) ?? "").trim();
    const email = ((formData.get('email') as string | null) ?? "").trim();
    const company = ((formData.get('company') as string | null) ?? "").trim();
    const projectType = ((formData.get('project_type') as string | null) ?? "").trim();
    const timeline = ((formData.get('timeline') as string | null) ?? "").trim();
    const budget = ((formData.get('budget') as string | null) ?? "").trim();
    const message = ((formData.get('message') as string | null) ?? "").trim();
    const consent = formData.get("consent");

    if (!name || !email || !projectType || !timeline || !message || !consent) {
      return jsonResponse(400, {
        success: false,
        error: copy.sendFailed,
        reason: copy.requiredReason,
        title: copy.errorTitle,
      });
    }

    if (!isValidEmail(email) || name.length < 2 || message.length < 10 || message.length > MAX_MESSAGE_LENGTH) {
      return jsonResponse(400, {
        success: false,
        error: copy.sendFailed,
        reason: copy.invalidReason,
        title: copy.errorTitle,
      });
    }

    const sendResult = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `[Portfolio] ${projectType} - ${name}`,
      html: `
        <h2>New portfolio lead</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company || "Not provided")}</p>
        <p><strong>Lead type:</strong> ${escapeHtml(projectType)}</p>
        <p><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>
        <p><strong>Budget / salary:</strong> ${escapeHtml(budget || "Not provided")}</p>
        <p><strong>Language:</strong> ${escapeHtml(lang || "unknown")}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
      `,
    });

    if (sendResult.error) {
      const providerMessage =
        typeof sendResult.error.message === "string" && sendResult.error.message.trim().length > 0
          ? sanitizeReason(sendResult.error.message)
          : copy.providerUnknown;

      return jsonResponse(502, {
        success: false,
        error: copy.sendFailed,
        reason: `${copy.providerPrefix} ${providerMessage}`,
        title: copy.errorTitle,
      });
    }

    return jsonResponse(200, {
      success: true,
      message: copy.successMessage,
      title: copy.successTitle,
    });
  } catch (error) {
    console.error('Contact API exception:', error);

    const copy = COPY[lang];
    const details = error instanceof Error && error.message ? sanitizeReason(error.message) : copy.unexpectedReason;
    return jsonResponse(500, {
      success: false,
      error: copy.sendFailed,
      reason: `${copy.unexpectedPrefix} ${details}`,
      title: copy.errorTitle,
    });
  }
};
