const express = require('express');
const _ = require('lodash');
const cors = require('cors');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 8889,
    database: 'ecommerce'
  });

var app = express(); 

// Enable cross-origin resource sharing
app.use(cors());

// Ensure cross-origin resource sharing headers allowed
app.use(function(req, res, next)
{ res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE"); 
next(); 
});

app.use(bodyParser.json());

connection.connect((error) => {
    if (error) {
        console.log('Error');
    } else {
        console.log('Connected');
    }
});

// Gets all products to be displayed in Products.js
app.get('/', (req, res) => {
    var query = `Select
        P.product_id, 
        P.product_title, 
        P.product_desc, 
        P.product_price, 
        P.product_img

        From
        products P`;
    connection.query(query, (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
});


// Gets a specific order for Order.js display
app.get('/orders/:orderID', (req, res) => {
    var id = req.params.orderID;
    var query = `SELECT
    od.id,
    od.orderID,
    p.product_id,
    p.product_title,
    p.product_price,
    p.product_img,
    o.quantity,
    o.price

   FROM order_details od

   LEFT JOIN products p on p.product_id = od.product_id
    LEFT JOIN orders o on o.orderID = od.orderID

   WHERE od.orderID = ${id}`;
    connection.query(query, (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
});

// Get all orders for Orders.js
app.get('/orders', (req, res) => {
    query = `SELECT
    od.orderID,
    count(od.product_id) as quantity,
    sum(p.product_price) as total_price
    
    FROM
    order_details od
    left join products p on od.product_id = p.product_id
    
    GROUP BY 
    od.orderID`;
    connection.query(query, (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
});

// Post new order to orders table, then order_details table
// Map over items array from request body to insert into order_details
app.post('/orders', (req, res) => {
    console.log(req.body);
    var items = req.body.items;
    var quantity = req.body.quantity;
    var price = req.body.price;
    var query = `INSERT INTO Orders (quantity, price) VALUES (${quantity}, ${price})`
    connection.query(query, (error, results, fields) => {
        if (error) {
            return res.send(error); 
        } else {
            var orderID = results.insertId;
            var query2 = `INSERT INTO order_details (orderID, product_id) VALUES ?`
            connection.query(query2, [
                Array.from(req.body.items).map((item) => {
                    return [orderID, item];
                })
            ], (error, results, fields) => {
                if (error) {
                    return res.send(error);
                } else {
                    res.send(results);
                }
            })
        }
    });
});

// Deletes a specific product from order_details
app.delete('/orders/:itemID', (req, res) => {
    let id = req.body.itemID;
    let query = `DELETE
    
    FROM 
    order_details

    WHERE
    id = ${id}`;
    connection.query(query, (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
});

// Updates quantity and price of an order after product has been deleted (same front-end request as above)
app.put('/orders/:orderID', (req, res) => {
    let id = req.params.orderID;
    let price = req.body.price;
    let quantity = req.body.quantity;
    let query = `UPDATE
    orders

    SET 
    quantity = ${quantity}, price = ${price}

    WHERE
    orderID = ${id}`;
    connection.query(query, (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
});

// Deletes an entire order from orders table and each row from order_details table where orderID matches
app.delete('/orders', (req, res) => {
    let id = req.body.ordID;
    let query = `DELETE

    FROM 
    orders
    
    WHERE
    orderID = ${id}`;
    connection.query(query, (error, results, fields) => {
        if (error) {
            return res.send(error); 
        } else {
            let query2 = `DELETE
            
            FROM 
            order_details
        
            WHERE
            orderID = ${id}`;
            connection.query(query2, (error, results, fields) => {
                if (error) {
                    return res.send(error);
                } else {
                    res.send(results);
                }
            })
        }
    });
});

app.listen(3000); 