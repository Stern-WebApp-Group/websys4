import { Mongo } from 'meteor/mongo';

//load Ilnessess collection
export const Ilnesses = new Mongo.Collection('illness');

//load Remedy collection
export const Remedy = new Mongo.Collection('remedy');

//load products collection
export const Products = new Mongo.Collection('products');

//load reviews collection
export const Reviews = new Mongo.Collection('reviews');
//publish meteor queries here...
if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('remedy', function remedyPublication() {
        return Remedy.find({});
    });

    Meteor.publish('product', function productPublication() {
        return Products.find({});
    });

    Meteor.publish('illness', function illnessPublication() {
        return Ilnesses.find({});
    });

        Meteor.publish('reviews', function reviewsPublication() {
        return Reviews.find({});
    });

    // Method to get aggregate rating
    // TODO: Need to fix it
    Meteor.methods({ 'getRatingServer'(Remedy_id){

            return Reviews.aggregate([
                {$match: {"Remedy_ID": Remedy_id}},
                {
                    $group: {
                        _id: null,
                        avgRating: {
                            $avg: "$Rating"
                        }
                    }
                }]);
        }});

    // Give insert permission to reviews table
    Reviews.allow({
        'insert': function (userId,doc) {
            /* user and doc checks ,
            return true to allow insert */
            return true;
        }
    });
}
