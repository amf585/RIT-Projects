/* function to assign active class to the current page based on the url
*/
function activeLink() {
    
    //get all anchor elements in the navbar 
    var navLinks = $('#navList li a');
    
    //get the end of the url after the last slash
    var currentUrl = window.location.pathname.split('/');
    var currentPage = currentUrl[currentUrl.length-1];
    
        //for each anchor element in the navbar compare the end of the link to the current page
        for (var i = 0; i < navLinks.length; i++) {
            
            //get the end of the url after the last slash
            var linkUrl = navLinks[i].href.split('/');
            var compareLink = linkUrl[linkUrl.length-1];
            
            //compare links and assign "active" class to the match
            if(compareLink == currentPage) {
                navLinks[i].parentNode.className += "active";
                console.log('match!');
            }
        }
    
}


/* function to add or remove 'responsive' class to navbar items for responsive top navbar menu
*/
function navbarRespond() {
        
    var navbar = document.getElementById("navList");

    if (navbar.className === "navbar") {
        navbar.className += " responsive";
    }else{
        navbar.className = "navbar";
    } 
}
