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
  } else {
    // If no quotes in localStorage, save the initial quotes
    saveQuotes();
  }
  // Immediately display a quote after loading
  showRandomQuote();
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Simulate fetching quotes from the server
async function fetchQuotesFromServer() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate server response using localStorage as a mock server
      const serverQuotes = JSON.parse(localStorage.getItem("serverQuotes")) || quotes;
      resolve(serverQuotes);
    }, 1000); // Simulate network delay
  });
}

// Simulate posting quotes to the server
async function postQuotesToServer(quotes) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate saving quotes to the server
      localStorage.setItem("serverQuotes", JSON.stringify(quotes));
      resolve();
    }, 1000); // Simulate network delay
  });
}

// Sync local data with server data
async function syncLocalDataWithServer() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    // Check if server data is different from local data
    if (JSON.stringify(localQuotes) !== JSON.stringify(serverQuotes)) {
      // Server data takes precedence in case of discrepancies
      localStorage.setItem("quotes", JSON.stringify(serverQuotes));
      quotes = serverQuotes; // Update the in-memory quotes array

      // Notify the user that data has been updated
      showNotification("Data has been synchronized with the server");

      // Refresh the UI
      populateCategories();
      showRandomQuote();
    }
  } catch (error) {
    showNotification("Error syncing with server", "error");
  }
}

// Start periodic sync with server
function startPeriodicSync() {
  // Initial sync
  syncLocalDataWithServer();
  
  // Set up periodic sync every 30 seconds
  setInterval(syncLocalDataWithServer, 30000);
}

// Show notification to user
function showNotification(message, type = "info") {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = "block";

  // Hide the notification after 3 seconds
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

// Function to create and add the form to the page
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.className = 'form-group';

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

  formContainer.appendChild(heading);
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.getElementById('newQuote').after(formContainer);

  addButton.addEventListener('click', addQuote);
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

  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  
  const categories = [...new Set(quotes.map(quote => quote.category))];
  
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  
  const filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);
  
  displayQuotes(filteredQuotes);
}

function displayQuotes(quotesToDisplay) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';
  
  if (quotesToDisplay.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available in this category.</p>`;
    return;
  }
  
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
async function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    
    // Sync with server
    try {
      await postQuotesToServer(quotes);
      showNotification("Quote added and synced with server");
    } catch (error) {
      showNotification("Quote added locally but failed to sync with server", "error");
    }
    
    textInput.value = '';
    categoryInput.value = '';

    populateCategories();
    showRandomQuote();
  } else {
    alert('Please enter both quote text and category');
  }
}

// Export quotes function
function exportQuotes() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Import quotes function
async function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = async function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        
        // Sync with server
        try {
          await postQuotesToServer(quotes);
          showNotification("Quotes imported and synced with server");
        } catch (error) {
          showNotification("Quotes imported locally but failed to sync with server", "error");
        }
        
        populateCategories();
        showRandomQuote();
      } else {
        alert("Invalid file format. Please upload a valid JSON file.");
      }
    } catch (error) {
      alert("Error reading JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// Manual refresh button handler
async function handleManualRefresh() {
  showNotification("Syncing with server...");
  await syncLocalDataWithServer();
}

// Initialize everything when the page loads
document.addEventListener("DOMContentLoaded", function() {
  loadQuotes();
  
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
  document.getElementById('refreshData').addEventListener('click', handleManualRefresh);
  
  createAddQuoteForm();
  populateCategories();
  
  // Start periodic sync with server
  startPeriodicSync();
});