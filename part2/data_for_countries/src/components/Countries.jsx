
import View from './View';

const Button = ({countries, country, handleToggleView}) => {
    if(countries.some((countryToView) => countryToView.ccn3 === country.ccn3)){
        return <button onClick={() => handleToggleView(country.ccn3)}>hide</button>
    } else {
        return <button onClick={() => handleToggleView(country.ccn3)}>show</button>
    }
}


const Country = ({countriesToView, country, shouldDetail, handleToggleView}) => {
    if(!shouldDetail){
        if(countriesToView.some((countryToView) => countryToView.ccn3 === country.ccn3)){
            return <li key={country.ccn3}>
            <View country={country} /><Button countries={countriesToView} country={country} handleToggleView={handleToggleView}/>
        </li>
        }
        return <li key={country.ccn3}>
            <div>{country.name.common}</div><Button countries={countriesToView} country={country} handleToggleView={handleToggleView}/>
        </li>
    } else {
        return <li key={country.ccn3}>
            <View country={country} />
        </li>
    }
}
const Countries = ({countriesToView, countries, handleToggleView}) => {
    if(countries.length > 10){
        return <div>
            Too many matches, specify another filter
        </div>
    } else if (countries.length > 1){
        return <ul>
            {countries.map((country) => {
                return <Country countriesToView={countriesToView} country={country} shouldDetail={false} handleToggleView={handleToggleView}/>
            })}
        </ul>
    } else if(countries.length === 1){
        return <ul>
            {countries.map((country) => {
                console.log(country)
                return <Country countriesToView={countriesToView} country={country} shouldDetail={true} handleToggleView={handleToggleView}/>
            })}
        </ul>
    } else {
        return <div>No country searched for</div>
    }
}

export default Countries