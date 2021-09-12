const Product = require('../models/product');


exports.getAddProduct = (req, res, next) =>{
    res.render('admin/edit-product',{
        pageTitle: 'Add Product ',
        path: '/admin/add-product',
        editing: false
    })
}

exports.postAddProduct = (req, res, next) =>{
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
    console.log(product);
    product
    .save()
    .then(result =>{
        console.log("Posted Succesfully");
        res.redirect('/admin/products');
    })
    .catch(err=>{
        console.log(err);
    });
}

exports.getAdminProducts =( req, res, next) =>{
    Product.find()
    .then( products =>{
        res.render('admin/products',{
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        })
    })
    .catch((err) =>{
        console.log(err);
    })
}

exports.getEditProduct = (req, res, next) =>{
    const editMode = req.query.edit;
    if(!editMode){
        res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then( product =>{
        if(!product) {
            res.redirect('/');
        }
        res.render('admin/edit-product',{
            pageTitle: 'Edit Product ',
            editing: editMode,
            path:'/admin/edit-product',
            product: product
    });
    })
    .catch(err =>{
        console.log(err);
    });
}

exports.postEditProduct = (req, res, next) =>{
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImage = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const prodId = req.body.productId;

    Product.findById(prodId)
    .then(product =>{
        product.title = updatedTitle,
        product.price = updatedPrice,
        product.imageUrl = updatedImage,
        product.description = updatedDescription
        return product.save()
    })
    .then(result =>{
        console.log("Edited Successfully! ");
        res.redirect('/admin/products');
    })
    .catch(err =>{
        console.log(err);
        res.status(500).send("Internal Error!")
    });
}

exports.deleteAdminProudct = (req, res, next) =>{
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
    .then(() =>{
        console.log("Product Deleted");
        res.redirect('/admin/products');
    })
    .catch(err =>{
        console.log(err);
    });
}