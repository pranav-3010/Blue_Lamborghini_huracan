import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from the shared env file
config({ path: resolve('/vercel/share/.env.project') });

// Create a transporter using Gmail
let transporter: any;

try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} catch (error) {
  console.error('Failed to create transporter:', error);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, inquiryType, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !inquiryType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email content for user confirmation
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; background: #0d0d0d; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background: #141414; padding: 30px; border: 1px solid rgba(0, 136, 255, 0.3); border-radius: 8px;">
          <h1 style="color: #0088ff; text-align: center; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 30px;">
            Inquiry Received
          </h1>
          
          <p style="color: #ffffff; font-size: 14px; margin-bottom: 20px;">
            Thank you for your inquiry regarding the Blue Lamborghini Huracán. We have received your submission and will process it shortly.
          </p>

          <div style="background: #0d0d0d; padding: 20px; border-radius: 5px; border-left: 3px solid #0088ff; margin-bottom: 20px;">
            <h2 style="color: #0088ff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">
              Your Submission Details
            </h2>
            
            <p style="color: #cccccc; font-size: 13px; margin: 8px 0;">
              <strong style="color: #ffffff;">Full Name:</strong> ${name}
            </p>
            <p style="color: #cccccc; font-size: 13px; margin: 8px 0;">
              <strong style="color: #ffffff;">Email:</strong> ${email}
            </p>
            <p style="color: #cccccc; font-size: 13px; margin: 8px 0;">
              <strong style="color: #ffffff;">Contact Number:</strong> ${phone}
            </p>
            <p style="color: #cccccc; font-size: 13px; margin: 8px 0;">
              <strong style="color: #ffffff;">Inquiry Type:</strong> ${inquiryType}
            </p>
            ${message ? `
              <p style="color: #cccccc; font-size: 13px; margin: 8px 0;">
                <strong style="color: #ffffff;">Requirements:</strong> ${message}
              </p>
            ` : ''}
          </div>

          <p style="color: #999999; font-size: 12px; text-align: center; margin-top: 30px;">
            An agent from our Bologna headquarters will contact you within 24 hours.
          </p>
          
          <p style="color: #666666; font-size: 11px; text-align: center; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px;">
            © 2024 Lamborghini S.P.A. All Rights Reserved.
          </p>
        </div>
      </div>
    `;

    // Email content for admin notification
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>New Inquiry Submission</h2>
        
        <p><strong>Full Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contact Number:</strong> ${phone}</p>
        <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
        <p><strong>Requirements/Message:</strong></p>
        <p>${message || 'No additional message provided'}</p>
        
        <p style="margin-top: 20px; font-size: 12px; color: #666;">
          Submitted at: ${new Date().toISOString()}
        </p>
      </div>
    `;

    // Send email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Inquiry Received - Blue Lamborghini Huracán',
      html: userEmailHtml,
    });

    // Send notification email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'chiravurip493@gmail.com',
      subject: `New Inquiry: ${inquiryType} from ${name}`,
      html: adminEmailHtml,
    });

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
