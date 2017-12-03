import { Template } from 'meteor/templating';
import { Ilnesses, Remedy, Products } from '../api/servercode.js';
const readmore = require('readmore-js');






import './body.html';



//onload function
Template.body.rendered = function() {
    //initialize autocomplete search input
    Meteor.typeahead.inject();
   // $('.readmore2').readmore({collapsedHeight:30});

};

Template.remedy_result.rendered = function() {

    $('.readmore2').readmore({collapsedHeight:35});

};

Template.body.rendered = function() {
    //initialize autocomplete search input
    Meteor.typeahead.inject();
    $('.readmore2').readmore({collapsedHeight:30});

};

//Subscriptions
Template.body.onCreated(function bodyOnCreated() {
    Meteor.subscribe('remedy');
    Meteor.subscribe('illness');
    Meteor.subscribe('product');

});


//list of helper functions that body.js will call.
Template.body.helpers({

    //return list of all remedies to the client
    remedies() {
        return Remedy.find({});
    },
    //return list of products with the matching rememdy ID
    products: function(){
        console.log( Session.get("currentproduct"));
        var temp = parseInt(Session.get('currentproduct'));
        return Products.find({"Remedy_ID": temp });

    },

    //return list of illnesses to the autocomplete search
    illnessSearch: function() {
        return Ilnesses.find().fetch().map(function(object){ return {id: object.Remedy_ID, value: object.name}; });
    },

    // filtered out remedies based on search (hide all other remedies
    selected: function(event, suggestion, datasetName) {

        //split remedies returned by illness into array
        var query_ids = suggestion.id.split(',');

        //hide all rememdies
       $(".panel").hide();

        //show only filtered remedies
        for (var i = 0; i < query_ids.length; i++) {
            $("#"+ query_ids[i]).show();
        }//for

    },
});


Template.body.events({
    //capture onclick event for product button, store the ID and pass it to a session that will be read from the product helper function.
    'click .remedy_button'(event) {
        // Prevent default browser form submit
        event.preventDefault();
        const target = event.target;
        Session.set("currentproduct", target.id);

    },
});