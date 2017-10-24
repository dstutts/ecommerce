import React, { Component } from 'react';
import _ from 'lodash';

class Order extends Component {
    constructor() {
      super();
      this.renderOrder = this.renderOrder.bind(this);
      this.renderOrderInfo = this.renderOrder.bind(this);
    }


    // renderOrderInfo() {
    //     let renderOrder = null;
    //     let orderNum = this.props.current;
    //     let thisOrder = this.props.ordersList;
    //     thisOrder.forEach(function(ord) {
    //         (ord.orderID == orderNum) ? renderOrder = ord : null;
            
            
    //     });   

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
                                <button>Remove</button>
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
           {this.renderOrder()}
        </div>
      );
    }
  }

  export default Order;