
    //check what type of browser is being used and redirect if necesarry
    if(document.getElementById && document.attachEvent){ //newer IE
        
        //this browser is fine, continue on

    }else if(document.getElementById){ //Gecko browser
        
        //this browser is fine, continue on

    }else{ //older browser, need to redirect

        window.location='updateBrowser.html';
    }

    //declare variable for doc body
    var theBody = document.getElementsByTagName('body')[0]; 

    //set IDs and label text for each of the 3 levels of select inputs, each is used throughout
    var positionId = 'position';
    var positionText = '-- Select Position --'
    var countryId = 'country';
    var countryText = '-- Select Birthplace --';
    var playerNumId = 'playernum';
    var playerNumText = '-- Select Player Number --';
    var degrees = 0; //global var used for rotateImg function 


    //once window is loaded generate and create intitial select
    window.onload = function init(){
        
        //create first select
        createOptionSelect('','');
    }

    
    /* Function to create select input with options
     * @param selectId - the ID of the select that the option value is from 
    */
    function createOptionSelect(selectId){

        //determine which option set, ID, and label text
        var nextIdtoUse = determineNextSelectId(selectId);

        //determine path for JSON data file to traverse
        var jsonFullPath = determineOptionsPath(selectId);

        //determine which text to display/which onchange handler based on the ID of the select being created
        var displayText = '';
        var selectHandler = '';
        
        switch (selectId){

            case positionId : 
                displayText = countryText;
                selectHandler = 'removeLatterSelects(this.id); createOptionSelect(this.id);';
                break;
            case countryId :
                displayText = playerNumText;
                selectHandler = 'displayResultText(); disableAllSelects();';
                break;
            default : 
                displayText = positionText; 
                selectHandler = 'removeLatterSelects(this.id); createOptionSelect(this.id);';
                break;
        }

        //create new select element, set ID and Class(es)
        var newSelect = document.createElement('select');
        newSelect.setAttribute('id', nextIdtoUse);
        newSelect.setAttribute('class','select-style');
        newSelect.setAttribute('onchange',selectHandler);

        //add intital empty option to prompt user for selection based on select id
        var firstOptionNode = document.createElement('option');
        firstOptionNode.setAttribute('value','');
        firstOptionNode.appendChild(document.createTextNode(displayText));
        newSelect.appendChild(firstOptionNode);

        //add options from JSON object to select element
        for (newOption in jsonFullPath){

            //create option element, add text node from JSON to new option element, add option to select
            var optionNode = document.createElement('option');
            optionNode.setAttribute('value',newOption);
            optionNode.appendChild(document.createTextNode(newOption));
            newSelect.appendChild(optionNode);

        }
        //add new select-option input to the selects container in the DOM
        document.getElementById('selectsContainer').appendChild(newSelect);
    }


    /* Function to determine which select is needed next based on which one was just used
     * Global values set in the beginning of this file are used for IDs of each select
     * @return nextId - returns the next ID string to use for creating the select-option node
    */
    function determineNextSelectId(currentSelectId){

        var nextId = '';

        switch (currentSelectId){

            case positionId : 
                nextId = countryId;
                break;
            case countryId :
                nextId = playerNumId;
                break;
            default : 
                nextId = positionId; 
                break;
        }
        return nextId; 
    }


    /* Function to determine which path is needed next to traverse the json object based on user selection
     * @return jsonPath - returns the root path, what the user has already selected, to be used with next 
     * selection to generate new select OR final option
    */
    function determineOptionsPath(currentSelectId){

        var jsonPath = sabres;

        switch (currentSelectId){

            case 'position' : 
                jsonPath = sabres[capFirstLetter(document.getElementById(positionId).value)];
                break;
            case 'country' :
                jsonPath = sabres[capFirstLetter(document.getElementById(positionId).value)][document.getElementById(countryId).value];
                break;
            default : 
                jsonPath = sabres;
                break;
        }
        return jsonPath;    
    }


    /* Function to capitalize the first letter of a string
     * @param string - string to capitalize first letter of
     * @return - new string with first letter capitalized
    */
    function capFirstLetter(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    // Function to load text based on final choice
    function displayResultText(){

        //get the values from each of the select options
        var positionVal = document.getElementById(positionId).value;
        var countryVal = document.getElementById(countryId).value;
        var playerNumVal = document.getElementById(playerNumId).value;

        //get the JSON object path for the user's choice
        var finalChoice = sabres[positionVal][countryVal][playerNumVal];

        //create text to display result and add it to DOM
        var resultNode = document.createElement('h1');
        resultNode.setAttribute('id','resultNode');

        var resultNodeText = document.createTextNode('You picked #' +finalChoice.number+ ' ' +finalChoice.name+ ' from ' +finalChoice.country);

        resultNode.appendChild(resultNodeText);
        document.getElementById('resultText').appendChild(resultNode);
        document.getElementById('resultText').appendChild(addResetButton());
        fadeIn('resultText',25); 
        rotateImg(degrees, 1);

    }


    //function to rotate sabres image and replace with player image
    function displayImageResult(){
        var imgURL = 'img/'+sabres[capFirstLetter(document.getElementById(positionId).value)][document.getElementById(countryId).value][document.getElementById(playerNumId).value]['img'];
        document.getElementById('imageAppear').setAttribute('src',imgURL);
    }


    // Function to disable all select inputs
    function disableAllSelects(){

        //set all select inputs to disabled
        var selects = document.getElementsByTagName('select');

        console.log(selects);

        for (var i = 0; i < selects.length; i++){

            var changeThis = selects[i].id.toString();
            var node = document.getElementById(changeThis);

            if (node.parentNode){
                node.setAttribute('disabled','disabled');
            }    
        }  
    }


    /* Function to create reset button
     * @return newButton - the newly created button
    */
    function addResetButton(){

        var buttonEle = document.createElement('button');
        buttonEle.setAttribute('class','reset-btn');
        buttonEle.setAttribute('onclick','reloadPage();');
        var buttonText = document.createTextNode('Reset');
        buttonEle.appendChild(buttonText);

        return buttonEle; 
    }


    /* Function to determine if earlier select changed and, if so, remove latter selects
     * @param idOfSelectChanged - the id of the select that the user has gone back and changed
    */
    function removeLatterSelects(idOfSelectChanged){

        //create nodeList and assign element clicked to local var
        var selects = document.getElementsByTagName('select');
        var ele = document.getElementById(idOfSelectChanged); 
        var indexOfEle = 0; //for removing selects
        var arrayOfIdsToDelete = new Array(); 
        var nodesListLength = selects.length;
        var removeFrom = document.getElementById('selectsContainer');

        //get index of element in nodeList 
        for (var i = 0; i < selects.length; i++){
            if (selects[i] == ele) {
                indexOfEle = i;
            }
        } 

        //loop through nodesList of selects and remove the selects that come after the recently changed select
        for (var i = indexOfEle+1; i < nodesListLength;){

            nodesListLength--;
            var addThis = selects[i].id.toString();
            var node = document.getElementById(addThis);

            if (node.parentNode){
                node.parentNode.removeChild(node);
            }    
        }     
    }


    // Function to reload page - clearing the selects and results
    function reloadPage(){
        document.location.reload();
    }


    /* Function to animate "fade in" an object in DOM
     * @param objectId - the ID of the object to fade in
     * @param time - length of time to fade in object
    */
    function fadeIn(objectId, time){

        objectToShow = document.getElementById(objectId);

        //get the opacity of the object (set by CSS) and gradually increase by .01 until opacity is 1.0
        if(parseFloat(objectToShow.style.opacity) < 1.0){
            objectToShow.style.opacity = parseFloat(objectToShow.style.opacity)+.01;
            setTimeout(function(){fadeIn(objectId,time);}, time);
        }

    }


    /* Function to create a loading animation by rotating the default img before loading the result img
     * @param numDegrees - the current degree rotation of the image
     * @param speed - length of time between each degree rotation
    */
    function rotateImg(numDegrees, speed){

        var finished = false;

        degrees = numDegrees;
        document.getElementById('imageAppear').style.transform = 'rotate('+degrees+'deg)';

        if(degrees < 359){
            setTimeout(function(){rotateImg(degrees,speed);},speed);
            degrees++;
        }else{
            displayImageResult();
            return; //exit once 360 degrees has been reached
        }   
    }


    

    

    








    