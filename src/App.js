import React, { Component } from 'react';
import './App.css';
import _ from 'lodash';
import Request from 'superagent';
import {
  BrowserRouter,
  Route
} from 'react-router-dom';

// App Components
import Header from './components/Header.js';
import Products from './components/Products.js';
import Orders from './components/Orders.js';
import Order from './components/Order.js';

class App extends Component {
  componentDidMount() {
    this.getProducts();
    this.getOrders();
  }
  constructor() {
    super();
    this.handleAddProduct = this.handleAddProduct.bind(this);
    this.handleBuy = this.handleBuy.bind(this);
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleOrderSearch = this.handleOrderSearch.bind(this);
    this.handleDeleteOrder = this.handleDeleteOrder.bind(this);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.state = {
      currentOrder: null,
      products: [],
      orders: [],
      orderDetails: [],
      cart: [],
      searchInput: ''
    };
  } 

  getProducts() {
    var url = 'http://localhost:3000';
    Request.get(url).then((response) => {
      this.setState({
        products: response.body
      });
    });
  }

  getOrders() {
    let url = 'http://localhost:3000/orders/';
    Request.get(url).then((response) => {
      this.setState({
        orders: response.body
      });
    });
  }

  handleOrderSearch() {
    let modOrders = _.get(this.state, 'orders');
    let currentSearch = _.get(this.state, 'searchInput')
    let url = `http://localhost:3000/orders/${currentSearch}`;
    Request.get(url).then((response) => {
      this.setState({
        orderDetails: response.body,
        currentOrder: currentSearch,
        searchInput: ''
      });
    });
  }
  
  handleSearchInput = (e) => {
    let userInput = e.target.value;
    let modSearch = _.get(this.state, 'searchInput');
    modSearch = userInput;
    this.setState({
      searchInput: modSearch
    });
  }

  handleAddProduct (product_id, event) {
    let cart = Object.assign({}, this.state);
    let modCart = cart.cart;
    modCart.push(product_id);
    this.setState({
      cart: modCart
    })
  }

  handleDeleteItem(event, index) {
    let itemID = parseInt(event.target.getAttribute('data-id'));
    let ordID = parseInt(event.target.getAttribute('data-order'));
    let prodPrice = parseInt(event.target.getAttribute('data-price'));
    let modOrderDet = _.get(this.state, 'orderDetails');
    let modOrders = _.get(this.state, 'orders');
    let price = 0;
    let quantity = 0;
    console.log(modOrderDet);
    modOrderDet.splice(index, 1);
    modOrders.map((order, index) => {
      if (order.orderID === ordID) {
        order.quantity--;
        order.total_price -= prodPrice;
        price = order.total_price;
        quantity = order.quantity;
      }
    });
    modOrderDet.map((order, index) => {
      order.price -= prodPrice;
      order.quantity--;
    });
    let url = `http://localhost:3000/orders/${itemID}`;
    Request.del(url)
      .send({
        itemID,
      })
      .end((error, response) => {
        if (error || !response.ok) {
        } else {
        }
          Request.put(url)
          .send({
            price,
            quantity
          })
          .end((error, response) => {
            if (error || !response.ok) {
            } else {
            }
            this.setState({
              orderDetails: modOrderDet,
              orders: modOrders
            });
          })
        })
      }

  handleDeleteOrder(event) {
    let ordID = parseInt(event.target.getAttribute('data-order'));
    let orders = _.get(this.state, 'orders');
    let url = `http://localhost:3000/orders`;
    Request.del(url)
      .send({
        ordID
      })
      .end((error, response) => {
        if (error || !response.ok) {
        } else {
        }
      this.setState({
        orderDetails: [],
        orders: this.getOrders()
      });
    });
  }

  handleBuy(e) {
    e.preventDefault();
    let quantity = 0, price = 0;
    let items = [];
    let obj = Object.assign({}, this.state)
    let order = obj.cart
    if (!order.length) {
      alert('Please select at least one product');
      return;  
    } else {
    order.map((item, index) => {
      price += item.product_price;
      quantity++;
      items.push(item.product_id);
    });
    }
    let url = 'http://localhost:3000/orders/';
    Request.post(url)
      .send({
        quantity,
        price,
        items
      })
      .end((error, response) => {
        if (error || !response.ok) {
        } else {
        }
        this.setState({
          cart: [],
          orders: this.getOrders()
        })
      });
    }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route path='/' render={ () => <Header
            order={this.state.orderDetails}
            cart={this.state.cart}
            search={this.state.searchInput}
            handleSearchInput={this.handleSearchInput}
            handleBuy={this.handleBuy}
            handleOrderSearch={this.handleOrderSearch}/>}
          />
          <Route path='/products' render={() => <Products 
            list={this.state.products}
            getInitialProducts={this.getInitialProducts}
            handleAddProduct={this.handleAddProduct}
          /> } /> 
          <Route exact path='/orders' render={() => <Orders
            ordersList={this.state.orders}
            handleDeleteOrder={this.handleDeleteOrder}
          /> } />
          <Route path='/orders/:orderID' render={() => <Order
            current={this.state.currentOrder}
            ordersList={this.state.orders}
            order={this.state.orderDetails}
            handleDeleteItem={this.handleDeleteItem}
            handleDeleteOrder={this.handleDeleteOrder}
          /> } />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
