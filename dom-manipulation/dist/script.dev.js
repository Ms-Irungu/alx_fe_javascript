"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// Initial quotes data
var quotes = [{
  text: "Life is what happens while you're busy making other plans.",
  category: "Life"
}, {
  text: "The only way to do great work is to love what you do.",
  category: "Work"
}, {
  text: "In three words I can sum up everything I've learned about life: it goes on.",
  category: "Life"
}, {
  text: "Success is not final, failure is not fatal.",
  category: "Success"
}]; // Function to load quotes from local storage

function loadQuotes() {
  var storedQuotes = localStorage.getItem("quotes");

  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // If no quotes in localStorage, save the initial quotes
    saveQuotes();
  } // Immediately display a quote after loading


  showRandomQuote();
} // Function to save quotes to local storage


function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
} // Fetch quotes from JSONPlaceholder


function fetchQuotesFromServer() {
  var response, posts, serverQuotes;
  return regeneratorRuntime.async(function fetchQuotesFromServer$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch('https://jsonplaceholder.typicode.com/posts'));

        case 3:
          response = _context.sent;

          if (response.ok) {
            _context.next = 6;
            break;
          }

          throw new Error('Network response was not ok');

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          posts = _context.sent;
          // Transform posts into quotes format
          serverQuotes = posts.slice(0, 5).map(function (post) {
            return {
              text: post.body.split('\n')[0],
              // Take first line of post body as quote
              category: post.title.split(' ')[0] // Take first word of title as category

            };
          });
          return _context.abrupt("return", serverQuotes);

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching quotes:', _context.t0);
          showNotification('Error fetching quotes from server', 'error');
          return _context.abrupt("return", null);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
} // Post quotes to JSONPlaceholder


function postQuotesToServer(quotes) {
  var promises, responses, results;
  return regeneratorRuntime.async(function postQuotesToServer$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          promises = quotes.map(function (quote) {
            return fetch('https://jsonplaceholder.typicode.com/posts', {
              method: 'POST',
              body: JSON.stringify({
                title: quote.category,
                body: quote.text,
                userId: 1
              }),
              headers: {
                'Content-Type': 'application/json; charset=UTF-8'
              }
            });
          });
          _context2.next = 4;
          return regeneratorRuntime.awrap(Promise.all(promises));

        case 4:
          responses = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(Promise.all(responses.map(function (r) {
            return r.json();
          })));

        case 7:
          results = _context2.sent;
          showNotification('Quotes successfully synced with server', 'info');
          return _context2.abrupt("return", results);

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error('Error posting quotes:', _context2.t0);
          showNotification('Error syncing quotes with server', 'error');
          return _context2.abrupt("return", null);

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
} // Main sync function that handles both fetching and posting


function syncQuotes() {
  var serverQuotes, localQuotes, newLocalQuotes, mergedQuotes;
  return regeneratorRuntime.async(function syncQuotes$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          showNotification('Starting quote synchronization...', 'info'); // First, get quotes from server

          _context3.next = 4;
          return regeneratorRuntime.awrap(fetchQuotesFromServer());

        case 4:
          serverQuotes = _context3.sent;

          if (serverQuotes) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return");

        case 7:
          // Get local quotes
          localQuotes = _toConsumableArray(quotes); // Find new local quotes that need to be pushed to server

          newLocalQuotes = localQuotes.filter(function (localQuote) {
            return !serverQuotes.some(function (serverQuote) {
              return serverQuote.text === localQuote.text && serverQuote.category === localQuote.category;
            });
          }); // If we have new local quotes, push them to server

          if (!(newLocalQuotes.length > 0)) {
            _context3.next = 12;
            break;
          }

          _context3.next = 12;
          return regeneratorRuntime.awrap(postQuotesToServer(newLocalQuotes));

        case 12:
          // Merge server quotes with local quotes, removing duplicates
          mergedQuotes = _toConsumableArray(localQuotes);
          serverQuotes.forEach(function (serverQuote) {
            var exists = localQuotes.some(function (localQuote) {
              return localQuote.text === serverQuote.text && localQuote.category === serverQuote.category;
            });

            if (!exists) {
              mergedQuotes.push(serverQuote);
            }
          }); // Update local storage and memory

          quotes = mergedQuotes;
          saveQuotes(); // Update UI

          populateCategories();
          showRandomQuote();
          showNotification('Synchronization completed successfully', 'info');
          _context3.next = 25;
          break;

        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](0);
          console.error('Synchronization error:', _context3.t0);
          showNotification('Error during synchronization', 'error');

        case 25:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 21]]);
} // Show notification to user


function showNotification(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "info";
  var notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = "notification ".concat(type);
  notification.style.display = "block"; // Hide the notification after 3 seconds

  setTimeout(function () {
    notification.style.display = "none";
  }, 3000);
} // Function to create and add the form to the page


function createAddQuoteForm() {
  var formContainer = document.createElement('div');
  formContainer.className = 'form-group';
  var heading = document.createElement('h2');
  heading.textContent = 'Add New Quote';
  var quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';
  var categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';
  var addButton = document.createElement('button');
  addButton.id = 'addQuote';
  addButton.textContent = 'Add Quote';
  formContainer.appendChild(heading);
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
  document.getElementById('newQuote').after(formContainer);
  addButton.addEventListener('click', addQuote);
} // Function to show a random quote


function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById('quoteDisplay').innerHTML = "<p>No quotes available. Add a new quote!</p>";
    return;
  }

  var randomIndex = Math.floor(Math.random() * quotes.length);
  var quote = quotes[randomIndex];
  document.getElementById('quoteDisplay').innerHTML = "\n    <p class=\"quote-text\">".concat(quote.text, "</p>\n    <p class=\"quote-category\">Category: ").concat(quote.category, "</p>\n  ");
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

function populateCategories() {
  var categoryFilter = document.getElementById('categoryFilter');

  var categories = _toConsumableArray(new Set(quotes.map(function (quote) {
    return quote.category;
  })));

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(function (category) {
    var option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  var selectedCategory = document.getElementById('categoryFilter').value;
  var filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(function (quote) {
    return quote.category === selectedCategory;
  });
  displayQuotes(filteredQuotes);
}

function displayQuotes(quotesToDisplay) {
  var quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';

  if (quotesToDisplay.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available in this category.</p>";
    return;
  }

  quotesToDisplay.forEach(function (quote) {
    var quoteElement = document.createElement('div');
    quoteElement.innerHTML = "\n      <p class=\"quote-text\">".concat(quote.text, "</p>\n      <p class=\"quote-category\">Category: ").concat(quote.category, "</p>\n    ");
    quoteDisplay.appendChild(quoteElement);
  });
} // Function to add a new quote


function addQuote() {
  var textInput, categoryInput, text, category;
  return regeneratorRuntime.async(function addQuote$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          textInput = document.getElementById('newQuoteText');
          categoryInput = document.getElementById('newQuoteCategory');
          text = textInput.value.trim();
          category = categoryInput.value.trim();

          if (!(text && category)) {
            _context4.next = 22;
            break;
          }

          quotes.push({
            text: text,
            category: category
          });
          saveQuotes(); // Sync with server

          _context4.prev = 7;
          _context4.next = 10;
          return regeneratorRuntime.awrap(syncQuotes());

        case 10:
          showNotification("Quote added and synced with server");
          _context4.next = 16;
          break;

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](7);
          showNotification("Quote added locally but failed to sync with server", "error");

        case 16:
          textInput.value = '';
          categoryInput.value = '';
          populateCategories();
          showRandomQuote();
          _context4.next = 23;
          break;

        case 22:
          alert('Please enter both quote text and category');

        case 23:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[7, 13]]);
} // Export quotes function


function exportQuotes() {
  var jsonData = JSON.stringify(quotes, null, 2);
  var blob = new Blob([jsonData], {
    type: "application/json"
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
} // Import quotes function


function importFromJsonFile(event) {
  var fileReader;
  return regeneratorRuntime.async(function importFromJsonFile$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          fileReader = new FileReader();

          fileReader.onload = function _callee(event) {
            var importedQuotes, _quotes;

            return regeneratorRuntime.async(function _callee$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.prev = 0;
                    importedQuotes = JSON.parse(event.target.result);

                    if (!Array.isArray(importedQuotes)) {
                      _context5.next = 18;
                      break;
                    }

                    (_quotes = quotes).push.apply(_quotes, _toConsumableArray(importedQuotes));

                    saveQuotes(); // Sync with server

                    _context5.prev = 5;
                    _context5.next = 8;
                    return regeneratorRuntime.awrap(syncQuotes());

                  case 8:
                    showNotification("Quotes imported and synced with server");
                    _context5.next = 14;
                    break;

                  case 11:
                    _context5.prev = 11;
                    _context5.t0 = _context5["catch"](5);
                    showNotification("Quotes imported locally but failed to sync with server", "error");

                  case 14:
                    populateCategories();
                    showRandomQuote();
                    _context5.next = 19;
                    break;

                  case 18:
                    alert("Invalid file format. Please upload a valid JSON file.");

                  case 19:
                    _context5.next = 24;
                    break;

                  case 21:
                    _context5.prev = 21;
                    _context5.t1 = _context5["catch"](0);
                    alert("Error reading JSON file.");

                  case 24:
                  case "end":
                    return _context5.stop();
                }
              }
            }, null, null, [[0, 21], [5, 11]]);
          };

          fileReader.readAsText(event.target.files[0]);

        case 3:
        case "end":
          return _context6.stop();
      }
    }
  });
} // Manual refresh button handler


function handleManualRefresh() {
  return regeneratorRuntime.async(function handleManualRefresh$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          showNotification("Starting manual sync...");
          _context7.next = 3;
          return regeneratorRuntime.awrap(syncQuotes());

        case 3:
        case "end":
          return _context7.stop();
      }
    }
  });
} // Start periodic sync


function startPeriodicSync() {
  // Initial sync
  syncQuotes(); // Set up periodic sync every 30 seconds

  setInterval(syncQuotes, 30000);
} // Initialize everything when the page loads


document.addEventListener("DOMContentLoaded", function () {
  loadQuotes();
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
  document.getElementById('refreshData').addEventListener('click', handleManualRefresh);
  createAddQuoteForm();
  populateCategories(); // Start periodic sync with server

  startPeriodicSync();
});