import VideocamOffIcon from '@mui/icons-material/VideocamOffOutlined';
import VideocamIcon from '@mui/icons-material/VideocamOutlined';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

import DeviceSelect from 'components/DeviceSelect';
import { useMediaDevices } from 'contexts/mediaDevices';
import { useFeatureSupport } from 'contexts/featureSupport';

const CameraSelect = () => {
  const {
    cameras,
    cameraId,
    cameraEnabled,
    setPreferredCamera,
    setCameraEnabled,
  } = useMediaDevices();
  const { isSupported } = useFeatureSupport();
  const mediaSupported = isSupported('getUserMedia');

  return (
    <DeviceSelect
      startAdornment={
        mediaSupported ? (
          cameras.length && cameraEnabled ? (
            <VideocamIcon onClick={() => setCameraEnabled(false)} />
          ) : (
            <VideocamOffIcon
              onClick={() => cameras.length && setCameraEnabled(true)}
            />
          )
        ) : (
          <Tooltip title="Camera access not supported on this device">
            <span>
              <VideocamOffIcon />
            </span>
          </Tooltip>
        )
      }
      value={cameraId}
      onChange={(event) => setPreferredCamera(event.target.value)}
      disabled={!mediaSupported}
    >
      {cameras.length ? (
        cameras.map((camera) => (
          <MenuItem key={camera.deviceId} value={camera.deviceId}>
            {camera.label}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled value="">
          No cameras available
        </MenuItem>
      )}
    </DeviceSelect>
  );
};

export default CameraSelect;
