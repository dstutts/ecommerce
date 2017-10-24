import React, { Component } from 'react';
import _ from 'lodash';

class Products extends Component {
    constructor() {
      super();
      this.renderProducts = this.renderProducts.bind(this);
    }

    renderProducts() {
        var products = _.map(this.props.list, (product, index) => {
            return <div key={index}>
                    <ul className = 'product_list'>
                        <li>
                            <div className = 'product_title'>
                                {product.product_title}
                            </div>
                            <div className = 'product_img'>
                                <img src={product.product_img} alt=''/>
                            </div>
                            <div className = 'product_desc'>
                                {product.product_desc}
                            </div>
                            <div className = 'product_price'>
                                ${product.product_price}
                            </div>
                            <div className = 'add_to_cart_button'>
                            <button onClick={(e) => {this.props.handleAddProduct(product, e)}}>Add to Cart</button>
                            </div>
                        </li>
                    </ul>
                   </div>
          });
          return products;
    }

    render() {
      return (
        <div>
           {this.renderProducts()}
        </div>
      );
    }
  }

  export default Products;