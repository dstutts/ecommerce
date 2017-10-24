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

app.use(cors());

app.use(function(req, res, next)
{ res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE"); // allow these headers
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

// Gets all products
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


// Gets a specific order
app.get('/orders/:orderID', (req, res) => {
    var id = req.params.orderID;
    var query = `Select 
    P.product_title,
    P.product_desc,
    P.product_price,
    P.product_img
    
    From 
    orders O
    left join order_details OD on O.orderID = OD.orderID
    left join products P on OD.product_id = P.product_id
    
    Where
    O.orderID = ${id}`;
    connection.query(query, (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
});

app.get('/orders', (req, res) => {
    query = `SELECT
    od.orderID,
    count(od.product_id) as total_products,
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


// Add item to order.
// app.post('/orders/:orderID', (req, res) => {
//     var id = req.params.orderID;
//     let item = req.body.items;
//     var query = `Insert Into 
//     order_details 
//     (orderID, product_id)
//     Values
//     (${id}, 2)`;
//     connection.query(query, items, (error, results, fields) => {
//         if (error) throw error;
//         console.log(results);
//         res.send('Item Added to Order.');
//     });
// });

app.post('/orders', (req, res) => {
    console.log(req.body);
    var items = req.body.items;
    var quantity = req.body.quantity;
    var price = req.body.price;
    console.log('Items: ', items)
    console.log('Quantity: ', quantity)
    console.log('Price: ', price)
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
// Deletes an entire order
app.delete('/orders/:orderID', (req, res) => {
    var id = req.params.orderID;
    var query = `Delete 
    From 
    orders
    
    Where
    orderID = ${id}`;
    connection.query(query, (error, results, fields) => {
        if (error) throw error;
        //console.log(typeof id);
        console.log(req.params.orderID);
        console.log(results);
        //console.log(fields);
        res.send('Order Removed.');
    });
});



app.listen(3000); 