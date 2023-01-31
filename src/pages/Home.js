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
  let [recordsPerPage, setRecordsPerPage] = useState(3);
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
      adresse: item.node.foodspot_daten.adresse,
    };
  });

  let filterToggle = (event) => {
    for (let key in filter) {
      if (event.target.attributes.name.value === key) {
        let dataType = parseInt(event.target.attributes.value.value);

        if (dataType && filter[key] != dataType) {
          filter[key] = dataType;
        } else if (dataType && filter[key] === dataType) {
          filter[key] = 0;
        } else {
          filter[key] = !filter[key];
        }
      }
    }

    ref.current = event.target;

    console.log(ref);

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

    filtered.length ? setFilteredArray([...filtered]) : setFilteredArray([]);
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

  return (
    <div className="contentWrapper max-w-[1915px] mx-auto my-[100px] flex px-[100px]">
      <div className="filterSection">
        <div>
          <span>Filter</span>
          <button
            className="filterButtonOff"
            disabled={!isFilterActive}
            onClick={() => setFilterOff()}
          >
            x Filter löschen
          </button>
        </div>

        <label className="filterCheckbox">
          <input type="checkbox" checked={filter.delivery} />
          <div></div>
          <p
            onClick={(event) => filterToggle(event)}
            name="delivery"
            value="delivery"
            className="btnImg"
            id="delivery"
          >
            Delivery
          </p>
        </label>

        <label className="filterCheckbox">
          <input type="checkbox" checked={filter.dineIn} />
          <div></div>
          <p
            onClick={(event) => filterToggle(event)}
            name="dineIn"
            value="dineIn"
            className="btnImg"
            id="dineIn"
          >
            DineIn
          </p>
        </label>

        <label className="filterCheckbox">
          <input type="checkbox" checked={filter.takeout} />
          <div></div>
          <p
            onClick={(event) => filterToggle(event)}
            name="takeout"
            value="takeout"
            className="btnImg"
            id="takeout"
          >
            Takeout
          </p>
        </label>

        <div className="mt-[45px]">
          <span>Preisklasse</span>
        </div>

        <label className="filterCheckbox">
          <input
            type="checkbox"
            checked={filter.preisklasse === 1 ? true : false}
          />
          <div></div>
          <p
            onClick={(event) => filterToggle(event)}
            name="preisklasse"
            value="1"
            className="ml-[20px]"
          >
            €
          </p>
        </label>

        <label className="filterCheckbox">
          <input
            type="checkbox"
            checked={filter.preisklasse === 2 ? true : false}
          />
          <div></div>
          <p
            onClick={(event) => filterToggle(event)}
            name="preisklasse"
            value="2"
            className="ml-[20px]"
          >
            €€
          </p>
        </label>

        <div className="mt-[45px]">
          <span>Results</span>
        </div>

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
      <div className="foodspotsSectionWrapper">
        <div className="foodspotsSection">
          <h2>Foodspots</h2>
          <ul>
            {currentRecords.map((item, index) => {
              return (
                <Link to={`/foodspot/` + item.id} state={item.id} key={item.id}>
                  <li key={index}>
                    <span id="foodspotTitle">
                      {item.title}
                      <em id={'preisklasse_' + item.preisklasse}></em>
                    </span>
                    <i>{item.adresse}</i>
                    <div>
                      <span
                        className={
                          item.delivery ? 'delivery on' : 'delivery off'
                        }
                      >
                        <p>Delivery</p>
                      </span>
                      <span
                        className={item.dineIn ? 'dineIn on' : 'dineIn off'}
                      >
                        <p>DineIn</p>
                      </span>
                      <span
                        className={item.takeout ? 'takeout on' : 'takeout off'}
                      >
                        <p>Takeout</p>
                      </span>
                    </div>
                  </li>
                </Link>
              );
            })}
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
                    className={page === currentPage ? 'pageActive' : ''}
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
    </div>
  );
}

export default Home;
