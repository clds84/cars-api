// CAR -> has many aftermarket parts & has owner that is user

const mongoose = require('mongoose')

const aftermarketPartSchema = require('./aftermarketPart')

const { Schema, model } = mongoose

const carSchema = new Schema(
    {
        make: {
            type: String,
            required: true
        },
        model: {
            type: String,
            required: true
        },
        year: {
            type: String,
            reqyured: true
        },
        drivetrain: {
            type: String,
            required: true
        },
        sportMode: {
            type: Boolean,
            required: true
        },
        aftermarketPart: [aftermarketPartSchema],
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }, {
        timestamps: true,
        // we're going to add virtuals to our model
        // these lines ensure that the virtual will be included
        // whenever we turn our document to an object or JSON
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
)

// virtuals go here(we'll build these later)
// a virtual is a virtual property, that uses the data that's saved in the database, to add a property whenever we retrieve that document and convert to an object.
carSchema.virtual('fullTitle').get(function () {
    // we can do whatever javascripty things we want in here
    // we just need to make sure that we return some value
    // fullTitle is going to combine the name and type to build a title
    return `The ${this.make} ${this.model} is ${this.drivetrain}`
})

carSchema.virtual('isABaby').get(function() {
    if (this.sportMode) {
        return `This ride's got some new juice`
        } 
    else {
        return `This ride's got some old juice, good or bad`
    }
})

module.exports = model('Car', carSchema)