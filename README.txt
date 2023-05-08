Steps to Execute Automation Exercise Hostfully:

To execute the automation test cases for the demo application available at https://computerdatabase.gatling.io/computers, with a focus on adding a new computer functionality, but not limited to it, follow the below steps:

1. Open a new project folder named AutomationExerciseHostfully using Visual Studio code(or any editor/IDE you prefer), so that you can clone the repository locally using the following Github link:
https://github.com/TheMessiahJesus/AutomationExerciseHostfully
1.1. (Recomended) If you may want to install Visual Studio as I have, do as follows, else go to step 2:
	A) Go to Google and type download visual studio code
	B) Open the first link and install visual studio code for your operative system
	C) Open the installer and click next->next->next->Install until the installation concludes
	D) Press over the "Finalize" button to finish the installation
2) Go back to the GitHub web page and copy the clone repository link
3) Set up the cloned repository inside visual studio(or the ide or text editor you are using), but before make sure to have downloaded git for your OS (in my case it was windows), if not please install it first.
4) Now, for visual studio, or whichever IDE you are using(for other ides this steps may vary): 
	A) Clone the previously copied GitHub repository inside it, by using the clone repository button which is accessed through the left pane panel git branches icon
	B) On the top displayed bar paste the repository link and hit enter
	C) Select the repository folder location in your operative system, where the project will be downloaded locally, use the recommended folder stated on step 1 
	D) Wait until the project repository is cloned by following the visual studio step by step guide
	E) If the previous A-C steps did not work, use the following link to guide yourself on how to clone the repository using the terminal: https://www.geeksforgeeks.org/how-to-clone-a-project-from-github-using-vscode/
5) Open the project terminal (inside Visual Studio if you are using it, or the IDE you are using) and update the project dependencies:
	A) Go to the terminal section in the lower right screen section of the visual studio and type the following command: "npm install"
	A.1) The previous step should prompt an error unless you have already installed node.js in your operative system. To do that, do as follows (if you do not have it):
		A.1.1) Open the web browser and go to nodejs.org/en/download/ and install it. Open the .msi file by double clicking it after download and click next->next->next->install
		A.1.2) Make sure you have this node environment variable set in your operative system
		A.1.3) Restart visual studio code and test once again the npm install command in the previously cloned github repository(Now, it should work as expected)
6) For testing the automated test cases, there are 2 ways, by using the following predefined script commands I have created:

						First Command: npm run openC

This will open the cypress dashboard, where you can select the browser that you want to use to automate (this is a headed UI mode dashboard for testing)
Then, you will be able to select the automated test cases based on your need. (if an error appears please execute the following command: npx cypress install, and try again)
In this segment, you just have to click any test case visually, and automatically it will start automating(even though here we only have one test file with 3 test case scenarios, but nevertheless it is good to know)
On the left side of the cypress dashboard, you have the cypress console, which lets you access each test step interactively and shows assertions that work as step confirmations or in the case of the expected and actual results in form of acceptance tests.
On the right side, you have the DOM web page content UI subject of the test steps that make it change.
->These test file is found in the framework(project folder) in the following path AUTOMATIONEXCERCISEHOSTFULLY/cypress/integration, so you can also check the implementation and some code comments if you may want to. Also as the test scenarios are made using Cucumber, you might also want to check the computerDatabase.feature file.
(For this feature file and some syntax errors that may prompt you may want to also install the following plugin in your visual studio or ide you are using: https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete , it mainly provides support for the Cucumber (Gherkin) language to VS Code)

						Second Command: npm run chromeTestR

This will open by default a chrome browser instance (here you may actually need to have chrome browser installed in your pc, or change the script section inside the package.json file for the browser you have), and test automatically all the test cases one after another by generating evidence videos as well as console acceptance testing results.
Finally, when it finishes it will close and leave the results in the terminal.

As mentioned previously, the results are obtained in the terminal log, as well as the prerecorded test execution video files that will be located inside the AUTOMATIONEXCERCISEHOSTFULLY/cypress/videos folder
                   Extra Commands: 
                   npm run mochaReportsComputerDatabase
                   npm run mochaReportsAll
                   npm run cypressDashboardAll
This commands use a framework called mochawesome report and cypress dashboard to generates html reports, the mochaComputerDatabase one generates a template just for 
the test scenarios in this computerDataBase.feature test file, the mochaReportsAll for all of the possible test files that will be added in the future (these first two ones use mochawesome), and cypressDashboardAll for all test files in the project and uses cypress dashboard to do it. It is important to keep in mind that each test scenario that is executed replaces the last test execution report results.

I have also included some important files in this project aside of the automation ones, that are the following:

-Test file execution reports:

1) mochawesome(located in AUTOMATIONEXERCISEHOSTFULLY->cypress->results->(for visual experience open in a web browser)mochaawesome.html)
2) cypress dashboard reports, that save the results to the cypress online dashboard which I let it have a public access to whomever has this url: https://cloud.cypress.io/projects/e1u7o8/runs/2/test-results?actions=%5B%5D&browsers=%5B%5D&groups=%5B%5D&isFlaky=%5B%5D&modificationDateRange=%7B%22startDate%22%3A%221970-01-01%22%2C%22endDate%22%3A%222038-01-19%22%7D&orderBy=EXECUTION_ORDER&oses=%5B%5D&specs=%5B%5D&statuses=%5B%5D&testingTypesEnum=%5B%5D. 

-Conclusions text file for optional steps 4 and 5, and the excel document that contains the RTX manual test matrix for this exercise. Both of them, are inside AUTOMATIONEXERCISEHOSTFULLY->Manual Test RTM folder
