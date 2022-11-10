import React from 'react';
import {HashRouter, Route, Routes, useParams} from 'react-router-dom';
import i18n from 'i18next';
import {Outlet, Navigate} from 'react-router-dom';
import MapView from '../views/Map';
import Layout from '../components/Layout';

const LangSetter = () => {
  const {lang} = useParams();
  if (i18n.resolvedLanguage !== lang) {
    i18n.changeLanguage(lang);
  }
  return <Outlet/>;
};

const AppRoutes = () =>
  <HashRouter>
    <Routes>
      <Route path=":lang" element={<LangSetter/>}>
        <Route exact path="" element={<Navigate to="map"/>}/>
        <Route exact path="map" element={<MapView/>}/>
        <Route path="*" element={<Layout sidePanelContent={<></>} mainContent={<>404 - Not Found</>} isSidePanelOpen={false} onToggleSidePanel={() => {}}/>}/>
      </Route>
      <Route path="*" element={<Navigate to={i18n.resolvedLanguage}/>}/>
    </Routes>
  </HashRouter>;

export default AppRoutes;
