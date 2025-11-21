import { createContext, useContext, useState } from 'react';

import { useRecording } from './recording';
import { useFeatureSupport } from './featureSupport';

type PictureInPictureContextType = {
  pipWindow: Window | null;
  requestPipWindow: () => Promise<Window>;
};

const PictureInPictureContext = createContext<
  PictureInPictureContextType | undefined
>(undefined);

type PictureInPictureProviderProps = {
  children: React.ReactNode;
};

export const PictureInPictureProvider = ({
  children,
}: PictureInPictureProviderProps) => {
  const { stopRecording } = useRecording();
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const { isSupported } = useFeatureSupport();

  const requestPipWindow = async () => {
    if (!isSupported('pictureInPictureWindow')) {
      throw new Error('Picture-in-Picture not supported');
    }
    const pipWindow = await window.documentPictureInPicture.requestWindow({
      width: 300,
      height: 300,
    });

    pipWindow.onpagehide = () => {
      stopRecording();
      setPipWindow(null);
    };

    const allCSS = [...document.styleSheets]
      .map((styleSheet) =>
        [...styleSheet.cssRules].map((r) => r.cssText).join(''),
      )
      .filter(Boolean)
      .join('\n');
    const style = document.createElement('style');
    style.textContent = allCSS;
    pipWindow.document.head.appendChild(style);

    setPipWindow(pipWindow);

    return pipWindow;
  };

  return (
    <PictureInPictureContext.Provider value={{ pipWindow, requestPipWindow }}>
      {children}
    </PictureInPictureContext.Provider>
  );
};

export const usePictureInPicture = (): PictureInPictureContextType => {
  const context = useContext(PictureInPictureContext);

  if (context === undefined) {
    throw new Error(
      'usePictureInPicture must be used within a PictureInPictureProvider',
    );
  }

  return context;
};
