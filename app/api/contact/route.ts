import nodemailer from 'nodemailer';

console.log('SMTP_USER:', process.env.SMTP_USER);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.SMTP_USER,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    accessToken: process.env.OAUTH_ACCESS_TOKEN,
    expires: 3599,
  }
});

export async function POST(request: Request) {
    try {
      const { name, email, message } = await request.json();
      console.log('Received form data:', { name, email, message });
  
      console.log('Attempting to send email...');
      console.log('Transporter configuration:', JSON.stringify(transporter.options));
      
      const info = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      });
  
      console.log('Message sent:', info.messageId);
      console.log('Full info object:', JSON.stringify(info));
      return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 200 });
    } catch (error) {
      console.error('Detailed error:', error);
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      return new Response(JSON.stringify({ error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' }), { status: 500 });
    }
  }
