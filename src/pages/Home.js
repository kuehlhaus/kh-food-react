import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

function Home() {
  let [filter, setFilter] = useState({
    delivery: false,
    dineIn: false,
    takeout: false,
    preisklasse: 0,
  });

  let [isFilterActive, setIsFilterActive] = useState();
  let [filteredArray, setFilteredArray] = useState([]);
  let [dataArray, setDataArray] = useState([]);
  let [currentPage, setCurrentPage] = useState(1);
  let [recordsPerPage, setRecordsPerPage] = useState(1);
  let ref = useRef([]);

  useEffect(() => {
    setIsFilterActive(filteredArray.length ? true : false);
  }, [filteredArray]);

  const { data, isLoading, error } = useQuery('foodspots', () => {
    return fetch('https://api.kuehlhaus-food.de/wp/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
        foodspots{
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
      }`,
      }),
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

  dataArray = data.foodspots.edges.map((item) => {
    return {
      id: item.node.id,
      title: item.node.title,
      delivery: item.node.foodspot_daten.delivery,
      dineIn: item.node.foodspot_daten.dineIn,
      takeout: item.node.foodspot_daten.takeout,
      preisklasse: item.node.foodspot_daten.preisklasse,
    };
  });

  let filterToggle = (event) => {
    for (let key in filter) {
      if (event.target.value === key && event.target.type === 'button') {
        filter[key] = !filter[key];
      }
      if (event.target.value === key && event.target.type === 'radio') {
        filter[key] = parseInt(event.target.attributes.preisklasse.value);
      }
    }

    ref.current = event.target;

    itemsArrayCheck();
    itemsFilter();
    setCurrentPage(1);
    setFilter({ ...filter });
  };

  let setFilterOff = () => {
    filter.delivery = false;
    filter.dineIn = false;
    filter.takeout = false;
    filter.preisklasse = 0;
    ref.current.checked = false;
    setCurrentPage(1);
    setFilteredArray([]);
  };

  // - Step 1
  // - add filtered items to itemsArray
  let itemsArray = [];
  let itemsArrayCheck = () => {
    dataArray.forEach((item) => {
      for (let key in filter) {
        if (filter[key] && item[key] === filter[key]) {
          if (itemsArray.length === 0) {
            itemsArray.push(item);
          }
          let obj = itemsArray.find((element) => {
            return element.title === item.title;
          });
          if (obj === undefined) {
            itemsArray.push(item);
          }
        }
      }
    });
  };

  // - Step 2
  // - check items by filters
  let itemsFilter = () => {
    let filtered = [];
    itemsArray.forEach((item) => {
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

    if (filtered.length > 0) {
      setFilteredArray([...filtered]);
    }
  };

  // Pagination
  let indexOfLastRecord = currentPage * recordsPerPage;
  let indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  let currentRecords;
  let nPages;

  if (isFilterActive) {
    currentRecords = filteredArray.slice(indexOfFirstRecord, indexOfLastRecord);
    nPages = Math.ceil(filteredArray.length / recordsPerPage);
  } else {
    currentRecords = dataArray.slice(indexOfFirstRecord, indexOfLastRecord);
    nPages = Math.ceil(dataArray.length / recordsPerPage);
  }

  let pageNumbers = [...Array(nPages + 1).keys()].slice(1);

  let nextPage = () => {
    if (currentPage !== nPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  let prevPage = (event) => {
    if (currentPage !== (0 || 1)) {
      setCurrentPage(currentPage - 1);
    }
  };
  // Pagination

  let Foodspots = () => {
    return currentRecords.map((item, index) => {
      return (
        <Link to={`/foodspot/` + item.id} state={item.id} key={item.id}>
          <li key={index}>{item.title}</li>
        </Link>
      );
    });
  };

  return (
    <div className="flex justify-center my-[30px]">
      <div className="filter-section">
        <div className="filter-buttons">
          <span>Filter</span>
          <button
            className={filter.delivery ? 'filterButtonActive' : 'filterButton'}
            onClick={(event) => filterToggle(event)}
            value="delivery"
            type="button"
          >
            Delivery
          </button>
          <button
            className={filter.dineIn ? 'filterButtonActive' : 'filterButton'}
            onClick={(event) => filterToggle(event)}
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
          <fieldset>
            <legend>Preisklasse</legend>
            <label htmlFor="pk-1">
              <input
                onClick={(event) => filterToggle(event)}
                value="preisklasse"
                type="radio"
                preisklasse="1"
                id="pk-1"
                name="qq"
              />
              Klasse 1
            </label>
            <label htmlFor="pk-2">
              <input
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
            className="filterButtonOff"
            disabled={!isFilterActive}
            onClick={() => setFilterOff()}
          >
            Filter Löschen
          </button>
        </div>
      </div>
      <div className="foodspots-section">
        <div className="foodspots-section-title">
          <h1>Foodspots</h1>
          <label>
            <select onChange={(e) => setRecordsPerPage(e.target.value)}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </label>
        </div>

        <ul>
          <Foodspots />
        </ul>
        <div className="pagination-section">
          <button
            onClick={(event) => prevPage(event)}
            disabled={currentPage === (0 || 1) ? true : false}
          >
            Prev
          </button>

          <div>
            {pageNumbers.map((page, index) => {
              return (
                <i
                  key={index}
                  className={page === currentPage ? 'font-bold' : ''}
                >
                  {page}
                </i>
              );
            })}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === nPages ? true : false}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
