import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    onClickCategory,
    onClickRating,
    clearFilterClicked,
    onSearchChange,
    rating,
    category,
  } = props

  const onClickedCategory = categoryId => {
    onClickCategory(categoryId)
  }

  const onClickedRating = ratingId => {
    onClickRating(ratingId)
  }

  const clearFilter = () => {
    clearFilterClicked()
  }

  const handleSearchChange = event => {
    if (event.key === 'Enter') {
      onSearchChange(event.target.value)
    }
  }
  return (
    <div className="filters-group-container">
      <div className="searchBox">
        <input
          className="search__input"
          type="search"
          placeholder="Search"
          onKeyPress={handleSearchChange} // onChange replaced with onKeyPress
        />
        <BsSearch className="search-icon" />
      </div>
      <h1 className="cat-heading">Category</h1>
      <ul className="category-ul">
        {categoryOptions.map(eachOne => {
          const style = eachOne.categoryId === category ? 'styled' : ''
          return (
            <li className="category-name" key={eachOne.categoryId}>
              <button
                type="button"
                className={`btn1 ${style}`}
                onClick={() => onClickedCategory(eachOne.categoryId)}
              >
                {eachOne.name}
              </button>
            </li>
          )
        })}
      </ul>
      <p className="cat-heading">Rating</p>
      <ul className="category-ul">
        {ratingsList.map(eachItem => {
          const style = eachItem.ratingId === rating ? 'styled' : ''
          return (
            <li
              className="category-name rating-one"
              onClick={() => onClickedRating(eachItem.ratingId)}
              key={eachItem.ratingId}
            >
              <img
                src={eachItem.imageUrl}
                alt="eachItem"
                className="rating-images"
              />
              <span className={`${style}`}>& up</span>
            </li>
          )
        })}
      </ul>
      <button onClick={clearFilter} className="clear-filter">
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
