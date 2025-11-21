import cx from 'classnames';
import { useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

import Footer from 'components/Footer';
import LayoutSwitcher from 'components/LayoutSwitcher';
import PiPWindow from 'components/PiPWindow';
import VideoStreams from 'components/VideoStreams';
import { useLayout } from 'contexts/layout';
import { useMediaDevices } from 'contexts/mediaDevices';
import { usePictureInPicture } from 'contexts/pictureInPicture';
import { useStreams } from 'contexts/streams';
import useKeyboardShorcut from 'hooks/useKeyboardShortcut';
import { useRecording } from 'contexts/recording';
import useStopWatch from 'hooks/useStopWatch';
import { formatDuration } from 'services/format/duration';
import { useFeatureSupport } from 'contexts/featureSupport';

import styles from './App.module.css';

const App = () => {
  const { layout } = useLayout();
  const { cameraStream, screenshareStream } = useStreams();
  const { pipWindow } = usePictureInPicture();
  const {
    cameraEnabled,
    microphoneEnabled,
    setCameraEnabled,
    setMicrophoneEnabled,
  } = useMediaDevices();
  const { isMobile } = useFeatureSupport();
  const {
    isRecording,
    isPaused,
    pauseRecording,
    resumeRecording,
    stopRecording,
  } = useRecording();
  const stopWatch = useStopWatch();

  useEffect(() => {
    if (isRecording) {
      stopWatch.start();
    } else {
      stopWatch.stop();
    }
  }, [isRecording, stopWatch]);

  useKeyboardShorcut('e', () => setCameraEnabled(!cameraEnabled));
  useKeyboardShorcut('d', () => setMicrophoneEnabled(!microphoneEnabled));

  return (
    <div
      className={cx(styles.root, {
        [styles.placeholder]:
          layout === 'cameraOnly' ? !cameraStream : !screenshareStream,
      })}
    >
      <main className={styles.main}>
        <VideoStreams />
        {!isMobile && <LayoutSwitcher />}
      </main>
      <Footer />
      {isMobile && isRecording && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              justifyContent: 'space-between',
              background:
                'linear-gradient(to top, rgb(0 0 0 / 40%), rgb(0 0 0 / 0%) 120px)',
              padding: 16,
              pointerEvents: 'auto',
              borderRadius: 8,
            }}
          >
            <Typography variant="subtitle2" style={{ color: 'white' }}>
              {formatDuration(stopWatch.elapsed)}
            </Typography>
            <div style={{ display: 'flex', gap: 8 }}>
              <Tooltip title={isPaused ? 'Resume' : 'Pause'}>
                <IconButton
                  color={isPaused ? 'primary' : 'default'}
                  onClick={() => {
                    if (isPaused) {
                      resumeRecording();
                      stopWatch.start();
                    } else {
                      stopWatch.stop();
                      pauseRecording();
                    }
                  }}
                >
                  {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Stop">
                <IconButton
                  color={isPaused ? 'default' : 'primary'}
                  onClick={stopRecording}
                >
                  <StopIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      )}
      {pipWindow && <PiPWindow pipWindow={pipWindow} />}
    </div>
  );
};

export default App;
