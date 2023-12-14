const SearchForm = ({ query, handleChange }) => {
    return (
      <form>
        <div>
          search countries <input value={query} onChange={handleChange} />
        </div>
      </form>
    );
  };

export default SearchForm