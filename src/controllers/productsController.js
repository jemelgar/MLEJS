const fs = require("fs");
const path = require("path");
const { v4: getId } = require("uuid");
getId(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
  // Root - Show all products
  index: (req, res) => {
    res.render("products", { products });
  },

  // Detail - Detail from one product
  detail: (req, res) => {
    //guardamos la información del producto solicitado
    let prodBody;
    for (let producto of products) {
      if (producto.id == req.params.id) {
        prodBody = producto;
      }
    }

    // Renderizamos la vista y le pasamos los datos del producto
    res.render("detail", { prodBody });
  },

  // Create - Form to create
  create: (req, res) => {
    res.render("product-create-form");
  },

  // Create -  Method to store
  store: (req, res) => {
    // Recuperamos la información enviada en el req.body y la guardamos en una variable
    // res.send(req.file);
    let nuevoProducto = {
      name: req.body.name,
      price: req.body.price,
      discount: req.body.discount,
      category: req.body.category,
      description: req.body.description,
      id: getId(), //ID automático
      image: req.file.filename, //Imagen pasada por multer
    };
    //Insertamos la información del nuevo producto en el arreglo que tiene la info del JSON
    products.push(nuevoProducto);
    //Sobreescribimos el JSON con la info actualizada --------estilizar el JSON----
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.redirect("/products");
  },

  // Update - Form to edit
  edit: (req, res) => {
    //guardamos la información del producto solicitado
    let prodBody;
    for (let producto of products) {
      if (producto.id == req.params.id) {
        prodBody = producto;
      }
    }

    // Renderizamos la vista y enviamos la info del producto
    res.render("product-edit-form", { producto: prodBody });
  },

  // Update - Method to update
  update: (req, res) => {
    //Recorremos el arreglo con los productos y actualizamos la info del producto cuyo ID sea solicitado
    products.forEach((producto) => {
      if (producto.id == req.params.id) {
        producto.name = req.body.name;
        producto.price = req.body.price;
        producto.discount = req.body.discount;
        producto.category = req.body.category;
        producto.description = req.body.description;
      }
    });
    //Sobreescribimos el JSON con la info actualizada --------estilizar el JSON----
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.redirect("/products");
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
    //Guardamos en un arreglo temporal los productos cuyo ID sea distinto al buscado
    let newJson = products.filter((newProducts) => {
      return (
        newProducts.id != req.params.id
      ); /*Guardar articulos que no tenga ID en URL */
    });
    //Guardamos en el JSON los productos resultantes del filtro
    fs.writeFileSync(productsFilePath, JSON.stringify(newJson, null, 2));
    // res.send(newJson);
    res.redirect("/products");
  },
};

module.exports = controller;
