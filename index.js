// create constants for the parts that the user can interact with
const ingredientsInput = document.getElementById("ingredientsInput");
const addButton = document.getElementById("addButton");

const ingredientsList = document.getElementById("ingredientsList");
const searchButton = document.getElementById("searchButton");


//array to hold the ingredients, will be used with search functionality later with API
let ingredientsArray = [];

// function to add an ingredient to the list
addButton.onclick = function () {

    if (ingredientsInput.value.trim() === "") {
        alert("Please enter an ingredient.");
        return;
    }
    else {
        // get the value from the input field
        const ingredientItem = ingredientsInput.value.trim();

        // check if the ingredient is already in the array
        if (ingredientsArray.includes(ingredientItem)) {
            alert("This ingredient is already in the list.");
            return;
        }

        // add the ingredient to the array
        ingredientsArray.push(ingredientItem);

        //update the ingredients list in the HTML
        const listItem = document.createElement("li");
        listItem.textContent = ingredientItem;

        //also add a delete button to delete ingredient, append
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";


        //add an eventListener to delete the item from both HTML and the array
        deleteButton.onclick = function () {
            listItem.remove();

            //use splice method
            const index = ingredientsArray.indexOf(ingredientItem);
            if (index !== -1) { //remove if it is found/exists
                ingredientsArray.splice(index, 1);
            }
        }


        //appending elements in the HTML
        listItem.appendChild(deleteButton);
        ingredientsList.appendChild(listItem);

        ingredientsInput.value = "";

        console.log(ingredientsArray)
    }

}




//function to search for recipes based on the ingredients usign spoonacular API
searchButton.onclick = function () {

    if (ingredientsArray.length === 0) {
        alert("Please enter at least one item to begin searching for recipes.");
        return;
    }

    //array separated by commas using the join method
    let ingredientQuery = ingredientsArray.join();

    //this will be a GET request since we will just slightly modify the url string 
    fetch("https://api.spoonacular.com/recipes/complexSearch?apiKey=058638cbd95f4a8c82979155c51fbd38&query=" + ingredientQuery + "&number=15")
        .then(response => { //first we need to convert from .json to a format readable by js
            if (!response.ok) {
                console.log("Problem occurred :("); //guard clause for if there was an error in fetching due to invalid link trying to fetch
                alert("Problem");
                return;
            }
            return response.json();
        })
        .then(data => { //function
            console.log(data); //data parsed from .json to an object in js that has its own properties/attributes (id, title, image)

            console.log(typeof data); //check if it is an array, or what other data structure

            //"recipe =>" is an interator variable that will iterate over the object's attribute which is an array (of objects w/ attributes)
            data.results.forEach(recipe => { //The response from the Spoonacular API is a JSON object, and one of its properties is "results", which is an array of recipes.


                //firstly need to make another fetch call replacing the recipe id's to get links to the recipe information
                fetch("https://api.spoonacular.com/recipes/" + recipe.id + "/information?apiKey=058638cbd95f4a8c82979155c51fbd38")
                    .then(response => response.json())
                    .then(infoData => {
                        console.log(infoData);//to check if working

                        const recipeLink = infoData.sourceUrl;

                        document.querySelector("#searchResults").insertAdjacentHTML('beforeend',
                            `<li class = "recipe">
                        <h3 class = "recipe"> ${recipe.title} </h3>
                        <img src = "${recipe.image}" alt = "recipe image"> <br>
                        <a href = "${recipeLink}" class = "recipe">Recipe Link!</a>
                        </li>`);

                        //insertAdjacentHTML with beforeend so they add after each other
                        //create HTML elements, create ID/classes for them to be used within the css stylesheet
                        //want to have a grid-like view, with the title, image, recipe link
                    })
                    .catch(error => {
                        console.log(error);
                    })


            });

        })
        .catch(error => {
            console.log(error);
        });


}
