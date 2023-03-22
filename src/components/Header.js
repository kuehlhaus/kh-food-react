import { Outlet, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Pebble from '../assets/img/Pebble.svg';
import logoMobile from '../assets/img/logoMobile.svg';
import headerLogoSmall from '../assets/img/headerLogoSmall.svg';
import headerHome from '../assets/img/headerHome.svg';
import MediaQuery from 'react-responsive';
import logoMobileSingle from '../assets/img/logoMobileSingle.svg';
import bewertungImg from '../assets/img/bewertung.svg';

export default function Header(props) {
  let { title, preisklasse, adresse, bewertung } = props;
  let location = useLocation();
  return (
    <>
      <header>
        <div className="header">
          {location.pathname === '/' ? (
            <>
              <MediaQuery maxWidth={1023}>
                <img className="headerBg" src={Pebble} />
                <img className="headerLogoSmallMobile" src={logoMobile} />
              </MediaQuery>
              <MediaQuery minWidth={1024}>
                <img className="headerBg" src={headerHome} />
                <img className="headerLogoSmall" src={headerLogoSmall} />
              </MediaQuery>
            </>
          ) : location.pathname.includes('/foodspot/') ? (
            <>
              <div className="titleWrapper">
                <MediaQuery maxWidth={1023}>
                  <span>
                    <Link to="/">&larr;</Link>
                  </span>
                </MediaQuery>

                <img className="headerLogoSmall" src={logoMobileSingle} />
                <div className="titleSection">
                  <div>
                    <div>
                      <img src={headerLogoSmall} />
                    </div>
                    <div>
                      <div>
                        <h1
                          className={
                            preisklasse === 1
                              ? 'preisklasse_1'
                              : preisklasse === 2
                              ? 'preisklasse_2'
                              : false
                          }
                        >
                          {title}
                        </h1>
                      </div>
                      <p>{adresse}</p>
                    </div>
                  </div>
                  <MediaQuery minWidth={1024}>
                    <div>
                      <img src={bewertungImg} alt="" />
                      {bewertung}
                    </div>
                  </MediaQuery>
                </div>
              </div>
            </>
          ) : (
            false
          )}
        </div>
      </header>

      {/* <Outlet />
      <Footer /> */}
    </>
  );
}
