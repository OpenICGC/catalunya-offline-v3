import React, {FC} from 'react';
import {useSettings} from '../hooks/useSettings';
import SettingsDialog from '../components/common/SettingsDialog';

const SettingsView: FC = () => {
  const {
    gpsPositionColor, trackTolerance, isLeftHanded, buttonSize, colorPalette, language,
    setGpsPositionColor, setTrackTolerance, setLeftHanded, setButtonSize, setColorPalette, setLanguage
  } = useSettings();

  return <SettingsDialog
    gpsPositionColor={gpsPositionColor} onGpsPositionColorChange={setGpsPositionColor}
    trackTolerance={trackTolerance} onTrackToleranceChange={setTrackTolerance}
    isLeftHanded={isLeftHanded} onLeftHandedChange={setLeftHanded}
    buttonSize={buttonSize} onButtonSizeChange={setButtonSize}
    colorPalette={colorPalette} onColorPaletteChange={setColorPalette}
    language={language} onLanguageChange={setLanguage}
  />;
};

export default SettingsView;
