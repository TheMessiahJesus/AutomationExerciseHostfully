/// <reference types="Cypress" />
/// <reference types="cypress-xpath" />

//declare and initialize global variables
var computerAPIFound = false; //value used to determine if a computer was found or not for the API methods
var totalElementsBannerNum = "0"; //initial banner number, that starts in 0 to control empty table scenarios 
const parser = new DOMParser(); //initialice parser object used to convert html table to json

class HomePage{
    elements ={
        //initialize page locators and general class primitive/complex data type attributes
        addNewComputersBtn: () => cy.get('form[action="/computers"]>a[class="btn success"]'),
        filterComputerBox : () => cy.xpath("//div[@id='actions']//input[contains(@placeholder,'Filter by computer name..')]"),
        filterByNameBtn : () => cy.get("input[id='searchsubmit']"),
        paginationNextBtn : () => cy.get('.next'),
        tablePCRows : () => cy.get('table[class*="computers"] tr'),
        tablePCNameColumn : () => cy.get('table[class*="computers"] tr td:nth-child(1)>a'),
        tableProductInsertOKAlert : () => cy.get('section#main').find('div[class*="alert-message warning"]'),
        pcTableLocator : () => 'table[class*="computers"]',
        totalElementsBanner :() => cy.get('section[id="main"] h1')
    }
    //method used to click the button that re-directs to add a new computer page
    clickNewComputerButton(){
        this.elements.addNewComputersBtn().click();
    }
    //method used to type a computer name inside of the home page filter, so that then we can click over the search button to display the results inside of the UI computers table
    actionFilterValue(value){
        this.elements.filterComputerBox().type(value);
        this.elements.filterByNameBtn().click();        
    }
   //method used to assert if the alert that is displayed after a product is "added" is displayed
    assertInputItemAlert(text){        
        this.elements.tableProductInsertOKAlert().should('have.text',"Done !  Computer "+text+" has been created")
        //Add a little wait timer to visualize the message a little bit longer
        cy.wait(2000);
    }
    /*method used for the E2E-> Regression and Smoke test impplementations, to search a computer name inside of the paginated UI computers 
    * table recursively by asserting if it was found or not, the search can be done by two modes according to the filter's functionality
    * search by whole word ie: AMIGA or by a fragment word of a whole word ie: AM -> of AMIGA
    */
    assertInputItem($mode){
        //variable that sets true if a computer is found for the whoel and fragment modes
       var valueFound = false;
       // method call constant that will be called recursively until a pc is found or not
       const findInPage = () => {
        //iterate through the table rows
        this.elements.tablePCRows().then(($el) => { 
            //get the number of rows per iteration
            const itemCount = Cypress.$($el).length;
            //iterate through the first row column to get the computer name and be able to assert it with the filter's value
            this.elements.tablePCNameColumn().each(($el, index, $list)=>{
                //get the column computer name text value
                const computerName = $el.text().toUpperCase().trim();                            
                //declare a variable that will hold the filter text value that was previously input
                var filterPCName =  "";
                //get the filter's text value ny invoking its content to string value and then by resolving the promise
                this.elements.filterComputerBox().invoke('val') 
                .then(text => {
                  //update the filterPCName text variable no spaces content  
                  filterPCName = text.toUpperCase().trim();
                  //print a message to the cypress log that tells which row's column computer name is being compared with the current filterPCName text value
                  cy.log("CURRENTLY COMPARING=> FILTER VALUE: "+filterPCName+", COMPUTER NAME COLUMN 1, ROW ["+(index+1)+"] VALUE:"+computerName+", USING THE FOLLOWING COMPARING MODE: "+$mode).then(()=>{
                    //after asserting the results, check if the mode of comparing is whole or fragment
                    if(($mode.trim()).localeCompare("fragment")===0){
                        //if the filter's value is a substring of the main computer's name displayed on the UI computers table assert a true value
                        cy.wrap( expect(computerName.includes(filterPCName)).to.be.true).then(()=>{
                            //print a custom message in the cypress log to tell the fragment corresponds correctly to the table
                            return  Cypress.log({
                                name: 'Fragment Authentication Data',
                                message: 'A row in the table successfully matches with the computer name specified fragment in the filter'
                                })
                          })
                    } else if (($mode.trim()).localeCompare("whole")===0){
                        //if the filter's value totally matches with the main computer's name displed on the UI computers table assert a true value
                        if(computerName.localeCompare(filterPCName)===0){
                        cy.wrap( expect(computerName.localeCompare(filterPCName)).to.equal(0)).then(()=>{
                            //update the boolean variable to true as the computer was already found
                            valueFound = true;
                            //print a custom message in the cypress log to tell the whole computer's name word corresponds correctly to the table
                            return Cypress.log({
                                name: 'Whole Authentication Data',
                                message: 'A row in the table successfully matches with the whole computer name specified  in the filter'
                            }) 
                          })
                        } else {
                            /*continue searching for the computer name if it is not already found, or at least until we are actually at the last
                            * we are at the last pagination page where the button is disabled, we are currently at the last table row element and the value
                            * has not been found yet, this can certainly let us assume 2 thing, the word we are looking is not on the table, or if the
                            * previous conditions do not sum up, we can just assume the current row does not have the wanted computer name
                            */
                            this.elements.paginationNextBtn().then((el) => {
                                if (Cypress.$(el).hasClass("next disabled") && ((itemCount-1)===(index+1)) && valueFound===false) {
                                    //print a custom message to know the computer name we are looking is not on the the table
                                    Cypress.log({
                                        name: 'Row Authentication Data',
                                        message: 'There are no rows in the table that matches the computer name specified in the filter' 
                                    })
                                    expect(computerName.localeCompare(filterPCName)).to.equal(0)
                                } else {
                                    //print a custom message to know that the computer name is not present in the current iterating row
                                    Cypress.log({
                                        name: 'Whole Missing Authentication Data',
                                        message: 'This row in the table do not match with the whole computer name specified in the filter'
                                    })
                                }
                            })    
                        }
                    } 
                  })                  
                   
                });                                                                     
            })
        })  
         //continue clicking the pagination next button 
        this.elements.paginationNextBtn().then((el) => {
            //until we are at the last table pagination page where the button is already disabled
            if (Cypress.$(el).hasClass("next disabled")) {
                return
            } else {
                //click the button
                cy.wrap(el).children().click()
            }
            //call the method recursively at each new page table instance
            findInPage()
        })
    }
    //begin the recursive method call, by first making sure that the table (after inputting the computer name in the filter) it's not empty
    cy.get("body").then($body => {
        //get the table by retrieving the dom body possible table element, if it were to exist
        if ($body.find(this.elements.pcTableLocator()).length > 0) { 
            // if the table exists get the table
            cy.get(this.elements.pcTableLocator())
            .find("tbody>tr")
            .then(() => {
                //begin the method call
                findInPage()                    
            });
        }else{
            // if the table was not found print a custom message to tell that no computer is present in the table
            Cypress.log({
                name: 'Row Authentication Data',
                message: 'There are no rows in the table that matches the computer name specified in the filter' 
            })    
            //assert the presense of the element to throw a test failure
            expect($body.find(this.elements.pcTableLocator()).length > 0).to.be.true
                
        }
    });      
    }
    /* method used to assert if an element that was input by making an API test scenario is present
    * inside the paginated response.
    */
    assertInputAPIItem(component, apiUrl){
        /*first of all we need to make a visit to the page by filtering a value, to be able to recover the total number of elements that we obtain, to be able to calculate later on
        * the total number of paginated pages we will ever obtain, the default set pagination by the dev as we have found out is 10
        */
        cy.visit(apiUrl+'?f='+component.computerName).then(()=>{
            //create once again a recursive method call to validate the response results per each paginated results table
            getAllComputersPerPagination(response => {
                //expect the api call itself to work and to return a 200 status code when a filter search is completed
                expect(response.status).to.eq(200); 
                //save a json object that is the result of the paginated response html table conversion
                const computers = parseHTMLTableElem(parser.parseFromString(response.body, 'text/html'));
                //Write the pagination table file where the computer was found, or send the last pagination table as the computer was never found
                cy.writeFile('cypress/fixtures/apiTableResults.json', computers)
                /*return the results of each paginated iteration, to know if the computer computer's name that is saved in the json computer variable is being found or not,
                * the some logic lets the json content per page be iterated until a match is found
                */
                return computers.some(computer => {                 
                    //save the boolean value to determine if the computer was found or not
                    computerAPIFound = computer["Computer name"] === component.computerName; 
                    //if the computer is found
                    if(computerAPIFound){ 
                        //assert that the computer has been found
                        cy.wrap((expect(computerAPIFound).to.equal(true))).then(()=>{
                            //print a custom message value to tell that the computer was successfully found
                            return Cypress.log({
                                name: 'Whole Authentication Data',
                                message: 'A row in the table successfully matches with the whole computer name specified in the filter'
                            })
                          })
                    } 
                    //return the boolean value until the computer is found
                    return computerAPIFound;
                })
              }, 0, component.computerName, apiUrl, component, this.elements.totalElementsBanner())
        });
    }

}
//method that will be called recursively until the element is found
function getAllComputersPerPagination(onResponse, page, data, apiUrl, component, htmlBannerLocator) {    
    //get the banner locator text to extract its number to calculate the number of iterations that will be present until the computer is found (may be a better way, without using UI, but for the moment it works)
    htmlBannerLocator
    .then($text => {
        //extract the inner text of the banner
        var innerText = $text.get(0).innerText;
        //check if the banner has a content and for instance if it has a visible value
        if(innerText!==""&&innerText!==null){
            //Extract the number of the banner and trim any possible spaces 
            totalElementsBannerNum = (Number(innerText.replace(/\D/g, '').trim())-1).toString(); 
        }      
    //check as an end condition 1 if the page we currently are at is the last page     
    if (page === (Math.ceil(Number(totalElementsBannerNum)/10))){
            //if the element has not being found
            if(!computerAPIFound){                
                //print a custom message that tells the element we have been looking is not present in the table                   
                Cypress.log({
                    name: 'Row Authentication Data',
                    message: 'There are no rows in the table that matches the computer name specified in the filter' 
                })    
                //assert the element was not found
                expect(computerAPIFound).to.be.true
            }
        } 
        //make a custom request taking into account the page and the filter data
        cy.request(`${apiUrl}?p=${page}&f=${data}`)
        .then(response => {
            const found = onResponse(response)
            //if the element is found set a second end condition to return and break the loop
            if (found) return
            // call the method recursively until the computer is found
            getAllComputersPerPagination(onResponse, ++page, data, url, component, htmlBannerLocator) // repeat for next page
        })
        });
    
  }
// Parse HTML table element to JSON array of objects
function parseHTMLTableElem(tableEl) {
    //obtain the thead to get the columns that conforma the computers table
    const columns = Array.from(tableEl.querySelectorAll('th')).map(it => it.textContent)
    //obtain the rows per column that are part of the table body
    const rows = tableEl.querySelectorAll('tbody > tr')
    //make an array map to iterate each row by creating a key value json clause per row element
    return Array.from(rows).map(row => {
        const cells = Array.from(row.querySelectorAll('td'))
        return columns.reduce((obj, col, idx) => {
            obj[col] = cells[idx].textContent
            return obj
        }, {})
    })
}
//return the home page default constuctor object
export default HomePage;
//add xpath interpretation for the location recovery segment detailed in the constructor
require('cypress-xpath')