/// <reference types="Cypress" />
/// <reference types="cypress-xpath" />
class ComputerPage{
    elements ={
        //initialize page locators
        computerNameBox: () => cy.get('input[id*="name"]'),
        introducedDateBox : () => cy.get('input[id*="introduced"]'),
        discontinuedDateBox : () => cy.get('input[id*="discontinued"]'),
        companySelectRandomOption : () =>  cy.get(`#company> option`), // we get the option by finding the select by id
        createComputerButton : () => cy.get('div.actions>input[value*="Create this computer"]')
    }
    //method used to input a computer name in its respective computer form box
    inputComputerName(input){
       return this.elements.computerNameBox().type(input)
    }
    //method used to input a computer introduced in its respective computer form box
    inputIntroducedDate(input){
        return this.elements.introducedDateBox().type(input)
     }
     //method used to input a computer discontinued in its respective computer form box
     inputDiscontinuedDate(input){
        return this.elements.discontinuedDateBox().type(input)
     }
     //method used to select a computer company option in its respective computer select, if a value is sent, it selects the sent value, if not it randomly seleccts one
    selectRandomOrDefaultCompany(item){
        //retrieve the select locator to be able to select an option
        this.elements.companySelectRandomOption().then(listing => {        
            //if a value is received trim the white spaces and select the value
            if(item.trim()!==""){
                cy.get(`#company`).select(item) // select the option on UI
            } else {
                const randomNumber = getRandomInt(1, listing.length-1); //generate a rendom number between 1 and length-1.
                    cy.get(`#company> option`).eq(randomNumber).then(($select) => {//choose an option randomly
                    const text = $select.text() //get the option's text. For ex. "AppleInc."
                    cy.get(`#company`).select(text) // select the option on UI
                });
            }
          })
    }
    //method used to click the add new button option on the computer add form, this promts the alert on the home page form
    clickNewComputerButton(){
        this.elements.createComputerButton().click();
    }
    //api method used to add a new computer using the POST api call, and suggested inspected endpoint that ends up redirecting the page, but not adding it to the DB
    addApiComputer(component, apiUrl){
        cy.request({
            method : 'POST',
            // recover api url that resides inside the cypress.config.js file
            url : apiUrl,
            //prevent api to fail on 400 error call
            failOnStatusCode:false,
            // the body json values needed to add a new json object
            body : {
                // fill the form body values
                "name": component.computerName,
                "introduced": component.computerIntroduced,
                "discontinued": component.computerDiscontinued,
                "company": 1
            }
        }).then((response)=>{
            // successful response assertion for a post that we actually knew would fail because the dev prevented POST calls to work
            expect(response.status).to.eq(400)
        })
    }
}
  //Random int number generator between min and max
function getRandomInt(min, max){      
    //generate a random number between two given numbers(defined interval)
    return Math.floor(Math.random() * (max - min + 1)) + min;    
} 
//return computer page object
export default ComputerPage;
//add xpath interpretation for the location recovery segment detailed in the constructor
require('cypress-xpath')