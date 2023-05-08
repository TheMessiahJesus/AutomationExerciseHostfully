/// <reference types="Cypress" />
//add general imports for the gherkin syntax and for the class objects 
import HomePage from '../../../support/pageObjects/HomePage'
import AddComputerPage from '../../../support/pageObjects/AddComputerPage'
import { Given,When,Then,And } from "cypress-cucumber-preprocessor/steps";
//initialize global variables
const testData = require('../../../fixtures/testData.json'); //variable used to import the test data (from testData json file)
const homePage=new HomePage()//create a new homePage object
const computerPage=new AddComputerPage()//create a new computer page object
const url = Cypress.env('urlE2E');//retrieve the env variable url that was set in the cypress.config.js file
const modeRegression = "whole";//variable used to set the type of mode that will be used for the search(fragment or whole)
let valueSmoke, modeSmoke; // variables used to set the computerDatabase.feature datatable raw values (that work like a fixture)
const dataTableRow=1, dataTableColumnValue=0, dataTableColumnMode=1;//index values used to go through the computerDatabase.feature datatable raw values
//iterate thorugh each .json testData {} set 
testData.forEach((component) => {
    //the following gherkin reserved words(Give, When, Then, And) need to be identical to the definitions declared in the computerDatabase.feature file
    //REGRESSION TEST=> mainly done to test the add a computer funcionality
    Given('I open Computer Database io Page',()=>
    {
        //visit main url
        cy.visit(url)
    })
    When('I fill the data and add a new computer',function ()
    {
        //Test add a computer option by calling the home page and computer page methods to perform actions:
        //click the new computer button to acces the new computer page
        homePage.clickNewComputerButton();
        //add the input values for the add new computer form options
        computerPage.inputComputerName(component.computerName);
        computerPage.inputIntroducedDate(component.computerIntroduced);
        computerPage.inputDiscontinuedDate(component.computerDiscontinued);
        computerPage.selectRandomOrDefaultCompany(component.computerCompany);
        //click the button to add the new computer
        computerPage.clickNewComputerButton();
    })
    And('Validate that a message that the computer was added displays correctly',function ()
    {
        //assert that the alert that displays after adding a computer is displayed correctly, has the name of the previously "added" product, as well as the expected "Done!... " message
        homePage.assertInputItemAlert(component.computerName);
    })
    Then('Use the filter box to assert if the computer exists in the table to verify it was added correctly',function ()
    {
        /*this process is madly important to confirm, because aside from the message that says the register was correcctly stored,
        * the register needs to be listed on the table to know if it was actually added
        */
        //add a computer name to the filter and click over the search button to display the computers results on the UI database table
        homePage.actionFilterValue(component.computerName);
        //go thorugh the computer database table until we find the previously inpu desired pc
        homePage.assertInputItem(modeRegression);       
    })
})
/*SMOKE TEST: mainly done to test that the web page filtering and that the results obtained by this are working as expected. Thus, the only thing that may be failing is that
*after adding the data, it is not being stored in the DB due that it may have been turned off on purpose (a read only web page that only works with get api requests). 
*Nevertheless, there is also a possibility that this is only failing visually, which is why next we need to also confirm this functionality at API level
*/
Given('I open Computer Database io Page',()=>
{
    //visit the main url
    cy.visit(url)
})
When('I fill the filter computer box',function(dataTable)
{
    //recover the data that works sort of as a fixture that is inside the feature file to validate the filter and the data display itself 
    valueSmoke = dataTable.rawTable[dataTableRow][dataTableColumnValue]
    modeSmoke = dataTable.rawTable[dataTableRow][dataTableColumnMode]
    //add data in the filter and click search button
    homePage.actionFilterValue(valueSmoke)
})
Then('Assert that the data that was input matches with the data that is displayed in the UI table',function ()
{
    //validate that data depending on the mode searches => fragment or whole word itself (thus, clarifying that this works perfectly)
    homePage.assertInputItem(modeSmoke)
})

//API TEST: made to determine that the error is not just visual, but instead made on purpose by the dev to prevent fault data insertion, and just let data retrieving to ocurr
testData.forEach((component) => {
    Given('I add a computer and assert the page redirect returns a 400 code when doing an add POST call, thus confirming that the web page is read-only as it was deduced on TC #CD001_D001_TS001_TC001',()=>
    {
        //confirm the theory speculated on the the first regression test, which is that POST calls are not working, despite the visual alert that the data is added is being displayed "correctly"
        computerPage.addApiComputer(component, url);
    })
    Then('I assert if the computer exists in the JSON response file that will later on populate the UI computer database table',()=>
    {
        //assert just by doing a recursive api call pagination whole word filtering, that the previously entered word is not there (if we were to check an already existing record, it will work, but it would need to be changed manually at code level)
        homePage.assertInputAPIItem(component, url);
    })
})

  



