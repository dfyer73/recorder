import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

type SupportedFeatures = {
  getUserMedia: boolean;
  getDisplayMedia: boolean;
  mediaRecorder: boolean;
  trackProcessor: boolean;
  trackGenerator: boolean;
  pictureInPictureWindow: boolean;
  offscreenCanvas: boolean;
};

type FeatureSupportContextType = {
  isMobile: boolean;
  features: SupportedFeatures;
  refresh: () => void;
  isSupported: (feature: keyof SupportedFeatures) => boolean;
  mobileWhitelist: (keyof SupportedFeatures)[];
};

const FeatureSupportContext = createContext<FeatureSupportContextType | undefined>(undefined);

const STORAGE_KEY = 'featureSupport.cache.v1';

type NavigatorUAData = { mobile?: boolean };

const detectMobile = () => {
  const uaData = (navigator as unknown as { userAgentData?: NavigatorUAData }).userAgentData;
  const uaDataMobile = uaData?.mobile;
  if (uaDataMobile !== undefined) return uaDataMobile;
  const ua = navigator.userAgent || '';
  const mobileRegex = /Android|iPhone|iPad|iPod|Mobile|Silk|Kindle|BlackBerry|Opera Mini|IEMobile/i;
  return mobileRegex.test(ua);
};

const detectFeatures = (): { isMobile: boolean; features: SupportedFeatures } => {
  const isMobile = detectMobile();
  const hasDisplayMedia = (
    'mediaDevices' in navigator && 'getDisplayMedia' in navigator.mediaDevices
  ) || 'getDisplayMedia' in (navigator as unknown as Record<string, unknown>);
  const features: SupportedFeatures = {
    getUserMedia: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    getDisplayMedia: hasDisplayMedia,
    mediaRecorder: 'MediaRecorder' in window,
    trackProcessor: 'MediaStreamTrackProcessor' in window,
    trackGenerator: 'MediaStreamTrackGenerator' in window,
    pictureInPictureWindow: 'documentPictureInPicture' in window,
    offscreenCanvas: 'OffscreenCanvas' in window,
  };
  return { isMobile, features };
};

export const FeatureSupportProvider = ({ children }: { children: React.ReactNode }) => {
  const initial = detectFeatures();
  const [isMobile, setIsMobile] = useState(initial.isMobile);
  const [features, setFeatures] = useState<SupportedFeatures>(initial.features);

  const mobileWhitelist = useMemo<(keyof SupportedFeatures)[]>(
    () => ['getUserMedia', 'mediaRecorder', 'offscreenCanvas'],
    [],
  );

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let cached: string | null = null;
    try {
      cached = sessionStorage.getItem(STORAGE_KEY);
    } catch (e) {
      cached = null;
    }
    if (cached) {
      const parsed = JSON.parse(cached) as { ts: number; isMobile: boolean; features: SupportedFeatures };
      setIsMobile(parsed.isMobile);
      setFeatures(parsed.features);
      return;
    }

    const { isMobile: mobileDetected, features: detected } = detectFeatures();
    setIsMobile(mobileDetected);
    setFeatures(detected);
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ts: Date.now(), isMobile: mobileDetected, features: detected }),
      );
    } catch (e) {
      void 0;
    }
  }, []);

  const refresh = () => {
    const { isMobile: mobileDetected, features: detected } = detectFeatures();
    setIsMobile(mobileDetected);
    setFeatures(detected);
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ts: Date.now(), isMobile: mobileDetected, features: detected }),
      );
    } catch (e) {
      void 0;
    }
  };

  const isSupported = (feature: keyof SupportedFeatures) => {
    const value = features[feature];
    if (!isMobile) return value;
    return value && mobileWhitelist.includes(feature);
  };

  return (
    <FeatureSupportContext.Provider
      value={{ isMobile, features, refresh, isSupported, mobileWhitelist }}
    >
      {children}
    </FeatureSupportContext.Provider>
  );
};

export const useFeatureSupport = (): FeatureSupportContextType => {
  const ctx = useContext(FeatureSupportContext);
  if (ctx === undefined) {
    throw new Error('useFeatureSupport must be used within a FeatureSupportProvider');
  }
  return ctx;
};