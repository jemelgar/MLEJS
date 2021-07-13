// ************ Require's ************
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
// ************ Controller Require ************
const productsController = require("../controllers/productsController");
//************* RUTA PARA GUARDAR IMAGENES ****
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/products");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_img_${path.extname(file.originalname)}`);
  },
});
const uploadFile = multer({ storage });
/*** GET ALL PRODUCTS ***/
// /products
router.get("/", productsController.index);

// /*** CREATE ONE PRODUCT ***/
router.get("/create", productsController.create); //para mostrar el formulario
router.post("/create", uploadFile.single("image"), productsController.store); //para capturar los datos enviados

// /*** GET ONE PRODUCT ***/
router.get("/detail/:id/", productsController.detail);

/*** EDIT ONE PRODUCT ***/
router.get("/:id/edit", productsController.edit); //para mostrar el formulario
router.put("/:id/edit", productsController.update); //para capturar los datos enviados
// /*** DELETE ONE PRODUCT***/
router.delete("/detail/:id", productsController.destroy);

module.exports = router;
