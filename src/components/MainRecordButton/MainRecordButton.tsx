import cx from 'classnames';

import RecordButton from 'components/RecordButton';
import { useCountdown } from 'contexts/countdown';
import { useLayout } from 'contexts/layout';
import { usePictureInPicture } from 'contexts/pictureInPicture';
import { useRecording } from 'contexts/recording';
import { useScreenshare } from 'contexts/screenshare';
import { useFeatureSupport } from 'contexts/featureSupport';

import styles from './MainRecordButton.module.css';

const MainRecordButton = () => {
  const { countingDown, setCountingDown } = useCountdown();
  const { layout } = useLayout();
  const { isRecording } = useRecording();
  const { pipWindow, requestPipWindow } = usePictureInPicture();
  const { startScreenshare } = useScreenshare();
  const { isMobile, isSupported } = useFeatureSupport();
  const { stopRecording, startRecording } = useRecording();

  return (
    <RecordButton
      className={cx(styles.root, { [styles.recording]: isRecording })}
      classes={{ icon: styles.icon }}
      onClick={async () => {
        if (countingDown) {
          return;
        }
        if (isRecording) {
          if (pipWindow) {
            pipWindow.close();
          } else {
            stopRecording();
          }
        } else if (pipWindow) {
          setCountingDown(true);
        } else if (layout === 'cameraOnly') {
          if (!isMobile && isSupported('pictureInPictureWindow')) {
            await requestPipWindow();
          } else {
            startRecording();
          }
        } else {
          const canScreenshare = isSupported('getDisplayMedia');
          if (!isMobile && isSupported('pictureInPictureWindow') && canScreenshare) {
            await startScreenshare();
          } else {
            startRecording();
          }
        }
      }}
    />
  );
};

export default MainRecordButton;
