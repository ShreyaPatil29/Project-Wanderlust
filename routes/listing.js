const express = require("express");
const router =  express.Router();
const wrapAsync = require("../utils/wrapAsync") ;
const ExpressError = require("../utils/ExpressError") ;
const {listingSchema , reviewSchema} = require("../schema");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const{isLoggedIn , isOwner , validateListing} = require("../middleware");
const { index, renderNewForm, showListing, createListing, editForm, updateListing, deleteListing } = require("../controllers/listings");
const multer = require("multer");
const {storage} = require("../cloudConfig");
const upload = multer ({storage})

// app.get("/" , (req , res) =>{
//     res.send("Hi iam root");
// })


//index route  //Create Route
router.route("/")
      .get( wrapAsync (index))
      .post(isLoggedIn,upload.single("listing[image]"), validateListing,wrapAsync(createListing))

      //New Route
router.get("/new" ,isLoggedIn, renderNewForm)

//show Route  //Update route   //Delete
router.route("/:id")
      .get( wrapAsync (showListing))
      .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing ,wrapAsync( updateListing))
      .delete( isLoggedIn,isOwner,wrapAsync (deleteListing))



//edit
router.get("/:id/edit" ,isLoggedIn,isOwner,wrapAsync(editForm))

router.post("/book/:id", async (req, res) => {
  if(!req.user){
    req.flash("error", "Please login first!");
    return res.redirect("/login");
  }

  const { checkIn, checkOut, guests, name, age } = req.body;

  await Booking.create({
    user: req.user._id,
    listing: req.params.id,
    checkIn,
    checkOut,
    guests,
    name,
    age
  });

  req.flash("success", "✅ Booking confirmed successfully!");
  res.redirect(`/listings/${req.params.id}`);
});
module.exports = router;