import React, { useRef } from 'react';

function Filter({
  isFilterActive,
  filter,
  setRecordsPerPage,
  setCurrentPage,
  setFilteredArray,
  setFilter,
  dataArray,
}) {
  let ref = useRef([]);

  let setFilterOff = () => {
    filter.delivery = false;
    filter.dineIn = false;
    filter.takeout = false;
    filter.preisklasse = 0;
    ref.current.checked = false;
    setCurrentPage(1);
    setFilteredArray([]);
  };

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

    itemsArrayCheck();
    itemsFilter();
    setCurrentPage(1);
    setFilter({ ...filter });
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

  return (
    <div className="filterSection">
      <div className="filterWrap">
        <div className="filterSectionTitle">
          <span>Filter</span>
          <button
            className="filterButtonOff"
            disabled={!isFilterActive}
            onClick={() => setFilterOff()}
          >
            x Filter löschen
          </button>
        </div>

        <div className="filterCheckbox">
          <input type="checkbox" checked={filter.delivery} readOnly />
          <div></div>
          <span
            onClick={(event) => filterToggle(event)}
            name="delivery"
            value="delivery"
            className="btnImg"
            id="delivery"
          ></span>
        </div>

        <div className="filterCheckbox">
          <input type="checkbox" checked={filter.dineIn} readOnly />
          <div></div>
          <span
            onClick={(event) => filterToggle(event)}
            name="dineIn"
            value="dineIn"
            className="btnImg"
            id="dineIn"
          ></span>
        </div>

        <div className="filterCheckbox">
          <input type="checkbox" checked={filter.takeout} readOnly />
          <div></div>
          <span
            onClick={(event) => filterToggle(event)}
            name="takeout"
            value="takeout"
            className="btnImg"
            id="takeout"
          ></span>
        </div>
      </div>

      <div className="filterWrap">
        <div className="filterSectionTitle">
          <span>Preisklasse</span>
        </div>

        <div className="filterCheckbox">
          <input
            type="checkbox"
            checked={filter.preisklasse === 1 ? true : false}
            readOnly
          />
          <div></div>
          <span
            onClick={(event) => filterToggle(event)}
            name="preisklasse"
            value="1"
            id="pr1"
          ></span>
        </div>

        <div className="filterCheckbox">
          <input
            type="checkbox"
            checked={filter.preisklasse === 2 ? true : false}
            readOnly
          />
          <div></div>
          <span
            onClick={(event) => filterToggle(event)}
            name="preisklasse"
            value="2"
            id="pr2"
          ></span>
        </div>
      </div>

      <div className="filterWrap">
        <div className="filterSectionTitle">
          <span>Results</span>
        </div>

        <label>
          <select
            onChange={(e) => {
              setRecordsPerPage(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default Filter;
