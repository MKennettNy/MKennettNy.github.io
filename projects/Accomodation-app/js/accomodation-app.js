// DOM Elements
let SnackListEl = $(".snack-list");
let categoryListEl = $(".category-list");
let player = $("#player");
let screenLinks = $(".screen-link");
let screens = $(".screen");
let searchBtn = $(".searchBtn");
let backBtn = $("#backBtn");
let locationInput = $("#locationInput");
let snackData;
let categoryData;
let eventData;
let screenId;


// Initialize the app.
function init() {
   $.getJSON("json/accomodation.json", function(snacks) {
       snackData = snacks;
       displaySnacks(snackData.snacks);
   });

   //get categories
   $.getJSON("json/categories.json", function(categories) {
    categoryData = categories;
    displayCategories(categoryData.categories);
    });

    // routing
    screenLinks.on("click", changeScreen);
    if(localStorage.getItem("currentScreen")){
        screenId = localStorage.getItem("currentScreen");
        let screenLink = $("*[data-screen='" + screenId + "']");
        screenLink.click();
    } else {
        localStorage.setItem("currentScreen", screenId);
    }

    searchBtn.on("click", function () {
        // go to choose snacks screen
        screenLinks.eq(1).click();
        doAdvanvedSearch();
    });

    backBtn.on("click", function () {
        // go to choose home page screen
        screenLinks.eq(0).click();
    });
}

// Display the videos that match the title
// @param {string} video
function filterByTitle(snacks, title){
   return snacks.filter(function(snack){
       return snack.title.toLowerCase().includes(title.toLowerCase());
   });
}

// Get the HTML String for one vide list item.
// @param {object} video
function getSnackItemHTML(snacks) {
   return `<div data-id="${snacks.id}" class="thumbnails snack-item modaal">
               <img class="inline" src="/images/${snacks.thumbnails}.jpg" >
               <h4 id="name">${snacks.name}</h4>
               <h4 id="price">$${snacks.price} Per Night</h4>
           </div>`
};


// Display a list of videos.
function displaySnacks(snacks) {
    let htmlString = "";
    $.each(snacks, function (i, snack) {
        htmlString = htmlString + getSnackItemHTML(snack);
    });
    SnackListEl.html(htmlString);
    // add click event listener to each video item.
    let snackItems = $(".snack-item");
    snackItems.on("click", function () {
        $(".inline").modaal({
            content_source: "#inline"
        });
        let snackId = parseInt($(this).data("id"));
        let snack = snackData.snacks[snackId]
        $("#description").html(snack.description)
        let mainImage = $("#thumbnails1");
        mainImage.attr("src", "/images/" + snack.thumbnails + ".jpg");
        let subImage1 = $("#thumbnailsSub1");
        subImage1.attr("src", "/images/" + snack.thumbnailsSub1 + ".jpg");
        let subImage2 = $("#thumbnailsSub2");
        subImage2.attr("src", "/images/" + snack.thumbnailsSub2 + ".jpg");
        $("#title").html(snack.name);
        let bookBtn = $("#bookBtn");
        bookBtn.attr("href", snack.bookingUrl);

    });
};

// Play the video
// @param {String} videoId

function getCategoryItemHTML(category) {
    return `<li data-categoryid="${category.id}" class="category-item">
                ${category.name}
            </li>`;
 }

// display the video categories
// @param {String} videoId
function displayCategories(categories) {
    let htmlString = "";
   $.each(categories, function(i, category){
       htmlString = htmlString + getCategoryItemHTML(category);
  });
   categoryListEl.html(htmlString);
//    add click event listener to each video item.
   let categoryItems = $(".category-item");
   categoryItems.on("click", function(){
       let categoryId = $(this).data("categoryid");
       if (categoryId === 5){
           displaySnacks(snackData.snacks)
       } else {
       let filteredSnacks = filterByCategory(snackData.snacks, categoryId);
       displaySnacks(filteredSnacks);
       }
   });
}

function filterByCategory(snacks, categoryId){
    return snacks.filter(function (snack){
        return snack.categoryId == categoryId;
    });
}

function changeScreen(){
    if(!screenId){
        screenId = $(this).data("screen");
    }
    screenLinks.removeClass("active");
    $(this).addClass("active");
    if(screenId === "quote-details" && !eventData) {
        loadQuoteScreen();
    }
    screens.removeClass("active");
    $("#" + screenId).addClass("active");

    localStorage.setItem("currentScreen", screenId)

    screenId = null;
}

function loadQuoteScreen(){
}

function filterBylocation(snacks, location){
    return snacks.filter(function (snack){
        return snack.location.toLowerCase().includes(location.toLowerCase());
    });
}

function doAdvanvedSearch(){
    let location = locationInput.val();
    let filteredSnacks = filterBylocation(snackData.snacks, location);
    displaysnacks(filteredSnacks);
}


init();
