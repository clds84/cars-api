// import our dependecies, middleware and models 
const express = require('express')
const passport = require('passport')

// pull in our model
const Car = require('../models/car')

// helps us detect certain situations and send custom errors
const customErrors = require('../../lib/custom_errors')
// this function sends a 404 when non-existent document is requested
const handle404 = customErrors.handle404
// middleware that can send a 401 when a user tries to access something they do not own
const requireOwnership = customErrors.requireOwnership
// requireToken is passed as a second arg to router.<verb> 
// makes it so that a token MUST be passed for that route to be available --> also sets 'req.user'
const requireToken = passport.authenticate('bearer', { session: false })
// this middleware removes any blank fields from req.body
const removeBlanks = require('../../lib/remove_blank_fields')

// instantiate our router
const router = express.Router()

// ROUTES GO HERE

// INDEX
// GET /cars
router.get('/cars', (req, res, next) => {
    // we will allow access to view all the cars, by skipping 'requireToken'
    // if we wanted to make this a protected resource, we'd just need to add that middleware as the second arg to our get(like we did in create for our post)
    Car.find()
        .populate('owner')
        .then(cars => {
            // cars will be an array of mongoose documents
            // so we want to turn them into POJO (plain ol' js objects)
            // remember that map returns a new array
            return cars.map(car => car.toObject())
        })
        .then(cars => res.status(200).json({ cars }))
        .catch(next)
})
// SHOW
// GET /cars/62450170bb89fd253050af58
router.get('/cars/:id', (req, res, next) => {
    // we get the id from req.params.id -> :id
    Car.findById(req.params.id)
        .populate('owner')
        .then(handle404)
        // if its successful, respond with an object as json
        .then(car => res.status(200).json({ car: car.toObject() }))
        // otherwise pass to error handler
        .catch(next)
})


// CREATE
// POST /cars
//temporarily removed  requireToken, from line 58
router.post('/cars', (req, res, next) => {
    // we brought in requireToken, so we can have access to req.user
   // req.body.car.owner = req.user.id

    Car.create(req.body.car)
        .then(car => {
            // send a successful response like this
            res.status(201).json({ car: car.toObject() })
        })
        // if an error occurs, pass it to the error handler
        .catch(next)
})

// UPDATE
// PATCH /cars/624470c12ed7079ead53d4df
//requireToken,
//removeBlanks
router.patch('/cars/:id', removeBlanks, (req, res, next) => {
    // if the client attempts to change the owner of the car, we can disallow that from the getgo
    delete req.body.owner
    // then we find the car by the id
    Car.findById(req.params.id)
    // handle our 404
        .then(handle404)
    // requireOwnership and update the car
        .then(car => {
            //requireOwnership(req, car)

            return car.updateOne(req.body.car)
        })
    // send a 204 no content if successful
        .then(() => res.sendStatus(204))
    // pass to errorhandler if not successful
        .catch(next)
})



// REMOVE
// DELETE /cars/624470c12ed7079ead53d4df
//requireToken,
router.delete('/cars/:id', (req, res, next) => {
    // then find the car by id
    Car.findById(req.params.id)
    // first handle the 404 if any
        .then(handle404)
    // use requireOwnership middleware to make sure the right person is making this request
        .then(car => {
            // requireOwnership needs two arguments
            // these are the req, and the document itself
           // requireOwnership(req, car)
            // delete if the middleware doesnt throw an error
            car.deleteOne()
        })
    // send back a 204 no content status
        .then(() => res.sendStatus(204))
    // if error occurs, pass to the handler
        .catch(next)
})

// ROUTES ABOVE HERE

// keep at bottom of file
module.exports = router