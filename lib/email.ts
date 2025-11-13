import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY not set. Email functionality will be disabled.')
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export interface ContactEmailData {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactEmail(data: ContactEmailData): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    return { success: false, error: 'Email service not configured' }
  }

  if (!process.env.CONTACT_EMAIL_TO) {
    return { success: false, error: 'Contact email recipient not configured' }
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'SNW Store <noreply@snow.com.br>',
      to: process.env.CONTACT_EMAIL_TO,
      replyTo: data.email,
      subject: `Nova mensagem de contato: ${data.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #023859 0%, #30A9D9 100%);
                color: white;
                padding: 30px;
                border-radius: 8px 8px 0 0;
                text-align: center;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 8px 8px;
              }
              .field {
                margin-bottom: 20px;
              }
              .label {
                font-weight: bold;
                color: #023859;
                display: block;
                margin-bottom: 5px;
              }
              .value {
                color: #666;
                padding: 10px;
                background: white;
                border-radius: 4px;
                border-left: 3px solid #30A9D9;
              }
              .message-box {
                min-height: 100px;
                white-space: pre-wrap;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0;">Nova Mensagem de Contato</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">SNW Store</p>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Nome:</span>
                <div class="value">${escapeHtml(data.name)}</div>
              </div>
              <div class="field">
                <span class="label">Email:</span>
                <div class="value">${escapeHtml(data.email)}</div>
              </div>
              <div class="field">
                <span class="label">Assunto:</span>
                <div class="value">${escapeHtml(data.subject)}</div>
              </div>
              <div class="field">
                <span class="label">Mensagem:</span>
                <div class="value message-box">${escapeHtml(data.message)}</div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Nova mensagem de contato - SNW Store

Nome: ${data.name}
Email: ${data.email}
Assunto: ${data.subject}

Mensagem:
${data.message}
      `.trim()
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message || 'Failed to send email' }
    }

    if (process.env.SEND_CONFIRMATION_EMAIL === 'true') {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'SNW Store <noreply@snow.com.br>',
        to: data.email,
        subject: 'Recebemos sua mensagem! - SNW Store',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #023859 0%, #30A9D9 100%);
                  color: white;
                  padding: 30px;
                  border-radius: 8px 8px 0 0;
                  text-align: center;
                }
                .content {
                  background: #f9f9f9;
                  padding: 30px;
                  border-radius: 0 0 8px 8px;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1 style="margin: 0;">Mensagem Recebida!</h1>
              </div>
              <div class="content">
                <p>Olá ${escapeHtml(data.name)},</p>
                <p>Recebemos sua mensagem e entraremos em contato em breve!</p>
                <p><strong>Assunto:</strong> ${escapeHtml(data.subject)}</p>
                <p style="margin-top: 30px; color: #666; font-size: 14px;">
                  Esta é uma confirmação automática. Por favor, não responda este email.
                </p>
              </div>
            </body>
          </html>
        `
      })
    }

    return { success: true }
  } catch (error: any) {
    console.error('Email send error:', error)
    return { success: false, error: error.message || 'Failed to send email' }
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}

