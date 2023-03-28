import React, {FC} from 'react';
import SettingsDialog from '../components/common/SettingsDialog';
import useGpsPositionColor from '../hooks/settings/useGpsPositionColor';
import useTrackTolerance from '../hooks/settings/useTrackTolerance';
import useIsLeftHanded from '../hooks/settings/useIsLeftHanded';
import useIsLargeSize from '../hooks/settings/useIsLargeSize';
import useColorPalette from '../hooks/settings/useColorPalette';
import useLanguage from '../hooks/settings/useLanguage';

export type SettingsViewProps = {
  onClose: () => void,
};
const SettingsView: FC<SettingsViewProps> = ({onClose}) => {
  const [gpsPositionColor, setGpsPositionColor] = useGpsPositionColor();
  const [trackTolerance, setTrackTolerance] = useTrackTolerance();
  const [isLeftHanded, setLeftHanded] = useIsLeftHanded();
  const [isLargeSize, setLargeSize] = useIsLargeSize();
  const [colorPalette, setColorPalette] = useColorPalette();
  const [language, setLanguage] = useLanguage();

  return <SettingsDialog
    gpsPositionColor={gpsPositionColor} onGpsPositionColorChange={setGpsPositionColor}
    trackTolerance={trackTolerance} onTrackToleranceChange={setTrackTolerance}
    isLeftHanded={isLeftHanded} onLeftHandedChange={setLeftHanded}
    isLargeSize={isLargeSize} onButtonSizeChange={setLargeSize}
    colorPalette={colorPalette} onColorPaletteChange={setColorPalette}
    language={language} onLanguageChange={setLanguage}
    onClose={onClose}
  />;
};

export default SettingsView;
