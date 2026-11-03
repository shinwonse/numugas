'use client';

import { Check, ExternalLink, Share, SquarePlus, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

/** Chrome·Edge·삼성 인터넷이 설치 가능할 때 보내는 이벤트 (표준 타입에 없다) */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface Window {
    /** layout의 인라인 스크립트가 미리 받아 둔 설치 이벤트 */
    __installPrompt?: BeforeInstallPromptEvent;
  }
}

/** 닫은 뒤 다시 보여주기까지 기다리는 기간 */
const DISMISS_DAYS = 14;
const DISMISS_KEY = 'numugas:install-dismissed-at';
/** 첫 화면(로고)을 본 다음 띄운다 */
const SHOW_DELAY_MS = 3000;

type Mode = 'prompt' | 'ios' | 'kakao';

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIOS(ua: string) {
  // iPadOS는 데스크톱 Safari처럼 Macintosh로 보이므로 터치 지원으로 구분한다
  return /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
}

function recentlyDismissed() {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return at > 0 && Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

/**
 * 홈에서 휴대폰으로 볼 때 홈 화면 추가를 권하는 카드.
 * - 안드로이드(Chrome·삼성 인터넷·Edge): 버튼 한 번으로 설치 창을 띄운다
 * - iPhone·iPad: 웹이 직접 설치할 수 없어 공유 → 홈 화면에 추가 순서를 보여준다
 * - 카카오톡 안 브라우저: 설치가 안 되므로 기본 브라우저로 여는 버튼을 준다
 * 이미 설치했거나, 최근 14일 안에 닫았거나, PC면 보이지 않는다.
 */
export function InstallPrompt() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [visible, setVisible] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return;

    const ua = navigator.userAgent;
    const isMobile = isIOS(ua) || /Android/i.test(ua);
    if (!isMobile) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const showAs = (next: Mode) => {
      setMode(next);
      timer = setTimeout(() => {
        setVisible(true);
      }, SHOW_DELAY_MS);
    };

    if (/KAKAOTALK/i.test(ua)) {
      showAs('kakao');
      return () => {
        clearTimeout(timer);
      };
    }
    if (isIOS(ua)) {
      showAs('ios');
      return () => {
        clearTimeout(timer);
      };
    }

    // 안드로이드: 브라우저가 설치 가능하다고 알려 줄 때만 띄운다 (못 하는 브라우저엔 권하지 않는다)
    const takeInstallEvent = () => {
      const event = window.__installPrompt;
      if (!event) return;
      setInstallEvent(event);
      showAs('prompt');
    };
    takeInstallEvent();
    window.addEventListener('installpromptready', takeInstallEvent);
    const onInstalled = () => {
      setVisible(false);
    };
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('installpromptready', takeInstallEvent);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // 저장을 못 해도 이번 방문에선 닫힌다
    }
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    // 이벤트는 한 번만 쓸 수 있다
    window.__installPrompt = undefined;
    setInstallEvent(null);
    if (outcome === 'accepted') setVisible(false);
    else dismiss();
  };

  if (!visible || mode === null) return null;

  return (
    <aside
      aria-label="앱 설치 안내"
      className="fixed inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 mx-auto max-w-md rounded-lg border border-white/10 bg-black/60 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl backdrop-saturate-[1.8]"
      style={{ animation: 'fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both' }}
    >
      <div className="flex items-start gap-3">
        {/* 홈 화면에 생길 아이콘 그대로: 앱 아이콘 모양에 맞춰 모서리를 둥글린다 */}
        <Image
          src="/icon-192x192.png"
          alt=""
          width={44}
          height={44}
          className="shrink-0 rounded-[10px]"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">홈 화면에 NUMUGAS 추가</p>
          <p className="mt-0.5 text-xs leading-relaxed text-white/60">
            {mode === 'kakao'
              ? '카카오톡 안에서는 설치할 수 없어요. 기본 브라우저에서 열어 주세요.'
              : '아이콘 한 번으로 기록과 일정을 바로 볼 수 있어요.'}
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="닫기"
          className="-m-2 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/50 transition-colors hover:text-white"
        >
          <X aria-hidden className="h-4 w-4" />
        </button>
      </div>

      {mode === 'prompt' && (
        <button
          type="button"
          onClick={() => {
            void install();
          }}
          className="mt-3 flex min-h-11 w-full cursor-pointer items-center justify-center rounded-md bg-red-500 text-sm font-semibold transition-colors hover:bg-red-600"
        >
          설치
        </button>
      )}

      {mode === 'kakao' && (
        <a
          href={`kakaotalk://web/openExternal?url=${encodeURIComponent(window.location.href)}`}
          className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-red-500 text-sm font-semibold transition-colors hover:bg-red-600"
        >
          <ExternalLink aria-hidden className="h-4 w-4" />
          기본 브라우저로 열기
        </a>
      )}

      {mode === 'ios' && (
        <ol className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] leading-snug text-white/70">
          {[
            { icon: Share, text: '공유 버튼' },
            { icon: SquarePlus, text: '홈 화면에 추가' },
            { icon: Check, text: '추가' },
          ].map((step, i) => (
            <li
              key={step.text}
              className="flex flex-col items-center gap-1.5 rounded-md bg-white/[0.05] px-2 py-2.5"
              style={{ animation: `fade-in-up 0.4s ease-out ${String(0.2 + i * 0.08)}s both` }}
            >
              <step.icon aria-hidden className="h-4 w-4 text-red-400" />
              <span>
                <span className="mr-1 font-bold text-red-400">{i + 1}</span>
                {step.text}
              </span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
