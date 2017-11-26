import { Mongo } from 'meteor/mongo';

//load Ilnessess collection
export const Ilnesses = new Mongo.Collection('illness');

//load Remedy collection
export const Remedy = new Mongo.Collection('remedy');

//load Remedy collection
export const Products = new Mongo.Collection('products');

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
}