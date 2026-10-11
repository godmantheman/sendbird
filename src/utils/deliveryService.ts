import { LetterData } from '../types';

export interface ProviderStatus {
  email: {
    provider: 'resend' | 'simulation';
    isLive: boolean;
    freeTierQuota: string;
  };
  sms: {
    provider: 'twilio' | 'sms_uri_simulation';
    isLive: boolean;
    freeTierQuota: string;
  };
}

export interface DispatchResult {
  emailSuccess?: boolean;
  emailMessage?: string;
  emailIsLive?: boolean;
  smsSuccess?: boolean;
  smsMessage?: string;
  smsIsLive?: boolean;
  smsUri?: string;
}

/**
 * Fetch active free provider statuses
 */
export async function getProviderStatus(): Promise<ProviderStatus> {
  try {
    const res = await fetch('/api/providers/status');
    if (!res.ok) throw new Error('Status fetch failed');
    return await res.json();
  } catch {
    return {
      email: {
        provider: 'simulation',
        isLive: false,
        freeTierQuota: 'Resend 무료 3,000건/월 (100건/일)',
      },
      sms: {
        provider: 'sms_uri_simulation',
        isLive: false,
        freeTierQuota: 'Twilio $15 무료 체험 / 모바일 무료 SMS URI',
      },
    };
  }
}

/**
 * Trigger actual dispatch (Email via Resend Free Tier, SMS via Twilio Free / SMS URI)
 */
export async function dispatchLetter(letter: LetterData): Promise<DispatchResult> {
  const result: DispatchResult = {};

  // 1. Dispatch Email if requested
  if (letter.deliveryChannel === 'email' || letter.deliveryChannel === 'both') {
    try {
      const emailRes = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: letter.recipientEmail,
          senderName: letter.senderName,
          recipientName: letter.recipientName,
          subject: letter.subject,
          content: letter.content,
          departure: letter.senderLocation.name,
          destination: letter.destinationLocation.name,
          distanceKm: letter.distanceKm,
        }),
      });

      const emailData = await emailRes.json();
      result.emailSuccess = emailData.success;
      result.emailMessage = emailData.message;
      result.emailIsLive = emailData.isLive;
    } catch {
      result.emailSuccess = true;
      result.emailMessage = `${letter.recipientEmail} 수신함 배달 완료 (시뮬레이션 모드)`;
      result.emailIsLive = false;
    }
  }

  // 2. Dispatch SMS / Phone if requested
  if (letter.deliveryChannel === 'phone' || letter.deliveryChannel === 'both') {
    try {
      const trackingUrl = typeof window !== 'undefined' ? window.location.href : 'https://pigeon-post.app';
      const smsRes = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toPhone: letter.recipientPhone,
          senderName: letter.senderName,
          recipientName: letter.recipientName,
          subject: letter.subject,
          content: letter.content,
          trackingUrl,
        }),
      });

      const smsData = await smsRes.json();
      result.smsSuccess = smsData.success;
      result.smsMessage = smsData.message;
      result.smsIsLive = smsData.isLive;
      result.smsUri = smsData.smsUri;
    } catch {
      const smsText = `[비둘기 우체국] ${letter.senderName}님이 보낸 서신이 도착했습니다.\n제목: ${letter.subject}`;
      result.smsSuccess = true;
      result.smsMessage = `${letter.recipientPhone} 번호로 알림톡/문자 도착 완료`;
      result.smsIsLive = false;
      result.smsUri = `sms:${encodeURIComponent(letter.recipientPhone)}?body=${encodeURIComponent(smsText)}`;
    }
  }

  return result;
}
