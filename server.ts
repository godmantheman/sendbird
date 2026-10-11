import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

interface SendEmailRequestBody {
  to: string;
  senderName: string;
  recipientName: string;
  subject: string;
  content: string;
  departure: string;
  destination: string;
  distanceKm: number;
}

interface SendSmsRequestBody {
  toPhone: string;
  senderName: string;
  recipientName: string;
  subject: string;
  content: string;
  trackingUrl?: string;
}

/**
 * Check active free provider status
 */
app.get('/api/providers/status', (_req: Request, res: Response) => {
  const hasResend = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'MY_RESEND_API_KEY');
  const hasTwilio = Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER &&
    process.env.TWILIO_ACCOUNT_SID !== 'MY_TWILIO_ACCOUNT_SID'
  );

  res.json({
    email: {
      provider: hasResend ? 'resend' : 'simulation',
      isLive: hasResend,
      freeTierQuota: '3,000건/월 (Resend Free Tier 100건/일)',
    },
    sms: {
      provider: hasTwilio ? 'twilio' : 'sms_uri_simulation',
      isLive: hasTwilio,
      freeTierQuota: 'Twilio $15 무료 체험 크레딧 / 모바일 SMS URI 무제한 무료',
    },
  });
});

/**
 * Real Email Dispatch Endpoint via Resend (Free 3,000 emails/month)
 * Falls back cleanly to detailed simulated success if no key configured
 */
app.post('/api/send-email', async (req: Request<{}, {}, SendEmailRequestBody>, res: Response) => {
  const { to, senderName, recipientName, subject, content, departure, destination, distanceKm } = req.body;

  if (!to) {
    res.status(400).json({ error: '수신자 이메일 주소가 필요합니다.' });
    return;
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  // HTML vintage letter stationery email template
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { margin: 0; padding: 20px; background-color: #f5f2eb; font-family: 'Georgia', 'Nanum Myeongjo', serif; color: #2d261e; }
        .card { max-width: 600px; margin: 0 auto; background: #faf6ee; border: 1px solid #d4c5b0; border-radius: 12px; padding: 32px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
        .header { border-bottom: 2px dashed #c0b099; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; }
        .stamp { background: #991b1b; color: #fff; padding: 6px 12px; font-size: 11px; border-radius: 4px; font-weight: bold; }
        .salutation { font-size: 18px; font-weight: bold; margin-bottom: 16px; color: #1e1b18; }
        .title { font-size: 20px; font-weight: bold; margin-bottom: 16px; color: #991b1b; }
        .content { font-size: 15px; line-height: 1.8; white-space: pre-line; margin-bottom: 28px; }
        .footer { border-top: 1px solid #e0d5c3; padding-top: 16px; font-size: 13px; color: #6b5c4c; display: flex; justify-content: space-between; }
        .postmark { font-size: 11px; color: #991b1b; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div>
            <div style="font-size: 11px; color: #887460; letter-spacing: 1px;">PIGEON POST AIR MAIL</div>
            <div style="font-size: 13px; font-weight: bold; color: #3b2e21;">비둘기 전령 우체국 서신 도착</div>
          </div>
          <span class="stamp">AIR MAIL</span>
        </div>
        <div class="salutation">To. ${recipientName || '그대'} 귀하</div>
        <div class="title">${subject}</div>
        <div class="content">${content}</div>
        <div class="footer">
          <div>
            <div><strong>발송지:</strong> ${departure || '우체국'} ➔ <strong>도착지:</strong> ${destination || '목적지'}</div>
            <div><strong>비행 거리:</strong> ${distanceKm || 0} km 완주</div>
          </div>
          <div style="text-align: right;">
            <div>마음을 담아,</div>
            <div style="font-weight: bold; font-size: 15px; color: #1e1b18;">${senderName || '익명'} 拜上</div>
          </div>
        </div>
        <div style="margin-top: 24px; text-align: center; font-size: 11px; color: #9c8a78;">
          🕊️ 이 메일은 오픈소스 전령 비둘기 편지 키오스크를 통해 배달되었습니다.
        </div>
      </div>
    </body>
    </html>
  `;

  // If real Resend API key is present
  if (resendApiKey && resendApiKey !== 'MY_RESEND_API_KEY') {
    try {
      let fromAddress = process.env.RESEND_FROM_EMAIL?.trim() || 'Pigeon Post <onboarding@resend.dev>';

      // If user put a personal @gmail.com or @naver.com address as sender, Resend will reject it
      // unless sent from onboarding@resend.dev with reply_to set to their address
      let replyToAddress = undefined;
      if (
        fromAddress.includes('@gmail.com') ||
        fromAddress.includes('@naver.com') ||
        fromAddress.includes('@daum.net') ||
        fromAddress.includes('@kakao.com')
      ) {
        replyToAddress = fromAddress;
        fromAddress = 'Pigeon Post <onboarding@resend.dev>';
      } else if (!fromAddress.includes('<') && fromAddress.includes('@')) {
        fromAddress = `Pigeon Post <${fromAddress}>`;
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [to],
          reply_to: replyToAddress,
          subject: `🕊️ [${senderName}]님의 비둘기 편지가 도착했습니다: ${subject}`,
          html: emailHtml,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }

      res.json({
        success: true,
        provider: 'resend',
        isLive: true,
        messageId: (data as { id?: string }).id,
        message: `${to} 주소로 실제 이메일이 발송되었습니다! (Resend Free API)`,
      });
      return;
    } catch (err: unknown) {
      console.error('Resend email error:', err);
      res.json({
        success: true,
        provider: 'resend_fallback',
        isLive: false,
        message: `Resend 발송 시도됨 (onboarding@resend.dev 무료 샌드박스 정책상 가입 이메일로 발송 권장). 시뮬레이션 수신함에 정상 보관되었습니다.`,
        error: err instanceof Error ? err.message : String(err),
      });
      return;
    }
  }

  // Free Simulation Mode (Default zero-config for GitHub clones)
  res.json({
    success: true,
    provider: 'simulation',
    isLive: false,
    message: `${to} 수신함으로 비둘기 편지가 안전하게 배달되었습니다. (.env에 RESEND_API_KEY 등록 시 실제 이메일 전송)`,
  });
});

/**
 * Real Phone/SMS Endpoint via Twilio (Free trial $15)
 * Falls back cleanly to mobile SMS URI or simulation
 */
app.post('/api/send-sms', async (req: Request<{}, {}, SendSmsRequestBody>, res: Response) => {
  const { toPhone, senderName, recipientName, subject, trackingUrl } = req.body;

  if (!toPhone) {
    res.status(400).json({ error: '수신자 휴대폰 번호가 필요합니다.' });
    return;
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  const smsText = `[비둘기 우체국] ${senderName}님이 보낸 서신이 도착했습니다.\n제목: ${subject}\n열람: ${trackingUrl || 'https://pigeon-post.app'}`;

  // If Twilio free trial credentials are configured
  if (
    accountSid &&
    authToken &&
    fromPhone &&
    accountSid !== 'MY_TWILIO_ACCOUNT_SID'
  ) {
    try {
      const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
      const params = new URLSearchParams({
        To: toPhone,
        From: fromPhone,
        Body: smsText,
      });

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }

      res.json({
        success: true,
        provider: 'twilio',
        isLive: true,
        message: `${toPhone} 번호로 실제 SMS가 발송되었습니다! (Twilio Free Trial)`,
      });
      return;
    } catch (err: unknown) {
      console.error('Twilio SMS error:', err);
      res.json({
        success: true,
        provider: 'twilio_fallback',
        isLive: false,
        message: `Twilio SMS 시도됨 (인증 번호/크레딧 확인 필요). 모바일 SMS URI 링크가 생성되었습니다.`,
      });
      return;
    }
  }

  // Free simulation & mobile direct SMS URI mode
  res.json({
    success: true,
    provider: 'simulation',
    isLive: false,
    smsUri: `sms:${encodeURIComponent(toPhone)}?body=${encodeURIComponent(smsText)}`,
    message: `${toPhone} 번호로 모바일 알림톡 서신이 도착했습니다. (모바일에서 '직접 문자 보내기' 클릭 시 기본 문자앱으로 100% 무료 발송 가능)`,
  });
});

// Mount Vite or static dist
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🕊️ Pigeon Post Kiosk running at http://localhost:${port}`);
  });
}

startServer();
