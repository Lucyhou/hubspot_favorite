const express = require('express');
const axios = require('axios');
//We'll start at the top of the file and require express and axios.
// Then we'll create an express app.
const app = express();



///---step 3---   code:  npm install pug          nodemon

//we'll use app.set and have our view engine set to pug. 
//This template is a simple card layout. In pug, we're able to parse through data we receive from the API call and
//output it onto the page
app.set("view engine", "pug");


//we'll loop over our data array just like a basic “for Each loop” in JavaScript, so we can create a
 //single card for //each contact. Inside of each card, we'll call the first and last name properties
 // of the contact, as well as the email.
//we'll create a public folder, a css folder, and a style.css file inside of the css folder. 
//The style.css file is called inside of our contacts.pug file through a link in the head section. 
//Lastly, we have to link our public directory to our index file through app.use. 
//Express makes it easy for us to call all of our files within our public folder. 
//Now, let's return to the browser and refresh the page. Our /contacts route should be showing a 
//basic layout with a few cards that contain each contact's name and email address.
app.use(express.static(__dirname + '/public'));

// we’ve added code that uses some built-in
//express methods that will help with posting our form data.
//app.use(express.urlencoded({ extended: true }));
//app.use(express.json());

//--step3
//----step 4

// we’ve added code that uses some built-in express methods that will help with
// posting our form data.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//----step 4



///----step2
const private_app_token ='pat-na1-9b225eea-4af7-4d41-b09a-18a9d51a7295'
//create a constant at the top of this app and store the private app access token there
//. Access tokens, like API keys, give you permission to access sensitive data
//going to make a call to the contacts object endpoint from the CRM API, and print the data
// Let's create a route for /contacts. Inside this route, we'll create a constant to store the endpoint
//URL. The access token is sent via a headers object, so we'll create a constant named “headers.”
// This object includes 'Authorization' and 'Content-Type'. For 'Authorization', we'll write our value in back-ticks.
//Back-ticks allow you to use template literals and call variables within strings. 
app.get('/contacts', async (req, res) => {

  const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
  const headers = {
      Authorization: `Bearer ${private_app_token}`,
      'Content-Type': 'application/json'
  }
//This endpoint uses the HTTP GET method. In axios.get, we'll send along both the API URL
//constant and the headers constant. Since headers is an object, we'll wrap it in curly brackets.
// Promises



try {
    const resp = await axios.get(contacts, { headers });
    const data = resp.data.results; //---step 3
//The data that we received from the API call is in an object called ‘results’, so we'll use dot
//notation to change our data constant to response.data.results. This will change our data from 
//an object to an array,and make it easier to work with in our pug file.
     //resp.data.results;
    //res.json(data);      
    //---step 3

    res.render('contacts', { title: 'Contacts | HubSpot APIs', data });
    //use this to replace the above code     
} catch (error) {
    console.error(error);
}

});
///---step2   contact.pug test in : http://localhost:3000/contats



//----step 4

//Let's add a route for /update. We're going to add a get route to display the current value, and a post route to
//submit the form. Starting with the get route, here's the route callback. Notice that it's async. We're using async/
//await promises to wait for API responses, before rendering the response to the page
// build the new route:we'll use post instead of get. This callback will also be async
// we’ll want to do is set up the JSON we’re going to pass to the update endpoint.
//This endpoint will selectively update a contact with whatever new data we send.
// we simply want to update the favorite book property with the value that we’ll 
//enter in the form field. This is where those built-in express
//methods come in handy — they allow us to access form data on request.body
//
app.get('/update', async (req, res) => {
    // http://localhost:3000/update?email=spinlucyhou@gmail.com

    //use an email in a query param
    const email = req.query.email;
     
    //So our URL will look something like this:
    // [‘http://localhost:3000/update?email=rick@crowbars.net’]. Let’s go ahead 
    //and store that query param in a variable
    //The read contacts endpoint requires a contact ID or any unique property,
     //as specified by the idProperty query param. We’ll use the contact’s email 
     //address in our request and set the idProperty equal to email. We also need
     // to specify what properties we want to be returned by setting the
    //properties query param. For our example, we’ll ask for the contact’s email 
    //and favorite book. 
    const getContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email&properties=email,favorite_book`;
    
    //Add our request headers, which include our access token, and assign them
    // to the headers variable.
    const headers = {
        Authorization: `Bearer ${private_app_token}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(getContact, { headers });
        const data = response.data; //step 5 replace code

        //res.json(data); only apply to step 4
        res.render('update', {userEmail: data.properties.email, favoriteBook: data.properties.favorite_book});
        //step5 replace code
    } catch(err) {
        console.error(err);
    }
});
//----step 4

   //--------------step 5----------


    // we’ll move on to the API call
    app.post('/update', async (req, res) => {
        const update = {
            properties: {
                "favorite_book": req.body.newVal
            }
        }
    
        //  create a variable to hold the email  address from the query param.
        const email = req.query.email; 
    
         // we’ll construct the URL for the API call with that same email, being sure to set
         //the idProperty to email
        const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
        
        //let’s set up our request headers.
        const headers = {
            Authorization: `Bearer ${private_app_token}`,
            'Content-Type': 'application/json'
        };
    
        try { 
            await axios.patch(updateContact, update, { headers } );
            res.redirect('back');
        } catch(err) {
            console.error(err);
        }
    
    });
    //step 5----------







//we'll listen for this app on port 3000. We'll also
//using console log a useful link to the localhost URL. 
//now let's open up a terminal and install our dependencies
//using npm instal
app.listen(3000, () => console.log('Listening on http://localhost:3000'));