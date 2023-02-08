import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import Filter from '../components/Filter';
import Pagination from '../components/Pagination';

function Home() {
  let [dataArray, setDataArray] = useState([]);

  // Filter
  let [filter, setFilter] = useState({
    delivery: false,
    dineIn: false,
    takeout: false,
    preisklasse: 0,
  });
  let [isFilterActive, setIsFilterActive] = useState();
  let [filteredArray, setFilteredArray] = useState([]);

  // Pagination
  let [currentPage, setCurrentPage] = useState(1);
  let [recordsPerPage, setRecordsPerPage] = useState(2);
  let [currentRecords, setCurrentRecords] = useState([]);
  let [nPages, setNPages] = useState(0);
  let indexOfLastRecord = currentPage * recordsPerPage;
  let indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  useEffect(() => {
    setIsFilterActive(filteredArray.length ? true : false);
  }, [filteredArray]);

  useEffect(() => {
    if (isFilterActive) {
      setCurrentRecords(
        filteredArray.slice(indexOfFirstRecord, indexOfLastRecord)
      );
    } else {
      setCurrentRecords(dataArray.slice(indexOfFirstRecord, indexOfLastRecord));
    }
  }, [filter, currentPage, isFilterActive, recordsPerPage, nPages]);

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

  return (
    <div className="contentWrapper max-w-[1915px] mx-auto my-[100px] flex px-[100px]">
      <Filter
        isFilterActive={isFilterActive}
        filter={filter}
        setRecordsPerPage={setRecordsPerPage}
        setCurrentPage={setCurrentPage}
        setFilteredArray={setFilteredArray}
        setFilter={setFilter}
        dataArray={dataArray}
      />

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

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isFilterActive={isFilterActive}
            recordsPerPage={recordsPerPage}
            filteredArray={filteredArray}
            dataArray={dataArray}
            nPages={nPages}
            setNPages={setNPages}
            filter={filter}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
