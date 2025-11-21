import MicIcon from '@mui/icons-material/MicNone';
import MicOffIcon from '@mui/icons-material/MicOffOutlined';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

import DeviceSelect from 'components/DeviceSelect';
import { useMediaDevices } from 'contexts/mediaDevices';
import { useFeatureSupport } from 'contexts/featureSupport';

const MicrophoneSelect = () => {
  const {
    microphones,
    microphoneId,
    microphoneEnabled,
    setPreferredMicrophone,
    setMicrophoneEnabled,
  } = useMediaDevices();
  const { isSupported } = useFeatureSupport();
  const mediaSupported = isSupported('getUserMedia');

  return (
    <DeviceSelect
      startAdornment={
        mediaSupported ? (
          microphones.length && microphoneEnabled ? (
            <MicIcon onClick={() => setMicrophoneEnabled(false)} />
          ) : (
            <MicOffIcon onClick={() => setMicrophoneEnabled(true)} />
          )
        ) : (
          <Tooltip title="Microphone access not supported on this device">
            <span>
              <MicOffIcon />
            </span>
          </Tooltip>
        )
      }
      value={microphoneId}
      onChange={(event) => setPreferredMicrophone(event.target.value)}
      disabled={!mediaSupported}
    >
      {microphones.length ? (
        microphones.map((microphone) => (
          <MenuItem key={microphone.deviceId} value={microphone.deviceId}>
            {microphone.label}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled value="">
          No microphones available
        </MenuItem>
      )}
    </DeviceSelect>
  );
};

export default MicrophoneSelect;
