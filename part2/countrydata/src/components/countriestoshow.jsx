import Country from './country.jsx';


const CountriesToShow = ({ countries, query, setCountries }) => {
    const filteredCountries = countries.filter((country) =>
      country.name.common.toLowerCase().startsWith(query.toLowerCase(), 0)
    );
  
    const handleShowCountry = (country) => {
      setCountries([country]);
    };
  
    if (query && filteredCountries.length > 10) {
      return <div>Too many matches, specify another filter</div>;
    } else if (query && filteredCountries.length > 1 && filteredCountries.length <= 10) {
      return (
        <div>
          {filteredCountries.map((country) => (
            <div key={country.name.common}>
              {country.name.common}
              <button onClick={() => handleShowCountry(country)}>show</button>
            </div>
          ))}
        </div>
      );
    } else if (query && filteredCountries.length === 1) {
      return <Country country={filteredCountries[0]} />;
    } else {
      return (
        <div>
          {countries.map((country) => (
            <div key={country.name.common}>{country.name.common}</div>
          ))}
        </div>
      );
    }
  };

export default CountriesToShow