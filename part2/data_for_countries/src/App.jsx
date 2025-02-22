import { useState, useEffect } from 'react';
import Countries from './components/Countries'
import Filter from './components/Filter'
import countryServices from './services/countries';

const App = () => {
  const [countries, setCountries] = useState([]) 
  const [countriesToView, setCountriesToView] = useState([]) 
  const [filter, setFilter] = useState('')

  useEffect(() => {
    countryServices.getAll()
     .then( initialCountries => {
      setCountries(initialCountries)
      })
  }, [])

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handToggleView = (id) => {
    const toView = countries.find((country) => country.ccn3 === id);
    if (toView) {
      if(!countriesToView.some((country) => country.ccn3 === toView.ccn3)){
        console.log("Viewing... ", toView.name.common)
        setCountriesToView(countriesToView.concat(toView))
      } else {
        console.log("hiding... ", toView.name.common)
        setCountriesToView(countriesToView.filter((country) => country.ccn3 !== toView.ccn3))
      }
    } else {
      console.log("Country with id is not there: ", id)
    }
    
  }

  return <div>
    <Filter filter={filter} handleFilterChange={handleFilterChange}/>
    <Countries countriesToView={countriesToView} countries={filteredCountries} handleToggleView={handToggleView}/>
  </div>
}

export default App