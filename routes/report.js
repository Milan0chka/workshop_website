var express = require('express');
var router = express.Router();
const Booking = require('../model/booking')

router.get('/bookings', (req, res) => {
    const { name, date_start, date_end } = req.query;
    let query = {};
  
    if (date_start && date_end) {
        const startDate = new Date(date_start);
        const endDate = new Date(date_end);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        query.date = { $gte: startDate, $lte: endDate };
    }

    if (name) {
        query.name = name;
    }

    if (Object.keys(query).length === 0) {
        return res.render('report_booking', { title: 'Report on booking', bookings: undefined });
    }

    Booking.find(query)
        .then(bookings => {
            bookings.sort((a, b) => new Date(a.date) - new Date(b.date));
            res.render('report_booking', { bookings: bookings, title: 'Report on bookings' });
        })
        .catch(error => {
            res.render('report_booking', { title: 'Report on booking', bookings: []});
            res.status(500).send(error.message);
        });
});

  
router.get('/workshops', (req, res) => {
    const workshopName = req.query.workshop_name;
    
    if (workshopName === undefined) {
        res.render('report_workshop', {distinctDateTime: undefined,title: 'Workshop Report'});
        return; 
    }

    let query = {};
    if (workshopName) {
        query.workshop_name = workshopName;
    }

    Booking.find(query)
        .then(bookings => {
            // Initialize a Set to store unique date-time combinations
            const uniqueDateTimeSet = new Set();
            bookings.sort((a, b) => new Date(a.date) - new Date(b.date));

            bookings.forEach(booking => {
                const dateStr = booking.date.toISOString().split('T')[0]; // Convert date to string
                const dateTimeStr = `${dateStr} ${booking.time}`; // Combine date and time
                uniqueDateTimeSet.add(dateTimeStr);
            });
            
            // Convert the Set to an array
            const distinctDateTime = Array.from(uniqueDateTimeSet);

            res.render('report_workshop', {
                distinctDateTime: distinctDateTime,
                title: 'Workshop Report'
            });
        })
        .catch(error => {
            res.render('report_workshop', {
                distinctDateTime: [], 
                title: 'Workshop Report'
            });
            res.status(500).send(error.message);
        });
});


  

  module.exports = router;