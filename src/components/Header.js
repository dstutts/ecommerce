import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
    constructor() {
      super();
      //renderHeader = this.renderHeader.bind(this);
    
    }
    render() {
      return (
        <div>
        <div className='nav'>
                <div className='nav-wrapper'>
                    <ul>
                        <li>
                            <Link to="/products">Products</Link>
                        </li>
                        <li>
                            <Link to="/orders">Orders</Link>
                        </li>
                        <li>
                            <a href="" onClick={(e) => this.props.handleBuy(e)}>Buy</a>
                        </li>
                        <input className='search' type='text' placeholder='Search Orders..' onChange={(e) => this.props.handleSearchInput(e)} value={this.props.search} />
                        <Link to='/orders/:orderID'>
                            <button type="button" onClick={() => {this.props.handleOrderSearch(this.props.order)}}>
                                Search
                            </button>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
      );
    }
  }

  export default Header;