# Toby Hunter's Portfolio

## Github to Codecks
An application that allows the user to select any issue existing in a GitHub repo that the user is the owner of and copies it to Codecks. The resulting card will have the title, body and tags that were originally entered/applied to the issue.

![GTCMain](https://github.com/LegendarySpork9/Portfolio/blob/main/Images/GTC/Main.png?raw=true)

The user first selects the GitHub repository from which to select the issues. Once selected, the tool compares the issues against the existing cards in Codecks. If there are issues found that don’t exist as cards, then they are present to the user to pick from.

![GTCRepo](https://github.com/LegendarySpork9/Portfolio/blob/main/Images/GTC/Repo.png?raw=true)

Now the user selects the issue which then triggers the tool to get a list of the projects in Codecks. These are then displayed for the user to chose from. Whatever project is chosen is where the card will be created.

![GTCIssue](https://github.com/LegendarySpork9/Portfolio/blob/main/Images/GTC/Issue.png?raw=true)

With the options chose, the “Confirm and Send” button enables. Once clicked, this will send all the issues information through the Codecks API and into a card that can be viewed on the website by anyone with access to that project. After the button is clicked and the card created, the process is repeated by the repo box unlocking so the options can be chosen from.

![GTCProject](https://github.com/LegendarySpork9/Portfolio/blob/main/Images/GTC/Project.png?raw=true)

Configuration of the tool is minor and simply requires the user to edit the App.config and enter the required values under “appSettings”. These are GitHub Login, GitHub Bearer Token, Codecks Sub Domain and Codecks Auth Token.

#### Repo Link: https://github.com/LegendarySpork9/Other-Projects/tree/main/Github%20to%20Codecks

## NASA Image Report
This tool uses the NASA image RSS API feed to gather all the images taken by the Perseverance rover on mars for the current Sol date. It also uses the NASA planetary API to get the image of the day. Once done, it compiles information and the downloaded images into a word document for viewing.

### Image of the Day
For this it gathers the URL of the image and relevant information about the image that might be useful to the viewer.
* Title
* Copyright
* Explanation
* URL

### Rover Images
With the images taken by the rover, a lot more useful and interesting information is provided along with the image itself. Such as camera data, site number, altitude, time data etc. What is pulled from the API and displayed to the user is the following:
* Title
* Site
* Date Taken
* Date Received

### Document
The resulting format of the document is the images information followed by the image itself. Depending on the size of the image it can look weird when the information and image are on separate pages.

### Operation
When opened, the console window first reports the sole day and the status of the image download. It will process 10 files simultaneously once the links are obtained from the API.

![Rover Image](https://github.com/LegendarySpork9/Portfolio/blob/main/Images/NIR/Rover%20Image%20Download.png?raw=true)

Then it downloads the image of the day once the information has been gathered from the API.

![IOTD](https://github.com/LegendarySpork9/Portfolio/blob/main/Images/NIR/Image%20of%20the%20Day%20Download.png?raw=true)

Finally, it adds all the information and images to a new word document. The is starts with the image of the day and then followed by sequentially added rover images.

![Document Creation](https://github.com/LegendarySpork9/Portfolio/blob/main/Images/NIR/Document%20Creation.png?raw=true)

The only configuration required is the NASA API key which is entered under “appSettings” in the App.config.

#### Example: [Image Report 05-12-2024.docx](https://docs.google.com/document/d/1n6-er5WqYTv0FbAay_4h0RG4jD9v0LAT/edit?usp=sharing&ouid=113743718120979941482&rtpof=true&sd=true)

#### Repo Link: https://github.com/LegendarySpork9/Other-Projects/tree/main/NASA%20Image%20Report

## Database BLM Creator
Constructed to take fields and vales from a SQL database table and compile it into a BLM with images stored as URLs. This app uses hard coded mappings to map the SQL field to the BLM field. It will convert values to what the Rightmove V3 definition states if the values need to be specific e.g. Property Types. Once created, the BLM is zipped and uploaded to an FTP site specified in the App.config. The tool uses a given template file, from which to create the BLM.

### Operation
First the tool connects to SQL using the specified connection string and obtains the server and database names of the given customers. It also gets the branch ids from a setting applied to the customer. This branch id is used in the file names.
Then it will connect to each customer database sequentially and gather the property data into memory.
Once done, it will then convert that into a BLM file, output and zip before sending to the FTP site.
After this has been completed, it will move onto the next branch/customer.

### Run Types
The tool is configured with two run types, run and test. For each run type there are optional parameters that can be added to limit the customers it is configured to operate for. The third run type is the default which just runs all customers and branches.

### Run
If entered, this command will run all customers and branches, uploading the resulted BLM to the given FTP site. Additionally, it has two parameters, customer and branch. These can be used to limit the operational scope of the tool. <span style="color:red">Note: The tool will only operate for customers and branches it is configured for. </span>

The syntax of the command is important, first is the operation “-test”, second is the customer “test” and third is the branch “BLM13245Derby”. Each value must be separated by a space to be loaded.

![Run](https://github.com/LegendarySpork9/Portfolio/blob/main/Images/DBLMC/Run%20One.png?raw=true)
![Run Two](https://github.com/LegendarySpork9/Portfolio/blob/main/Images/DBLMC/Run%20Two.png?raw=true)

### Test
When entered, the tool will perform some of the same steps that the run command will. It will still get the data from the database, but it will not create the file or upload it to the FTP. Instead, it will produce a count of the number of BLM files that would be created and uploads a test BLM to the FTP site to test connectivity. <span style="color:red">Note: Like the run command the tool will only operate for customers and branches it is configured for. </span>

The syntax for this command is the same as the run command where the operation comes first “-test” followed by customer and branch.

![Test](https://github.com/LegendarySpork9/Portfolio/blob/main/Images/DBLMC/Test.png?raw=true)

Configuration is done through the “appSettings” tag in the App.config.

#### Repo Link: https://github.com/LegendarySpork9/Database-BLM-Creator

## RAG V3
The RAG V3 tool is designed to gather data from each of our customer systems for use in reporting on the data coming in from their account CRMs. It will run given scripts on each system to then decide if everything is working as it should be. Each system and source of data is given a RAG status from one to five.
* One – Dark Red
* Two – Red
* Three – Yellow
* Four – Green
* Five – Dark Violet

Each status has its own meaning where green is all good, Dark Violet is to be ignored, yellow is everything is working but nothing new has arrived and the reds are where something isn’t working. The difference between dark and normal red is whether the customer is active in system use.

![Main](https://github.com/LegendarySpork9/Portfolio/blob/main/Images/RAGV3/Main.png?raw=true)

### Run Types
There are two run types, run and refresh. When run is chosen, it will set the status of all customers in the output database to deleted, then checks the input database to gather key information on each customer such as the database and server names, status and data sources. Then it goes to each system and gathers further information in parallel up to a specified number. Finally, it will sequentially run the bigger analytical scripts to decide RAG status and update ignore information. Finally, it outputs all the information to be picked up by the dashboard that uses this.

The refresh command takes the given customer number and performs the same steps as the run command but without changing the customer status in the output database.

![Console Run](https://github.com/LegendarySpork9/Portfolio/blob/main/Images/RAGV3/Run%20One.png?raw=true)

### Log4Net
Like most of my tools, the Log4Net library is used to perform detailed logging to both a .log file and a SQL table. Diagnostic information is logged to the .log file while errors and logged to a SQL table that can be viewed on a dashboard. While the console shows on the surface information, the log files contain detailed logging like the data in the database, RAG status decision, exclusion information and output progress.

![Log File Run](https://github.com/LegendarySpork9/Portfolio/blob/main/Images/RAGV3/Run%20Two.png?raw=true)
![Log File Run Two](https://github.com/LegendarySpork9/Portfolio/blob/main/Images/RAGV3/Run%20Three.png?raw=true)
![Log File Run Three](https://github.com/LegendarySpork9/Portfolio/blob/main/Images/RAGV3/Run%20Four.png?raw=true)

Minor configurtion required under "appSettings" in App.config to allow for operation.

#### Repo Link: https://github.com/LegendarySpork9/RAG-Report-V3
