// Initial quotes data
let quotes = [
    { text: "Life is what happens while you're busy making other plans.", category: "Life" },
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "In three words I can sum up everything I've learned about life: it goes on.", category: "Life" },
    { text: "Success is not final, failure is not fatal.", category: "Success" }
  ];
  
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
    
    // Append all elements to the form container
    formContainer.appendChild(heading);
    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
    
    // Add the form after the newQuote button
    document.getElementById('newQuote').after(formContainer);
    
    // Add event listener to the new button
    addButton.addEventListener('click', addQuote);
  }
  
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

  // Create the form when the page loads
  createAddQuoteForm();

  // Show initial random quote
  showRandomQuote();