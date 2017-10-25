import React, { Component } from 'react';
import _ from 'lodash';

class Order extends Component {
    constructor() {
      super();
      this.renderOrder = this.renderOrder.bind(this);
      this.renderOrderInfo = this.renderOrderInfo.bind(this);
    }


    renderOrderInfo() {
        let curr = parseInt(this.props.current);
        console.log(curr);
        let orderInfo = _.map(this.props.ordersList, (order, index) => {
            if (order.orderID === curr) {
                return <div className='order_info' key={index}>
                                <tr>
                                    <td>Total Items:{order.quantity}</td>
                                </tr>
                                <tr>
                                    <td>Total Price: ${order.total_price}</td>
                                </tr>
                                <tr>
                                    <td><button className='cancel_order' data-order={order.orderID} onClick={(e) => {this.props.handleDeleteOrder(e)}}>Cancel Order</button></td>
                                </tr>
                         </div>
                        }
                    });
                    return orderInfo;
                }

    renderOrder() {
        let order = _.map(this.props.order, (product, index) => {
            return <div key={index}>
                    <ul className = 'order_list'>
                        <li>
                            <div className = 'order_title'>
                                {product.product_title}
                            </div>
                            <div className = 'order_img'>
                                <img src={product.product_img} alt=''/>
                            </div>
                            <div className = 'order_price'>
                                ${product.product_price}
                            </div>
                            <div className = 'remove_item_button'>
                                <button className='remove_item' data-id={product.id} data-order={product.orderID} data-price={product.product_price} onClick={(e) => {this.props.handleDeleteItem(e, index)}}>Remove</button>
                            </div>
                        </li>
                    </ul>
                   </div>
          });
          return order;
    }

    render() {
      return (
        <div>
            <div>
                <table className='order_info_table'>

                    {this.renderOrderInfo()}
                </table>
            </div>
            <div>
                {this.renderOrder()}
            </div>
        </div>
      );
    }
  }

  export default Order;