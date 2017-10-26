import React, { Component } from 'react';
import _ from 'lodash';

class Orders extends Component {
    constructor() {
      super();
      this.renderOrders = this.renderOrders.bind(this);
    }

    // Map over orders' state to display order info
    renderOrders() {
        let orders = _.map(this.props.ordersList, (order, index) => {
            return <div className='orders_wrapper' key={index}>
                        <tr>
                            <td>Order Number: {order.orderID}</td>
                            <td>Items:{order.quantity}</td>
                            <td>Total:${order.total_price}</td>
                        </tr>
                    </div>
        });
        return orders;
    }
    render() {
      return (
        <div  className='orders_table'>
            <table>
                    {this.renderOrders()}
            </table>
        </div>
      );
    }
  }

  export default Orders;