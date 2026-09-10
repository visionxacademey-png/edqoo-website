import type { DeviceInfo } from '../types/index.js';

/**
 * Generates a simple, deterministic fast hash from a string
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Gets or creates a persistent device ID stored in localStorage
 */
export function getOrCreateDeviceId(): string {
  const STORAGE_KEY = 'edqoo_device_id';
  try {
    let deviceId = localStorage.getItem(STORAGE_KEY);
    if (!deviceId) {
      const randomPart = Math.random().toString(36).substring(2, 10);
      const timePart = Date.now().toString(36);
      deviceId = `dev-${randomPart}-${timePart}`;
      localStorage.setItem(STORAGE_KEY, deviceId);
    }
    return deviceId;
  } catch {
    return `dev-${Math.random().toString(36).substring(2, 10)}`;
  }
}

/**
 * Generates a browser hardware fingerprint based on canvas rendering, WebGL, screen, and hardware metrics
 */
export function generateDeviceFingerprint(): string {
  try {
    const components: string[] = [];

    // 1. Screen & Hardware Metrics
    if (typeof window !== 'undefined') {
      components.push(`${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`);
      components.push(`dpr:${window.devicePixelRatio || 1}`);
      components.push(`cores:${navigator.hardwareConcurrency || 4}`);
      components.push(`mem:${(navigator as any).deviceMemory || 'na'}`);
      components.push(`tz:${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
      components.push(`lang:${navigator.language || 'en'}`);
      components.push(`touch:${navigator.maxTouchPoints || 0}`);
    }

    // 2. Canvas 2D fingerprinting
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 50;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = "14px 'Arial', sans-serif";
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Edqoo Security FP 2026', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('Edqoo Security FP 2026', 4, 17);
        components.push(canvas.toDataURL());
      }
    } catch {
      // Canvas blocked by security policy
    }

    // 3. WebGL Vendor & Renderer
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const vendor = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          components.push(`gl:${vendor}~${renderer}`);
        }
      }
    } catch {
      // WebGL blocked
    }

    const rawString = components.join('|||');
    return `fp-${simpleHash(rawString)}-${simpleHash(rawString.split('').reverse().join(''))}`;
  } catch {
    return `fp-generic-${Date.now().toString(36)}`;
  }
}

/**
 * Detects device type, OS, browser, model, and display properties
 */
export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      deviceId: 'dev-ssr-unknown',
      deviceType: 'Desktop',
      os: 'Unknown OS',
      osVersion: '',
      browser: 'Node / SSR',
      browserVersion: '',
      screenResolution: '1920 x 1080',
      language: 'en-US',
      timezone: 'UTC',
      fingerprint: 'fp-ssr'
    };
  }

  const ua = navigator.userAgent || '';
  const platform = (navigator as any).userAgentData?.platform || navigator.platform || '';

  // 1. Operating System & Version
  let os = 'Unknown OS';
  let osVersion = '';

  if (/Windows NT 10.0/i.test(ua)) {
    os = 'Windows';
    osVersion = '10 / 11';
  } else if (/Windows NT 6.3/i.test(ua)) {
    os = 'Windows';
    osVersion = '8.1';
  } else if (/Windows NT 6.2/i.test(ua)) {
    os = 'Windows';
    osVersion = '8';
  } else if (/Windows NT 6.1/i.test(ua)) {
    os = 'Windows';
    osVersion = '7';
  } else if (/Windows/i.test(ua)) {
    os = 'Windows';
  } else if (/Android/i.test(ua)) {
    os = 'Android';
    const match = ua.match(/Android\s([0-9\.]+)/i);
    if (match) osVersion = match[1];
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    os = 'iOS';
    const match = ua.match(/OS\s([0-9_]+)/i);
    if (match) osVersion = match[1].replace(/_/g, '.');
  } else if (/Mac OS X/i.test(ua) || /Macintosh/i.test(ua)) {
    os = 'macOS';
    const match = ua.match(/Mac OS X\s([0-9_]+)/i);
    if (match) osVersion = match[1].replace(/_/g, '.');
  } else if (/CrOS/i.test(ua)) {
    os = 'ChromeOS';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
    if (/Ubuntu/i.test(ua)) osVersion = 'Ubuntu';
    else if (/Fedora/i.test(ua)) osVersion = 'Fedora';
    else if (/Debian/i.test(ua)) osVersion = 'Debian';
  }

  // 2. Browser & Version
  let browser = 'Unknown Browser';
  let browserVersion = '';

  if (/Edg\/([0-9\.]+)/i.test(ua)) {
    browser = 'Microsoft Edge';
    browserVersion = ua.match(/Edg\/([0-9\.]+)/i)?.[1] || '';
  } else if (/Chrome\/([0-9\.]+)/i.test(ua) && !/Chromium|Edg|OPR/i.test(ua)) {
    browser = 'Google Chrome';
    browserVersion = ua.match(/Chrome\/([0-9\.]+)/i)?.[1] || '';
  } else if (/Firefox\/([0-9\.]+)/i.test(ua)) {
    browser = 'Mozilla Firefox';
    browserVersion = ua.match(/Firefox\/([0-9\.]+)/i)?.[1] || '';
  } else if (/Version\/([0-9\.]+).*Safari/i.test(ua)) {
    browser = 'Apple Safari';
    browserVersion = ua.match(/Version\/([0-9\.]+)/i)?.[1] || '';
  } else if (/OPR\/([0-9\.]+)/i.test(ua)) {
    browser = 'Opera';
    browserVersion = ua.match(/OPR\/([0-9\.]+)/i)?.[1] || '';
  }

  // 3. Device Type & Model
  let deviceType: 'Desktop' | 'Laptop' | 'Tablet' | 'Mobile' = 'Desktop';
  let deviceModel = '';

  const isTouch = (navigator.maxTouchPoints || 0) > 0;
  const isTabletUA = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua);
  const isMobileUA = /(mobile|ipod|iphone|blackberry|iemobile|opera mini|windows phone)/i.test(ua);

  if (isTabletUA || (isTouch && window.screen.width >= 768 && window.screen.width <= 1024)) {
    deviceType = 'Tablet';
    if (/iPad/i.test(ua)) deviceModel = 'Apple iPad';
    else if (/Samsung/i.test(ua) || /SM-T/i.test(ua)) deviceModel = 'Samsung Galaxy Tab';
    else deviceModel = 'Tablet Device';
  } else if (isMobileUA || (isTouch && window.screen.width < 768)) {
    deviceType = 'Mobile';
    if (/iPhone/i.test(ua)) {
      const dpr = window.devicePixelRatio || 1;
      if (window.screen.height >= 844 || window.screen.width >= 390) {
        deviceModel = dpr >= 3 ? 'Apple iPhone Pro / Max' : 'Apple iPhone';
      } else {
        deviceModel = 'Apple iPhone';
      }
    } else if (/Pixel/i.test(ua)) {
      const match = ua.match(/Pixel\s([0-9a-zA-Z\s]+)/i);
      deviceModel = match ? `Google Pixel ${match[1].split(' ')[0]}` : 'Google Pixel';
    } else if (/Samsung|SM-|Galaxy/i.test(ua)) {
      deviceModel = 'Samsung Galaxy';
    } else if (/OnePlus/i.test(ua)) {
      deviceModel = 'OnePlus';
    } else if (/Xiaomi|Redmi|POCO/i.test(ua)) {
      deviceModel = 'Xiaomi / Redmi';
    } else {
      deviceModel = 'Smartphone';
    }
  } else {
    // Desktop vs Laptop heuristic
    if (os === 'macOS') {
      deviceType = window.screen.width <= 1512 ? 'Laptop' : 'Desktop';
      deviceModel = deviceType === 'Laptop' ? 'MacBook Pro / Air' : 'iMac / Mac Studio';
    } else {
      deviceType = window.screen.width <= 1536 || isTouch ? 'Laptop' : 'Desktop';
      deviceModel = deviceType === 'Laptop' ? `${os} Laptop` : `${os} Workstation PC`;
    }
  }

  // 4. Screen Resolution
  const dpr = window.devicePixelRatio || 1;
  const screenResolution = `${window.screen.width} × ${window.screen.height} (${dpr}x DPR, ${window.screen.colorDepth || 24}-bit)`;

  // 5. Language & Timezone
  const language = navigator.language || (navigator.languages && navigator.languages[0]) || 'en-US';
  let timezone = 'UTC';
  try {
    const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const offsetMinutes = new Date().getTimezoneOffset();
    const sign = offsetMinutes <= 0 ? '+' : '-';
    const hours = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, '0');
    const mins = String(Math.abs(offsetMinutes) % 60).padStart(2, '0');
    timezone = `${tzName} (UTC${sign}${hours}:${mins})`;
  } catch {
    timezone = 'UTC';
  }

  const deviceId = getOrCreateDeviceId();
  const fingerprint = generateDeviceFingerprint();

  return {
    deviceId,
    deviceType,
    os,
    osVersion,
    browser,
    browserVersion,
    deviceModel,
    screenResolution,
    language,
    timezone,
    fingerprint,
    platform: platform || os
  };
}
