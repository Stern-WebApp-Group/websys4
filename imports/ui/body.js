import { Template } from 'meteor/templating';
import { Ilnesses, Remedy, Products ,Reviews} from '../api/servercode.js';
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
    Meteor.subscribe('reviews');
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

    //return list of reviews with the matching rememdy ID
    reviews: function(){
        console.log( Session.get("currentreview"));
        var temp = parseInt(Session.get('currentreview'));
        return Reviews.find({"Remedy_ID": temp });
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
        if (target.id >= 13 && target.id <= 15) {
            $("#product_only").hide();
            $("#service_only").show();
        } else {
            $("#service_only").hide();
            $("#product_only").show();
        }
    },

      'click .remedy_button2'(event) {
        // Prevent default browser form submit
        event.preventDefault();
        const target = event.target;
        Session.set("currentreview", target.id);

    },
      'click .remedy_button3'(event) {
        // Prevent default browser form submit
        event.preventDefault();
        const target = event.target;
        Session.set("currentremedy", target.id);

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


Template.reviewsform.events({
    // On submission of form
    'submit .reviews-form': function(event){
        console.log("Form submitted");
        event.preventDefault();

        // Get current remedy from session variable
        const remedyID = parseInt(Session.get('currentremedy'));
        const target = event.target;
        // Get input text and rating from form
        const inputtext = target.reviewtext.value;
        const inputrating = parseInt(target.reviewrating.value);

        // Insert reviews data in Reviews collection
        Reviews.insert({
            Text: inputtext,
            Rating: inputrating,
            Remedy_ID: remedyID,
            User_ID: 1
        });

        // Clear form
        target.reviewtext.value = '';
        target.reviewrating.value = '';
    }
});

Template.remedy_result.helpers({
    getRating: function(Remedy_id) {
        /*console.log( Session.get("currentremedy"));
        var temp = parseInt(Session.get('currentremedy'));*/

        let avgJSON = Meteor.call('getRatingServer', Remedy_id);

        /*var avgJSON =  Reviews.aggregate([
              { $match: { "Remedy_ID": 5 }},
              {
                  $group: {
                      _id: null,
                      avgRating: {
                          $avg: "$Rating"
                      }
                  }
              }
          ]);
*/
        console.log(avgJSON);
        console.log(avgJSON.avgRating.value);
        return avgJSON.avgRating.value;
 /*       return Meteor.call('getRatingServer', Remedy_id, ( error, response ) => {
            if ( error ) {
                alert( error.reason );
            } else {
                //template.totalRevenue.set( response );
            }}).value;*/
    }


})
