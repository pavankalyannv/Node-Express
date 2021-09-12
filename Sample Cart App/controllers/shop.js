const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getIndex = (req, res, next) =>{
    Product.find()
    .then( products =>{
        console.log(products);
        res.render('shop/index',{
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getProducts = (req, res, next) =>{
    Product.find()
    .then( products =>{
        res.render('shop/index.ejs',{
            pageTitle: 'View Products',
            path: '/products',
            prods: products
        });
    })
    .then( err =>{
        console.log(err);
    })
} 



exports.getProduct = (req, res, next) =>{

}

exports.getCart = (req, res, next) =>{ 

    req.user
    .populate('cart.items.productId')
    .then(user =>{
        const products = req.user.cart.items;
        console.log(products)
        res.render('shop/cart',{
            pageTitle: 'Cart',
            path:'/cart',
            prods: products
        });
    })
    .catch(err =>{
        console.log(err);
    })
}


exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
      .then(product => {
        return req.user.addToCart(product);
      })
      .then(result => {
        console.log(result);
        res.redirect('/cart');
      });
  };
exports.postCartDelete = (req, res, next) =>{
    const prodId = req.body.productId;
    req.user
        .removeFromCart(prodId)
        .then(result =>{
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}


exports.postOrder = (req, res, next) => {
    req.user
      .populate('cart.items.productId')
      .then(user => {
        const products = user.cart.items.map(i => {
          return { quantity: i.quantity, product: { ...i.productId } };
        });
        const order = new Order({
          user: {
            name: req.user.name,
            userId: req.user
          },
          products: products
        });
        return order.save();
      })
      .then(result => {
        return req.user.clearCart();
      })
      .then(() => {
        res.redirect('/orders');
      })
      .catch(err => console.log(err));
  };
  
  exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user })
      .then(orders => {
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders
        });
      })
      .catch(err => console.log(err));
  };
  
