import React, {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const apiStatus = {
  noItems: 'NOITEMS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    apiStat: apiStatus.inProgress,
    activeOptionId: sortbyOptions[0].optionId,
    rating: '',
    category: '',
    titleSearch: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStat: apiStatus.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {activeOptionId, rating, category, titleSearch} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${titleSearch}&rating=${rating}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        this.setState({
          productsList: updatedData,
          apiStat:
            updatedData.length === 0 ? apiStatus.noItems : apiStatus.success,
        })
      } else {
        this.setState({
          apiStat: apiStatus.failure,
        })
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      this.setState({
        apiStat: apiStatus.failure,
      })
    }
  }

  onClickCategory = id => {
    this.setState({category: id}, this.getProducts)
  }

  onClickRating = rating => {
    this.setState({rating}, this.getProducts)
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => {
    return (
      <div className="no-items">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
          alt="products failure"
          className="no-item-image"
        />
        <h1 className="opps">Oops! Something Went Wrong</h1>
        <p>
          We are having some trouble processing your request <br />
          Please try again
        </p>
      </div>
    )
  }

  noItemsView = () => {
    return (
      <div className="no-items">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          alt="no products"
          className="no-item-image"
        />
        <h1>No Products Found</h1>
        <p>We could not find any products Try other filters</p>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onSearchChange = titleSearch => {
    this.setState({titleSearch}, this.getProducts)
  }

  clearFilterClicked = () => {
    this.setState(
      {
        activeOptionId: sortbyOptions[0].optionId,
        rating: '',
        category: '',
        titleSearch: '',
      },
      this.getProducts,
    )
  }

  render() {
    const {apiStat, rating, category} = this.state

    return (
      <div className="all-products-section">
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          onClickCategory={this.onClickCategory}
          onClickRating={this.onClickRating}
          clearFilterClicked={this.clearFilterClicked}
          onSearchChange={this.onSearchChange}
          rating={rating}
          category={category}
        />

        {(() => {
          switch (apiStat) {
            case apiStatus.success:
              return this.renderProductsList()
            case apiStatus.failure:
              return this.renderFailureView()
            case apiStatus.noItems:
              return this.noItemsView()
            case apiStatus.inProgress:
              return this.renderLoader()
            default:
              return null
          }
        })()}
      </div>
    )
  }
}

export default AllProductsSection
