import React, { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { json, Link } from 'react-router-dom';
import { useState } from 'react';

const new_query = `
{
  foodspots {
    edges {
      node {
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
    }
  }
}
`;

function Home() {
  let [filter, setFilter] = useState({
    delivery: false,
    dineIn: false,
    takeout: false,
    preisklasse: 0,
  });

  let [isFilterActive, setIsFilterActive] = useState();
  let [resultArray, setResultArray] = useState([]);

  let ref = useRef([]);
  let radioBtns = ref.current.elements;

  let setFilterOff = () => {
    filter.delivery = false;
    filter.dineIn = false;
    filter.takeout = false;
    setResultArray([]);
    filterRadioBtnOff();
  };

  let filterRadioBtnOff = () => {
    for (let key in radioBtns) {
      if (radioBtns[key].hasOwnProperty('checked')) {
        radioBtns[key].checked = false;
      }
    }
  };

  useEffect(() => {
    setIsFilterActive(resultArray.length ? true : false);
  }, [resultArray]);

  const { data, isLoading, error } = useQuery('foodspots', () => {
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

  if (isLoading) {
    return 'Loading';
  }
  if (error) {
    return 'Error';
  }

  let dataArray = data.foodspots.edges;

  let filterToggle = (event) => {
    for (let key in filter) {
      if (event.target.value === key && event.target.type === 'button') {
        filter[key] = !filter[key];
      }
      if (event.target.value === key && event.target.type === 'radio') {
        filter[key] = parseInt(event.target.attributes.preisklasse.value);
      }
    }

    itemsArrayCheck();
    itemsFilter(event);

    setFilter({ ...filter });
  };

  // - Step 1
  // - add filtered items to itemsArray
  let itemsArray = [];
  let itemsArrayCheck = (event) => {
    dataArray.map((item, index) => {
      let newItem = {
        id: item.node.id,
        title: item.node.title,
        delivery: item.node.foodspot_daten.delivery,
        dineIn: item.node.foodspot_daten.dineIn,
        takeout: item.node.foodspot_daten.takeout,
        preisklasse: item.node.foodspot_daten.preisklasse,
      };

      for (let key in filter) {
        if (filter[key] && item.node.foodspot_daten[key] === filter[key]) {
          // for in не подходит, надо чтоб итерировал каждый объект массива и проверил значения

          if (itemsArray.length === 0) {
            itemsArray.push(newItem);
          }

          let obj = itemsArray.find((element) => {
            return element.title === item.node.title;
          });

          if (obj === undefined) {
            itemsArray.push(newItem);
          }
        }
      }
    });
  };

  // - Step 2
  // - check items by filters
  let itemsFilter = (event) => {
    let filtered = [];
    itemsArray.map((item) => {
      let checkAllFilters = [];

      for (let key in filter) {
        if (filter[key] && filter[key] === item[key]) {
          checkAllFilters.push(true);
        } else if (filter[key] && filter[key] !== item[key]) {
          checkAllFilters.push(false);
        }
      }

      return checkAllFilters.includes(false) ? '' : filtered.push(item);
    });

    setResultArray([...filtered]);
  };

  let FoodspotsList = () => {
    if (isFilterActive) {
      return resultArray.map((item) => {
        return (
          <Link
            to={`/foodspot/` + item.id}
            state={{ id: item.id }}
            key={item.id}
          >
            <li className="flex p-5 mt-5 border border-b-gray-200">
              <div>
                <p className="text-xl">{item.title}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <div className="mr-3">
                    Delivery: {JSON.stringify(item.delivery)}
                  </div>
                  <div className="mr-3">
                    DineIn: {JSON.stringify(item.dineIn)}
                  </div>
                  <div className="mr-3">
                    Takeout: {JSON.stringify(item.takeout)}
                  </div>
                  <div className="mr-3">
                    Preisklasse: {JSON.stringify(item.preisklasse)}
                  </div>
                </div>
              </div>
            </li>
          </Link>
        );
      });
    } else {
      return dataArray.map((item) => {
        return (
          <Link
            to={`/foodspot/` + item.node.id}
            state={{ id: item.node.id }}
            key={item.node.id}
          >
            <li className="flex p-5 mt-5 border border-b-gray-200">
              <div>
                <p className="text-xl">{item.node.title}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <div className="mr-3">
                    Delivery:{' '}
                    {JSON.stringify(item.node.foodspot_daten.delivery)}
                  </div>
                  <div className="mr-3">
                    DineIn: {JSON.stringify(item.node.foodspot_daten.dineIn)}
                  </div>
                  <div className="mr-3">
                    Takeout: {JSON.stringify(item.node.foodspot_daten.takeout)}
                  </div>
                  <div className="mr-3">
                    Preisklasse:{' '}
                    {JSON.stringify(item.node.foodspot_daten.preisklasse)}
                  </div>
                </div>
              </div>
            </li>
          </Link>
        );
      });
    }
  };

  return (
    <div>
      <div className="flex justify-center my-[30px]">
        <div className="filterButtons ">
          <span className="font-bold">Filter</span>
          <button
            className={filter.delivery ? 'filterButtonActive' : 'filterButton'}
            onClick={(event) => {
              filterToggle(event);
            }}
            value="delivery"
            type="button"
          >
            Delivery
          </button>

          <button
            className={filter.dineIn ? 'filterButtonActive' : 'filterButton'}
            onClick={(event) => {
              filterToggle(event);
            }}
            value="dineIn"
            type="button"
          >
            DineIn
          </button>

          <button
            className={filter.takeout ? 'filterButtonActive' : 'filterButton'}
            onClick={(event) => filterToggle(event)}
            value="takeout"
            type="button"
          >
            Takeout
          </button>

          <fieldset className="mt-5" ref={ref}>
            <legend>Preisklasse</legend>
            <label htmlFor="pk-1">
              <input
                className="mr-2"
                onClick={(event) => filterToggle(event)}
                value="preisklasse"
                type="radio"
                preisklasse="1"
                id="pk-1"
                name="qq"
              />
              Klasse 1
            </label>
            <br />
            <label htmlFor="pk-2">
              <input
                className="mr-2"
                onClick={(event) => filterToggle(event)}
                value="preisklasse"
                type="radio"
                preisklasse="2"
                id="pk-2"
                name="qq"
              />
              Klasse 2
            </label>
          </fieldset>
          <button
            className={!isFilterActive ? 'filterButtonOff' : 'filterButtonOff'}
            disabled={!isFilterActive}
            onClick={() => {
              setFilterOff();
            }}
          >
            Filter Löschen
          </button>
        </div>

        <div className="foodspotslist w-[600px] box-border ml-[30px]">
          <h1 className="font-bold text-xl">Foodspots</h1>
          <ul>
            <FoodspotsList />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
