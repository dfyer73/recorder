import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';

import { Layout, useLayout } from 'contexts/layout';
import { useFeatureSupport } from 'contexts/featureSupport';

import CameraOnlyIcon from './icons/CameraOnlyIcon';
import ScreenAndCameraIcon from './icons/ScreenAndCameraIcon';
import ScreenOnlyIcon from './icons/ScreenOnlyIcon';

import styles from './LayoutSwitcher.module.css';

const LayoutSwitcher = () => {
  const { layout, setLayout } = useLayout();
  const { isSupported } = useFeatureSupport();
  const screenshareSupported = isSupported('getDisplayMedia');

  return (
    <ToggleButtonGroup
      className={styles.root}
      exclusive
      value={layout}
      onChange={(_, layout: Layout | null) => {
        if (layout !== null) {
          setLayout(layout);
        }
      }}
    >
      <Tooltip title={screenshareSupported ? '' : 'Screenshare not supported on this device'}>
        <span>
          <ToggleButton value="screenOnly" disabled={!screenshareSupported}>
            <ScreenOnlyIcon />
            Screen only
          </ToggleButton>
        </span>
      </Tooltip>
      <Tooltip title={screenshareSupported ? '' : 'Screenshare not supported on this device'}>
        <span>
          <ToggleButton value="screenAndCamera" disabled={!screenshareSupported}>
            <ScreenAndCameraIcon />
            Screen and camera
          </ToggleButton>
        </span>
      </Tooltip>
      <ToggleButton value="cameraOnly">
        <CameraOnlyIcon />
        Camera only
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default LayoutSwitcher;
