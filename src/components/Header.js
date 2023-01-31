import { Outlet, Link } from 'react-router-dom';
import headerLogoSmall from '../assets/img/headerLogoSmall.svg';
import headerHome from '../assets/img/headerHome.svg';
import MediaQuery from 'react-responsive';
import Footer from './Footer';

export default function Header() {
  return (
    <div>
      <header>
        <div className="headerHome">
          <MediaQuery minWidth={1024}></MediaQuery>
          <img className="headerLogoSmall" src={headerLogoSmall} />
          <img src={headerHome} />
        </div>
      </header>

      <Outlet />
      <Footer />
    </div>
  );
}
