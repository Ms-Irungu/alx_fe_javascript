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

// Fetch quotes from JSONPlaceholder
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const posts = await response.json();
    // Transform posts into quotes format
    const serverQuotes = posts.slice(0, 5).map(post => ({
      text: post.body.split('\n')[0], // Take first line of post body as quote
      category: post.title.split(' ')[0] // Take first word of title as category
    }));
    
    return serverQuotes;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    showNotification('Error fetching quotes from server', 'error');
    return null;
  }
}

// Post quotes to JSONPlaceholder
async function postQuotesToServer(quotes) {
  try {
    const promises = quotes.map(quote => 
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: quote.category,
          body: quote.text,
          userId: 1
        }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      })
    );

    const responses = await Promise.all(promises);
    const results = await Promise.all(responses.map(r => r.json()));
    
    showNotification('Quotes successfully synced with server', 'info');
    return results;
  } catch (error) {
    console.error('Error posting quotes:', error);
    showNotification('Error syncing quotes with server', 'error');
    return null;
  }
}

// Sync local data with server data
async function syncLocalDataWithServer() {
  try {
    showNotification('Syncing with server...', 'info');
    const serverQuotes = await fetchQuotesFromServer();
    
    if (serverQuotes) {
      const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
      
      // Merge server and local quotes, removing duplicates
      const mergedQuotes = [...localQuotes];
      
      serverQuotes.forEach(serverQuote => {
        const exists = localQuotes.some(localQuote => 
          localQuote.text === serverQuote.text && 
          localQuote.category === serverQuote.category
        );
        
        if (!exists) {
          mergedQuotes.push(serverQuote);
        }
      });
      
      // Update local storage and memory with merged quotes
      localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
      quotes = mergedQuotes;
      
      // Update UI
      populateCategories();
      showRandomQuote();
      
      showNotification('Sync completed successfully', 'info');
    }
  } catch (error) {
    console.error('Sync error:', error);
    showNotification('Error during sync process', 'error');
  }
}

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
      await postQuotesToServer([{ text, category }]);
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
          await postQuotesToServer(importedQuotes);
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