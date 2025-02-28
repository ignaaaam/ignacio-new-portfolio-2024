import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Get API key from environment variables
const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;

// Log API key status (not the actual key) for debugging
console.log(`Resend API Key status: ${RESEND_API_KEY ? 'Provided' : 'Missing'}`);

// Initialize Resend only if we have an API key
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if Resend is properly initialized
    if (!resend) {
      console.error('Resend API is not initialized due to missing API key');
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

    console.log(`Attempting to send email for ${name} (${email})`);

    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Update with your verified domain
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
      console.error('Failed to send email:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to send message',
          title: 'Error'
        }),
        { status: 400 }
      );
    }

    console.log('Email sent successfully');
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Message sent successfully!',
        title: 'Success'
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Exception in contact API:', error);
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