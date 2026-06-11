import { Routes, Route } from 'react-router-dom';

import Main from './pages/Main';
import Pad from './pages/Pad';

import ReactGA from 'react-ga4';
import { useEffect } from 'react';

const TRACKING_ID = 'G-Z33D84EBN9';

function Routers() {
  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    ReactGA.send({
      hitType: 'pageview',
      page: window.location.pathname,
      title: document.title,
    });
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Main />} />
      <Route path='/*' element={<Pad />} />
    </Routes>
  );
}

export default Routers;
