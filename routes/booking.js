var express = require('express');
var router = express.Router();
const Booking = require('../model/booking')

/* GET booking page. */
router.get('/create', function(req, res, next) {
  res.render('create_booking', { title: 'Booking' });
});


// Handle the POST request to create a booking
router.post('/create', function(req, res, next) {
  Booking.create(req.body)
    .then((bookingcreated) => {
      res.render('success', { title: 'Booking successful' });
    })
    .catch((err) => {
      console.log(err);
      // Handle errors appropriately
      next(err);
    });
});

router.get('/all_bookings', function (req, res, next) {
  Booking.find()
    .then((bookingfound) => {
      bookingfound.reverse();
      res.render('all_bookings', { 'bookings': bookingfound, title: 'All bookings', openNewTab: true });
    })
    .catch((err) => {
      console.log(err); 
      // Handle errors appropriately
      next(err);
   });
});


router.get('/edit', function (req, res, next) {
  Booking.find()
    .then((bookingsfound) => {
      bookingsfound.reverse();
      res.render('edit_booking_list', { 'bookings': bookingsfound, title: 'Edit bookings'});
    })
    .catch((err) => {
      console.log(err); 
      // Handle errors appropriately
      next(err);
   });
});

router.get('/edit/:bookingId', (req, res) => {
  const bookingId = req.params.bookingId;
  const updateStatus = req.query.update; // Capture the 'update' query parameter

  Booking.findById(bookingId)
      .then(booking => {
          if (!booking) {
              return res.status(404).send('Booking not found.');
          }
          res.render('edit_booking', { "booking": booking, title: 'Edit booking', updateStatus: updateStatus });
      })
      .catch(error => {
          res.status(500).send(error.message);
      });
});


router.post('/edit/:bookingId', (req, res) => {
  const bookingId = req.params.bookingId;
  const updatedBookingData = req.body;

  Booking.findByIdAndUpdate(bookingId, updatedBookingData, { new: true })
      .then(updatedBooking => {
          if (!updatedBooking) {
              return res.status(404).send('Booking not found.');
          }
          // Redirect to the GET route with a success message
          res.redirect(`/booking/edit/${bookingId}?update=success`);
      })
      .catch(error => {
          res.status(500).send(error.message); // Handle the error
      });
});


router.post('/delete/:bookingId', (req, res) => {
  const bookingId = req.params.bookingId;

  Booking.findById(bookingId)
      .then(booking => {
          if (!booking) {
              return res.status(404).send('Booking not found.');
          }
          return Booking.deleteOne({ _id: bookingId });
      })
      .then(() => {
          res.redirect('/booking/edit'); // Redirect to the booking list page
      })
      .catch(error => {
          next(error); // Pass the error to the error-handling middleware
      });
});


module.exports = router;
 