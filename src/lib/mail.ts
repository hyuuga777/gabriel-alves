import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: Number(process.env.SMTP_PORT || '465'),
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'suporte@ogabrielalves.app',
    pass: process.env.SMTP_PASS || '7=Ke&b~|$LX',
  },
});

const DEFAULT_FROM = `Suporte Team Alves <${process.env.SMTP_USER || 'suporte@ogabrielalves.app'}>`;

export async function sendWelcomeEmail({ to, name, email, password }: { to: string; name: string; email: string; password?: string }) {
  try {
    const passwordSection = password 
      ? `
        <div style="background-color: #1e1e1e; border: 1px solid #333; padding: 15px; border-radius: 10px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #aaa; font-size: 14px;">Suas credenciais de acesso:</p>
          <p style="margin: 0 0 5px 0; color: #fff;"><strong>E-mail:</strong> ${email}</p>
          <p style="margin: 0; color: #fff;"><strong>Senha Temporária:</strong> <code style="color: #4ade80; font-family: monospace; font-size: 16px;">${password}</code></p>
        </div>
      `
      : `
        <div style="background-color: #1e1e1e; border: 1px solid #333; padding: 15px; border-radius: 10px; margin: 20px 0;">
          <p style="margin: 0 0 5px 0; color: #fff;"><strong>E-mail de Acesso:</strong> ${email}</p>
          <p style="margin: 0; color: #aaa; font-size: 12px;">Use a senha cadastrada no momento do registro.</p>
        </div>
      `;

    const html = `
      <div style="font-family: sans-serif; background-color: #000; color: #fff; padding: 40px; border-radius: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #111;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://ogabrielalves.com/logo.png" alt="Team Alves" style="height: 70px; width: auto;" />
        </div>
        <h1 style="color: #fff; font-size: 24px; font-weight: 900; margin-bottom: 20px; text-transform: uppercase; letter-spacing: -0.5px;">Seja Bem-vindo ao Team Alves! 💪</h1>
        <p style="color: #ccc; font-size: 16px; line-height: 1.6;">Olá, <strong>${name}</strong>!</p>
        <p style="color: #ccc; font-size: 16px; line-height: 1.6;">Seu perfil de aluno foi criado com sucesso. A partir de agora você tem acesso à nossa consultoria e treinos exclusivos.</p>
        
        ${passwordSection}

        <div style="text-align: center; margin: 35px 0 25px 0;">
          <a href="https://ogabrielalves.app/login" style="background-color: #4ade80; color: #000; font-weight: 900; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; padding: 15px 35px; border-radius: 10px; text-decoration: none; display: inline-block;">
            Acessar Área do Aluno
          </a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #111; margin: 30px 0;" />
        <p style="color: #555; font-size: 12px; text-align: center; margin: 0;">Este é um e-mail automático enviado pelo sistema de consultoria Team Alves. Não responda a este e-mail.</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: DEFAULT_FROM,
      to,
      subject: 'Bem-vindo ao Team Alves! 💪 Credenciais de Acesso',
      html,
    });

    console.log('Welcome email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

export async function sendPasswordRecoveryEmail({ to, name, token }: { to: string; name: string; token: string }) {
  try {
    const recoveryLink = `https://ogabrielalves.app/recuperar-senha?token=${token}`;

    const html = `
      <div style="font-family: sans-serif; background-color: #000; color: #fff; padding: 40px; border-radius: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #111;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://ogabrielalves.com/logo.png" alt="Team Alves" style="height: 70px; width: auto;" />
        </div>
        <h1 style="color: #fff; font-size: 24px; font-weight: 900; margin-bottom: 20px; text-transform: uppercase; letter-spacing: -0.5px;">Recuperação de Senha 🔒</h1>
        <p style="color: #ccc; font-size: 16px; line-height: 1.6;">Olá, <strong>${name}</strong>!</p>
        <p style="color: #ccc; font-size: 16px; line-height: 1.6;">Recebemos uma solicitação de redefinição de senha para sua conta no Team Alves.</p>
        <p style="color: #ccc; font-size: 16px; line-height: 1.6;">Clique no botão abaixo para redefinir sua senha de acesso. Este link é válido por 1 hora.</p>
        
        <div style="text-align: center; margin: 35px 0 25px 0;">
          <a href="${recoveryLink}" style="background-color: #4ade80; color: #000; font-weight: 900; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; padding: 15px 35px; border-radius: 10px; text-decoration: none; display: inline-block;">
            Redefinir Minha Senha
          </a>
        </div>

        <p style="color: #aaa; font-size: 13px; line-height: 1.6;">Caso o botão acima não funcione, copie e cole o link abaixo no seu navegador:</p>
        <p style="color: #4ade80; font-size: 12px; font-family: monospace; word-break: break-all;">${recoveryLink}</p>
        
        <hr style="border: 0; border-top: 1px solid #111; margin: 30px 0;" />
        <p style="color: #555; font-size: 12px; text-align: center; margin: 0;">Se você não solicitou a redefinição de senha, ignore este e-mail.</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: DEFAULT_FROM,
      to,
      subject: '🔒 Recuperação de Senha - Team Alves',
      html,
    });

    console.log('Recovery email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send password recovery email:', error);
    return false;
  }
}
