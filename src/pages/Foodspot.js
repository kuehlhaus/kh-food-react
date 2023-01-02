import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';

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
  } = data.foodspot.foodspot_daten;

  return (
    <div className="foodspot">
      <div className="foodspot-title">
        <h1>{title}</h1>
        <p>...</p>
      </div>
      <div className="foodspot-data-section">
        <dl>
          <div className="foodspot-data">
            <dt>Bewertung</dt>
            <dd>{bewertung}</dd>
          </div>
          <div className="foodspot-data">
            <dt>Preisklasse</dt>
            <dd>{preisklasse}</dd>
          </div>
          <div className="foodspot-data">
            <dt>Delivery</dt>
            <dd>{delivery === true ? 'true' : 'false'}</dd>
          </div>
          <div className="foodspot-data">
            <dt>Adresse</dt>
            <dd>{adresse}</dd>
          </div>
          <div className="foodspot-data">
            <dt>Telefon</dt>
            <dd>{telefon}</dd>
          </div>

          <div className="foodspot-data">
            <dt>Offnungszeiten</dt>
            <dd>{offnungszeiten}</dd>
          </div>

          <div className="foodspot-data">
            <dt>Maps Link</dt>
            <dd>{mapsLink}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default Foodspot;
