import React, {FC, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {LANGUAGE} from '../types/commonTypes';
import useLanguage from '../hooks/settings/useLanguage';

const LangSetter: FC = ({children}) => {
  const [language] = useLanguage();
  const {i18n} = useTranslation();

  const sourceLang = i18n.resolvedLanguage;
  const targetLang = LANGUAGE[language];
  const sameLang = sourceLang === targetLang;

  useEffect(() => {
    if (!sameLang) {
      i18n.changeLanguage(targetLang);
    }
  }, [sameLang]);

  return <>{children}</>;
};

export default LangSetter;
