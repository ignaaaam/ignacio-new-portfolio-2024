import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const CONTACT_TO_EMAIL = import.meta.env.CONTACT_TO_EMAIL || "ignacioamat@ignathedev.com";
const CONTACT_FROM_EMAIL = import.meta.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
const MIN_FORM_TIME_MS = 3500;

const escapeHtml = (input: string) =>
  input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isSpanish = (lang: string | null) => lang === "es";

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!resend) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email service configuration error',
          title: 'Server Error'
        }),
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const lang = (formData.get("lang") as string | null) ?? null;
    const spamTrap = (formData.get("website") as string | null)?.trim();
    const formStartedAt = Number(formData.get("form_started_at") as string | null);

    if (spamTrap) {
      return new Response(
        JSON.stringify({
          success: true,
          message: isSpanish(lang) ? "Mensaje enviado correctamente." : "Message sent successfully.",
          title: isSpanish(lang) ? "Listo" : "Done"
        }),
        { status: 200 }
      );
    }

    if (!Number.isFinite(formStartedAt) || Date.now() - formStartedAt < MIN_FORM_TIME_MS) {
      return new Response(
        JSON.stringify({
          success: false,
          error: isSpanish(lang) ? "Verificación anti-spam fallida. Inténtalo de nuevo." : "Anti-spam verification failed. Please try again.",
          title: isSpanish(lang) ? "Error" : "Error"
        }),
        { status: 400 }
      );
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
      return new Response(
        JSON.stringify({
          success: false,
          error: isSpanish(lang) ? 'Completa todos los campos obligatorios.' : 'Please complete all required fields.',
          title: isSpanish(lang) ? 'Error' : 'Error'
        }),
        { status: 400 }
      );
    }

    if (!isValidEmail(email) || name.length < 2 || message.length < 10 || message.length > 2000) {
      return new Response(
        JSON.stringify({
          success: false,
          error: isSpanish(lang) ? 'Revisa los campos introducidos e inténtalo de nuevo.' : 'Please review the submitted fields and try again.',
          title: isSpanish(lang) ? 'Error' : 'Error'
        }),
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
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

    if (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: isSpanish(lang) ? 'No se pudo enviar el mensaje.' : 'Failed to send message.',
          title: isSpanish(lang) ? 'Error' : 'Error'
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: isSpanish(lang)
          ? 'Mensaje enviado. Te responderé en menos de 24 horas.'
          : 'Message sent. I will reply in less than 24 hours.',
        title: isSpanish(lang) ? 'Mensaje enviado' : 'Message sent'
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API exception:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Something went wrong',
        title: 'Error'
      }),
      { status: 500 }
    );
  }
};
