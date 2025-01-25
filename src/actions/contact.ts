import { ActionError, defineAction } from 'astro:actions';
import { Resend } from 'resend';
import { z } from 'astro:schema';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  send: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email address'),
      project_type: z.enum(['landing', 'ecommerce', 'web-app', 'other'], {
        errorMap: () => ({ message: 'Please select a valid project type' }),
      }),
      budget: z.enum(['500-1000', '1000-2500', '2500-5000', '5000+'], {
        errorMap: () => ({ message: 'Please select a valid budget range' }),
      }),
      message: z.string().min(10, 'Message must be at least 10 characters').max(500),
    }),
    handler: async ({ name, email, project_type, budget, message }) => {
      try {
        const { error } = await resend.emails.send({
          from: 'Contact Form <onboarding@resend.dev>',
          to: ['ignacioamat@ignathedev.com'],
          subject: `New Contact Form Submission from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Project Type:</strong> ${project_type}</p>
            <p><strong>Budget:</strong> ${budget}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        });

        if (error) {
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: error.message,
          });
        }

        return {
          success: true,
          message: 'Email sent successfully'
        };
      } catch (error) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to send email',
        });
      }
    },
  }),
};