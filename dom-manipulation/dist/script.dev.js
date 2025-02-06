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
} // Simulate fetching quotes from the server


function fetchQuotesFromServer() {
  return regeneratorRuntime.async(function fetchQuotesFromServer$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new Promise(function (resolve) {
            setTimeout(function () {
              // Simulate server response using localStorage as a mock server
              var serverQuotes = JSON.parse(localStorage.getItem("serverQuotes")) || quotes;
              resolve(serverQuotes);
            }, 1000); // Simulate network delay
          }));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
} // Simulate posting quotes to the server


function postQuotesToServer(quotes) {
  return regeneratorRuntime.async(function postQuotesToServer$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", new Promise(function (resolve) {
            setTimeout(function () {
              // Simulate saving quotes to the server
              localStorage.setItem("serverQuotes", JSON.stringify(quotes));
              resolve();
            }, 1000); // Simulate network delay
          }));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
} // Sync local data with server data


function syncLocalDataWithServer() {
  var serverQuotes, localQuotes;
  return regeneratorRuntime.async(function syncLocalDataWithServer$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(fetchQuotesFromServer());

        case 3:
          serverQuotes = _context3.sent;
          localQuotes = JSON.parse(localStorage.getItem("quotes")) || []; // Check if server data is different from local data

          if (JSON.stringify(localQuotes) !== JSON.stringify(serverQuotes)) {
            // Server data takes precedence in case of discrepancies
            localStorage.setItem("quotes", JSON.stringify(serverQuotes));
            quotes = serverQuotes; // Update the in-memory quotes array
            // Notify the user that data has been updated

            showNotification("Data has been synchronized with the server"); // Refresh the UI

            populateCategories();
            showRandomQuote();
          }

          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          showNotification("Error syncing with server", "error");

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
} // Start periodic sync with server


function startPeriodicSync() {
  // Initial sync
  syncLocalDataWithServer(); // Set up periodic sync every 30 seconds

  setInterval(syncLocalDataWithServer, 30000);
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
          return regeneratorRuntime.awrap(postQuotesToServer(quotes));

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
                    return regeneratorRuntime.awrap(postQuotesToServer(quotes));

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
          showNotification("Syncing with server...");
          _context7.next = 3;
          return regeneratorRuntime.awrap(syncLocalDataWithServer());

        case 3:
        case "end":
          return _context7.stop();
      }
    }
  });
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