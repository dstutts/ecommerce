import React, { Component } from 'react';
import _ from 'lodash';

class Orders extends Component {
    constructor() {
      super();
      this.renderOrders = this.renderOrders.bind(this);
    }
    renderOrders() {
        let orders = _.map(this.props.ordersList, (order, index) => {
            return <div className='orders_wrapper' key={index}>
                        <tr>
                            <td>Order: {order.orderID}</td>
                            <td>Items:{order.total_products}</td>
                            <td>Price:${order.total_price}</td>
                            <td><button>Delete</button></td>
                        </tr>
                    </div>
        });
        return orders;
    }
    render() {
      return (
        <div>
            <table className='orders_table'>
                    {this.renderOrders()}
            </table>
        </div>
      );
    }
  }

  export default Orders;