import Weather from './weather.jsx';

const Country = ({ country }) => {
    return (
      <div>
        <h1>{country.name.common}</h1>
        <br />
        <div>capital {country.capital}</div>
        <div>area {country.area}</div>
        <h2>languages:</h2>
        <ul>
          {Object.keys(country.languages).map((languageKey) => (
            <li key={languageKey}>{country.languages[languageKey]}</li>
          ))}
        </ul>
        <div style={{ fontSize: '300px' }}>{country.flag}</div>
        <Weather capital={country.capital} />
      </div>
    );
};

export default Country;
