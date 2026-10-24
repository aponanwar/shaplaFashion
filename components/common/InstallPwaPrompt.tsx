'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiDownload, FiX, FiShare, FiPlusSquare } from 'react-icons/fi';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed & running standalone
    const standaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (standaloneMode) {
      setIsStandalone(true);
      return;
    }

    // Check if dismissed recently
    try {
      const dismissed = localStorage.getItem('shapla_pwa_dismissed');
      if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 3600 * 1000) {
        return;
      }
    } catch {
      // Ignore
    }

    // iOS detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // Show for iOS after small delay
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    // Android / Desktop Chrome / Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('shapla_pwa_dismissed', Date.now().toString());
    } catch {
      // Ignore
    }
  };

  if (isStandalone || !isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-bounce-subtle">
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-gray-700 relative">
        {/* Dismiss X */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          aria-label="Dismiss install banner"
        >
          <FiX size={16} />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          {/* App Icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#C41E3A] flex items-center justify-center shrink-0 shadow-md p-1 border border-rose-400/30 overflow-hidden">
            <Image
              src="/icons/icon-192x192.png"
              alt="Shapla Fashion"
              width={48}
              height={48}
              className="rounded-xl"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-extrabold text-white leading-snug">
              Shapla Fashion অ্যাপ ইনস্টল করুন
            </h4>
            <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed">
              প্লে-স্টোর ছাড়াই সরাসরি আপনার ফোনের হোম স্ক্রিনে দ্রুত ও অফলাইনে শপিং করুন।
            </p>

            {isIOS ? (
              <div className="mt-2.5 bg-gray-800/90 p-2 rounded-xl border border-gray-700 text-[11px] text-gray-300 flex items-center gap-1.5">
                <FiShare className="text-primary-400 shrink-0" size={13} />
                <span>
                  Safari তে <strong className="text-white">Share</strong> বাটনে চাপ দিয়ে <strong className="text-white">Add to Home Screen</strong> <FiPlusSquare className="inline text-primary-400" size={11} /> বেছে নিন
                </span>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleInstallClick}
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <FiDownload size={13} /> ইনস্টল করুন
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-3 py-2 text-xs font-semibold text-gray-400 hover:text-gray-200"
                >
                  পরে করব
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
