import CameraSelect from 'components/CameraSelect';
import MainRecordButton from 'components/MainRecordButton';
import MicrophoneSelect from 'components/MicrophoneSelect';
import TeleprompterSelect from 'components/TeleprompterSelect';
import { useFeatureSupport } from 'contexts/featureSupport';

import styles from './Footer.module.css';

const Footer = () => {
  const { isMobile } = useFeatureSupport();
  return (
    <footer className={styles.root}>
      <div>&nbsp;</div>
      <MainRecordButton />
      <div className={styles.devices}>
        <TeleprompterSelect />
        <MicrophoneSelect />
        {!isMobile && <CameraSelect />}
      </div>
    </footer>
  );
};

export default Footer;
