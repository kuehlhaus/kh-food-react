import { Outlet, Link } from 'react-router-dom';
import Pebble from '../assets/img/Pebble.svg';
import logoMobile from '../assets/img/logoMobile.svg';
import headerLogoSmall from '../assets/img/headerLogoSmall.svg';
import headerHome from '../assets/img/headerHome.svg';
import MediaQuery from 'react-responsive';
import Footer from './Footer';

export default function Header() {
  return (
    <>
      <header>
        <div className="headerHome">
          <MediaQuery maxWidth={1023}>
            <img className="headerBg" src={Pebble} />
            <img className="headerLogoSmallMobile" src={logoMobile} />
          </MediaQuery>
          <MediaQuery minWidth={1024}>
            <img className="headerBg" src={headerHome} />
            <img className="headerLogoSmall" src={headerLogoSmall} />
          </MediaQuery>
        </div>
      </header>

      <Outlet />
      <Footer />
    </>
  );
}
