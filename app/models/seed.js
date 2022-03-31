// seed.js is going to be a script that we can run from the terminal, to create a bunch of pets at once. 

// we'll need to be careful with our seed here, and when we run it, because it will remove all the pets first, then add the new ones. 

const mongoose = require('mongoose')
const Car = require('./car')

const db = require('../../config/db')

const startCars = [
    { make: 'Toyota', model: 'Supra', year: 2021 , drivetrain: "RWD", sportMode: true},
    { make: 'Chevy', model: 'Nova SS', year: 1972, drivetrain: "RWD", sportMode: false},
    { make: 'Mini', model: 'Cooper S', year: 2005 , drivetrain: "FWD", sportMode: false},
    { make: 'Subaru', model: 'WRX STI', year: 2019 , drivetrain: "AWD", sportMode: true}
]

// first we connect to the db via mongoose
mongoose.connect(db, {
	useNewUrlParser: true,
})
    .then(() => {
        // then we remove all the pets except the ones that have an owner
        Car.deleteMany({ owner: null })
            .then(deletedCars => {
                console.log('deleted cars', deletedCars)
                // then we create using the startPets array
                // we'll use console logs to check if it's working or if there are errors
                Car.create(startCars)
                    .then(newCars => {
                        console.log('the new cars', newCars)
                        mongoose.connection.close()
                    })
                    .catch(err => {
                        console.log(err)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log(error)
                mongoose.connection.close()
            })
    })
    // then at the end, we close our connection to the db
    .catch(error => {
        console.log(error)
        mongoose.connection.close()
    })