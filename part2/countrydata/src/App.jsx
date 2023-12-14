import { useEffect, useState } from 'react';
import country from './services/country.jsx';
import SearchForm from './components/searchform.jsx';
import CountriesToShow from './components/countriestoshow.jsx';


function App() {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    country.getAll().then((initialCountries) => setCountries(initialCountries));
  }, []);

  const handleChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    if (newQuery === ''){
        country.getAll().then((initialCountries) => setCountries(initialCountries));
      }
  };


  return (
    <div>
      <SearchForm query={query} handleChange={handleChange} />
      <CountriesToShow countries={countries} query={query} setCountries={setCountries} />
    </div>
  );
}

export default App;