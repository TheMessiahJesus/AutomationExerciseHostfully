Feature: Computer Database Web Page Validation

    Application Regression
    @Regression
    Scenario: CD001_D001_TS001 Adding a new computer
    Given I open Computer Database io Page
    When I fill the data and add a new computer
    And Validate that a message that the computer was added displays correctly
    Then Use the filter box to assert if the computer exists in the table to verify it was added correctly

   @Smoke
    Scenario: CD001_D001_TS002 Test the filter for correct word fragment and whole incidences
    Given I open Computer Database io Page
    When I fill the filter computer box
    |value | mode |
    |ac | fragment   |
    |amiga 500 | whole   |

    Then Assert that the data that was input matches with the data that is displayed in the UI table

    @API 
    Scenario: CD001_D001_TS003 Test the API calls for adding a computer
    Given I add a computer and assert the page redirect returns a 400 code when doing an add POST call, thus confirming that the web page is read-only as it was deduced on TC #CD001_D001_TS001_TC001
    Then  I assert if the computer exists in the JSON response file that will later on populate the UI computer database table 


    




