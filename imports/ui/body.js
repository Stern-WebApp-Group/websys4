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
        return Ilnesses.find().fetch().map(function(object){ return {value: object.name}; });
    },

    // filtered out remedies based on search (hide all other remedies
    selected: function(event, suggestion, datasetName) {
        $(".panel").hide();
        $("."+suggestion.value).show();
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


//Rui's code to show the about page

Template.body.events({
    //show about_us page
    'click #about_us'(event) {
        event.preventDefault();
        $(".row").hide();
        $("#input_search").hide();
        $(".about_page").show();
        //show homepage
    },
    'click #homepage'(event) {
        event.preventDefault();
        $(".row").show();
        $("#input_search").show();
        $(".about_page").hide();
    },
});
