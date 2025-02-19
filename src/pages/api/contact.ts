import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const projectType = formData.get('project_type') as string;
    const budget = formData.get('budget') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !projectType || !budget || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'All fields are required',
          title: 'Error'
        }),
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: 'Your Company <onboarding@resend.dev>', // Update with your verified domain
      to: 'ignasiamat10@gmail.com', // Update with your email
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Budget Range:</strong> ${budget}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to send message',
          title: 'Error'
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Message sent successfully!',
        title: 'Success'
      }),
      { status: 200 }
    );
  } catch (error) {
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