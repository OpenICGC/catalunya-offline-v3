import React from 'react';
import {HashRouter, Route, Routes} from 'react-router-dom';
import {Navigate} from 'react-router-dom';
import MainView from '../views';
import Layout from '../components/Layout';



const AppRoutes = () =>
  <HashRouter>
    <Routes>
      <Route /*exact*/ path="" element={<Navigate to="map"/>}/>
      <Route /*exact*/ path="map" element={<MainView/>}/>
      <Route path="*" element={<Layout sidePanelContent={<></>} mainContent={<>404 - Not Found</>} isSidePanelOpen={false} onToggleSidePanel={() => undefined}/>}/>
    </Routes>
  </HashRouter>;

export default AppRoutes;
