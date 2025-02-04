// Initial quotes data
let quotes = [
    { text: "Life is what happens while you're busy making other plans.", category: "Life" },
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "In three words I can sum up everything I've learned about life: it goes on.", category: "Life" },
    { text: "Success is not final, failure is not fatal.", category: "Success" }
  ];
  
  // Create and append the form for adding new quotes
  const formHTML = `
    <div class="form-group">
      <h2>Add New Quote</h2>
      <input type="text" id="newQuoteText" placeholder="Enter a new quote" />
      <input type="text" id="newQuoteCategory" placeholder="Enter quote category" />
      <button id="addQuote">Add Quote</button>
    </div>
  `;
  
  // Add form after the newQuote button
  document.getElementById('newQuote').insertAdjacentHTML('afterend', formHTML);
  
  // Function to show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    document.getElementById('quoteDisplay').innerHTML = `
      <p class="quote-text">${quote.text}</p>
      <p class="quote-category">Category: ${quote.category}</p>
    `;
  }
  
  // Function to add a new quote
  function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();
    
    if (text && category) {
      quotes.push({ text, category });
      textInput.value = '';
      categoryInput.value = '';
      showRandomQuote();
    } else {
      alert('Please enter both quote text and category');
    }
  }
  
  // Add event listeners
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('addQuote').addEventListener('click', addQuote);
  
  // Show initial random quote
  showRandomQuote();