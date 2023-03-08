import React, {FC} from 'react';
import {useSettings} from '../hooks/useSettings';
import {useTranslation} from 'react-i18next';
import {LANGUAGE} from '../types/commonTypes';


const LangSetter: FC = ({children}) => {
  const {language} = useSettings();
  const {i18n} = useTranslation();

  console.log('i18n.resolvedLanguage', i18n.resolvedLanguage);
  console.log('LANGUAGE[language]', LANGUAGE[language]);

  if (i18n.resolvedLanguage !== LANGUAGE[language]) {
    i18n.changeLanguage(LANGUAGE[language]);
  }
  return <>{children}</>;
};

export default LangSetter;