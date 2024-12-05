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