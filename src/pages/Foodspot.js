import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import mapImg from '../assets/img/map1.svg';

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
  const {
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
          <div>
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

          <div>
            <div>
              <span>Öffnungszeiten</span>
              <ul>{offnungszeiten}</ul>
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
                <img src={mapImg} alt="" />
                <a href="#">Auf Google Maps finden</a>
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
