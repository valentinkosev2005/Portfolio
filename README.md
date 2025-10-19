# VK Designs Portfolio

A modern, responsive portfolio website for graphic designer Valentin Kosev.

## Features

- **Responsive Design**: Optimized for all devices
- **Project Gallery**: Interactive modal galleries for each project
- **Functional Contact Form**: Sends emails directly to vampixwork@gmail.com
- **Professional Portfolio**: Showcases real client work and collaborations

## Setup Instructions

### 1. Contact Form Setup

To enable the contact form functionality, you need to set up email sending:

#### Option A: Using Resend (Recommended)

1. Sign up for a free account at [Resend](https://resend.com)
2. Get your API key from the Resend dashboard
3. Add your API key to the Supabase Edge Function environment variables
4. The contact form will automatically send emails to vampixwork@gmail.com

#### Option B: Alternative Email Services

You can modify the Edge Function to use other email services like:
- SendGrid
- Mailgun
- AWS SES
- Nodemailer with SMTP

### 2. Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Service
RESEND_API_KEY=your_resend_api_key
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Deploy the Edge Function:
   ```bash
   supabase functions deploy send-contact-email
   ```
3. Set the RESEND_API_KEY secret:
   ```bash
   supabase secrets set RESEND_API_KEY=your_actual_api_key
   ```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Contact Form Features

- **Form Validation**: Client-side and server-side validation
- **Email Formatting**: Professional HTML email templates
- **Success/Error Messages**: User feedback for form submissions
- **Spam Protection**: Basic validation and rate limiting
- **Mobile Responsive**: Works perfectly on all devices

## Portfolio Projects

The website showcases real projects including:
- Mr. Potato – Street Food Rebrand
- Business Card Design
- Meta Ads Campaign
- Valentine's Party Poster for Trevnenska Shkola
- Volleyball Tournament Poster
- Poster for the Carnival of Gabrovo
- Gn. Pechen - Branding
- 3D PRINT LTD. - Marketing Materials
- MARINA - Product Visuals

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase Edge Functions
- **Email**: Resend API
- **Deployment**: Bolt Hosting
- **Icons**: Lucide React

## Contact

- **Email**: vampixwork@gmail.com
- **Phone**: +359 89 034 2280
- **Location**: Sofia, Bulgaria
- **Instagram**: [@vk_creative.designs](https://www.instagram.com/vk_creative.designs?igsh=MWkzeXc1NHprZHFodQ==)