const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

router.get("/home", clientController.getHome);

router.get("/about-government-hostel-chembur",clientController.getAbout);

router.get("/hostel-mess-menu",clientController.getMess);

router.get("/hostel-contact",clientController.getContact);
    
router.get("/hostel-facilities", clientController.getFacility);

router.get("/government-hostel-admission",clientController.getadmission);

router.get("/hostel-gallery",clientController.getGallery);


module.exports = router; 