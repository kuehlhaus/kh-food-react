import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';

import { PaperClipIcon } from '@heroicons/react/20/solid';

function Foodspot() {
  const location = useLocation();

  const new_query = `
  {
    foodspot(idType: ID, id: "${location.state.id}") {
      id
      link
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

  // console.log(data);

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
    <div className="overflow-hidden bg-white shadow sm:rounded-lg lg:w-[50%] mx-auto">
      <div className="px-4 py-5 sm:px-6">
        <h1 className="text-lg font-medium leading-6 text-gray-900">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">...</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Bewertung</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {bewertung}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Preisklasse</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {preisklasse}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Delivery</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {delivery == true ? 'true' : 'false'}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Adresse</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {adresse}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Telefon</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {telefon}
            </dd>
          </div>

          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Offnungszeiten
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {offnungszeiten}
            </dd>
          </div>

          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Maps Link</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {mapsLink}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default Foodspot;
