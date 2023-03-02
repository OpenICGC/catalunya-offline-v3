import React, {FC} from 'react';
import {useSettings} from '../hooks/useSettings';
import SettingsDialog from '../components/common/SettingsDialog';

const SettingsView: FC = () => {
  const {
    gpsPositionColor, trackTolerance, isLeftHanded, isAccessibleSize, colorPalette, language,
    setGpsPositionColor, setTrackTolerance, setLeftHanded, setIsAccessibleSize, setColorPalette, setLanguage
  } = useSettings();

  return <SettingsDialog
    gpsPositionColor={gpsPositionColor} onGpsPositionColorChange={setGpsPositionColor}
    trackTolerance={trackTolerance} onTrackToleranceChange={setTrackTolerance}
    isLeftHanded={isLeftHanded} onLeftHandedChange={setLeftHanded}
    isAccessibleSize={isAccessibleSize} onButtonSizeChange={setIsAccessibleSize}
    colorPalette={colorPalette} onColorPaletteChange={setColorPalette}
    language={language} onLanguageChange={setLanguage}
  />;
};

export default SettingsView;
