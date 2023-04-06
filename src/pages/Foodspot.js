import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import mapImg from '../assets/img/map1.svg';
import parse from 'html-react-parser';
import MediaQuery from 'react-responsive';
import bewertungMobile from '../assets/img/bewertungMobile.svg';

function Foodspot() {
  let location = useLocation();
  let id = location.pathname.replace('/foodspot/', '');

  const new_query = `
  {
    foodspot(idType: ID, id: "${id}") {
      title
      foodspot_daten {
        adresse
        bewertung
        dineIn
        delivery
        homepage
        mapsLink
        offnungszeiten
        placeId
        preisklasse
        takeout
        telefon
      }
    }
  }`;

  const { data, isLoading, error } = useQuery('foodspot', () => {
    return fetch('https://api.kuehlhaus-food.de/wp/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: new_query }),
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error('Error fetching data');
        } else {
          return response.json();
        }
      })
      .then((data) => data.data);
  });

  if (isLoading) return 'Loading...';
  if (error) return error.message;

  if (!data.foodspot) {
    return 'Oops...';
  }

  const { title } = data.foodspot;
  let {
    adresse,
    bewertung,
    delivery,
    mapsLink,
    offnungszeiten,
    preisklasse,
    telefon,
    dineIn,
    takeout,
  } = data.foodspot.foodspot_daten;

  document.title = `${title} | kuehlhaus Food`;

  offnungszeiten = offnungszeiten
    .replaceAll(/p/g, 'li')
    .replaceAll('<br />', '</li><li>');

  return (
    <>
      <Header
        title={title}
        adresse={adresse}
        preisklasse={preisklasse}
        bewertung={bewertung}
      />
      <div className="foodspotWrapper">
        <div className="foodspot">
          <MediaQuery maxWidth={1023}>
            <div className="foodspotRatingSection">
              <img src={bewertungMobile} alt="bewertung" />
              <p>{bewertung}</p>
            </div>
          </MediaQuery>
          <div className="foodspotFilterSection">
            <span className={delivery ? 'delivery on' : 'delivery off'}>
              <p>Delivery</p>
            </span>
            <span className={dineIn ? 'dineIn on' : 'dineIn off'}>
              <p>DineIn</p>
            </span>
            <span className={takeout ? 'takeout on' : 'takeout off'}>
              <p>Takeout</p>
            </span>
          </div>

          <div className="foodspotDescriptionSection">
            <div>
              <span>Öffnungszeiten</span>
              <ul>{parse(offnungszeiten)}</ul>
            </div>
            <div>
              <span>Kontakt</span>
              <b>{title}</b>
              <p>
                <em>Adresse:</em> {adresse}
              </p>
              <p>
                <em>Telefon:</em> {telefon}
              </p>
              <div>
                <img src={mapImg} alt="map" />
                <a href={mapsLink} target="_blank">
                  Auf Google Maps finden
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Foodspot;
