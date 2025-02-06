// Initial quotes data
let quotes = [
  { text: "Life is what happens while you're busy making other plans.", category: "Life" },
  { text: "The only way to do great work is to love what you do.", category: "Work" },
  { text: "In three words I can sum up everything I've learned about life: it goes on.", category: "Life" },
  { text: "Success is not final, failure is not fatal.", category: "Success" }
];

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}


// Function to create and add the form to the page
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.className = 'form-group';

  // Create form elements
  const heading = document.createElement('h2');
  heading.textContent = 'Add New Quote';

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.id = 'addQuote';
  addButton.textContent = 'Add Quote';

  // const exportButton = document.createElement('button');
  // exportButton.id = 'exportQuotes';
  // exportButton.textContent = 'Export Quotes';

  // const importInput = document.createElement('input');
  // importInput.type = 'file';
  // importInput.id = 'importFile';
  // importInput.accept = '.json';

  // Append all elements to the form container
  formContainer.appendChild(heading);
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
  // formContainer.appendChild(exportButton);
  // formContainer.appendChild(importInput);

  // Add the form after the newQuote button
  document.getElementById('importFile').after(formContainer);

  //Define variables for the export btn and import input
  const exportButton = document.getElementById('exportQuotes');
  const importInput = document.getElementById('importFile');

  // Add event listener to the new button
  addButton.addEventListener('click', addQuote);
  exportButton.addEventListener('click', exportQuotes);
  importInput.addEventListener('change', importFromJsonFile);
}

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById('quoteDisplay').innerHTML = `<p>No quotes available. Add a new quote!</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  document.getElementById('quoteDisplay').innerHTML = `
      <p class="quote-text">${quote.text}</p>
      <p class="quote-category">Category: ${quote.category}</p>
    `;

  // Save the last viewed quote in session storage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Add event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Function to load the last viewed quote from session storage
function loadLastViewedQuote() {
  const lastQuoteJSON = sessionStorage.getItem("lastViewedQuote");

  if (lastQuoteJSON) {
    const lastQuote = JSON.parse(lastQuoteJSON);
    document.getElementById('quoteDisplay').innerHTML = `
        <p class="quote-text">${lastQuote.text}</p>
        <p class="quote-category">Category: ${lastQuote.category}</p>
      `;
  } else {
    // If no quote was stored, show a random one
    showRandomQuote();
  }
}

function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  
  // Extract unique categories from the quotes array
  const categories = [...new Set(quotes.map(quote => quote.category))];
  
  // Clear existing options except the first one ("All Categories")
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  // Add each category as an option in the dropdown
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  
  // Load the last selected filter from local storage
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    categoryFilter.value = lastFilter;
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  
  // Save the selected filter to local storage
  localStorage.setItem('lastFilter', selectedCategory);
  
  // Filter quotes based on the selected category
  const filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);
  
  // Display the filtered quotes
  displayQuotes(filteredQuotes);
}

function displayQuotes(quotesToDisplay) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = ''; // Clear the current display
  
  if (quotesToDisplay.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available in this category.</p>`;
    return;
  }
  
  // Display each quote
  quotesToDisplay.forEach(quote => {
    const quoteElement = document.createElement('div');
    quoteElement.innerHTML = `
      <p class="quote-text">${quote.text}</p>
      <p class="quote-category">Category: ${quote.category}</p>
    `;
    quoteDisplay.appendChild(quoteElement);
  });
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    //Load existing quotes from Local Storage before adding a new one
    loadQuotes();
    // Add the new quote to the existing quotes

    quotes.push({ text, category });

    // Save the quotes to local storage
    saveQuotes();

    //Clear input fields
    textInput.value = '';
    categoryInput.value = '';

    // Repopulate categories in the dropdown
    populateCategories();

    // Show a random quote
    showRandomQuote();
  } else {
    alert('Please enter both quote text and category');
  }
}

// **🔹 JSON EXPORT FUNCTION**
function exportQuotes() {
  const jsonData = JSON.stringify(quotes, null, 2); // Convert quotes array to JSON
  const blob = new Blob([jsonData], { type: "application/json" }); // Create a JSON file
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json"; // Set the download filename
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a); // Clean up after download
}

// **🔹 JSON IMPORT FUNCTION**
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(event) {
      try {
          const importedQuotes = JSON.parse(event.target.result);

          if (Array.isArray(importedQuotes)) {
              quotes.push(...importedQuotes);
              saveQuotes();
              alert("Quotes imported successfully!");
              showRandomQuote(); // Show a new quote from imported ones
          } else {
              alert("Invalid file format. Please upload a valid JSON file.");
          }
      } catch (error) {
          alert("Error reading JSON file.");
      }
  };

  fileReader.readAsText(event.target.files[0]);
}

// Load quotes when the page loads
document.addEventListener("DOMContentLoaded", function () {
  loadQuotes(); // Load existing quotes from local storage
  createAddQuoteForm();
  populateCategories(); // Populate the category dropdown
  loadLastViewedQuote(); // Show a random quote from loaded data
});

