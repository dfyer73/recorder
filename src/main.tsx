import CssBaseline from '@mui/material/CssBaseline';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  StyledEngineProvider,
} from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Compose from 'components/Compose';
import BrowserNotSupported from 'components/BrowserNotSupported';
import { CountdownProvider } from 'contexts/countdown';
import { LayoutProvider } from 'contexts/layout';
import { MediaDevicesProvider } from 'contexts/mediaDevices';
import { CameraShapeProvider } from 'contexts/cameraShape';
import { PictureInPictureProvider } from 'contexts/pictureInPicture';
import { RecordingProvider } from 'contexts/recording';
import { ScreenshareProvider } from 'contexts/screenshare';
import { StreamsProvider } from 'contexts/streams';
import { FeatureSupportProvider } from 'contexts/featureSupport';

import App from './App';
import theme from './theme';

const isBrowserSupported =
  'mediaDevices' in navigator &&
  'getUserMedia' in navigator.mediaDevices &&
  'MediaRecorder' in window;

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <CssVarsProvider theme={theme} defaultMode="dark">
        <CssBaseline />
        {isBrowserSupported ? (
          <Compose
            components={[
              FeatureSupportProvider,
              LayoutProvider,
              StreamsProvider,
              RecordingProvider,
              CameraShapeProvider,
              PictureInPictureProvider,
              MediaDevicesProvider,
              ScreenshareProvider,
              CountdownProvider,
            ]}
          >
            <App />
          </Compose>
        ) : (
          <BrowserNotSupported />
        )}
      </CssVarsProvider>
    </StyledEngineProvider>
  </StrictMode>,
);
