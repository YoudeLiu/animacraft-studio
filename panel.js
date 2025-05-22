// panel.js - Logic for the AnimaCraft Studio sidebar panel
console.log("panel.js loaded for sidebar");

function updatePanelWithElement(elementDetails) {
  const infoDiv = document.getElementById('element-info');
  if (!infoDiv) {
    console.error("Element with ID 'element-info' not found in panel.html");
    return;
  }

  if (elementDetails) {
    // Note: 'elementDetails' from $0 might be a basic representation.
    // For more complex data or a specific selector, you might need more sophisticated eval logic.
    infoDiv.innerHTML = `
      <h3>Selected Element:</h3>
      <p>Details (raw): ${JSON.stringify(elementDetails)}</p>
      <button id="use-element-button">Use this Element</button>
    `;
    // You can add an event listener to the button here
    // document.getElementById('use-element-button').addEventListener('click', () => { ... });
  } else {
    infoDiv.textContent = 'No element selected in the Elements panel, or $0 is not available.';
  }
}

// Listen for when an element is selected in the Elements panel
// This is the preferred way: panel.js directly listens after it's loaded.
if (chrome.devtools && chrome.devtools.panels && chrome.devtools.panels.elements) {
  chrome.devtools.panels.elements.onSelectionChanged.addListener(function () {
    // $0 is a DevTools shortcut for the currently selected DOM element.
    // We evaluate an expression to get some properties of the selected element.
    // Important: The result of eval must be a JSON-serializable object.
    const getElementDetailsScript = `
      (() => {
        if (!$0) return null;
        let selector = '';
        if ($0.id) {
          selector = '#' + $0.id;
        } else if ($0.classList && $0.classList.length > 0) {
          selector = '.' + Array.from($0.classList).join('.');
        } else {
          selector = $0.tagName.toLowerCase();
        }
        return {
          tagName: $0.tagName,
          id: $0.id || '',
          classes: $0.className || '',
          computedSelector: selector // A very basic selector
        };
      })()
    `;

    chrome.devtools.inspectedWindow.eval(
      getElementDetailsScript,
      function (result, isException) {
        if (isException) {
          console.error("panel.js - Error getting selected element: ", isException);
          updatePanelWithElement(null);
        } else {
          console.log("panel.js - Element selected: ", result);
          updatePanelWithElement(result);
        }
      }
    );
  });
} else {
  console.log("DevTools Elements API not available in this context. Are you running as a sidebar?");
}

// Initial call in case an element is already selected when the panel opens
// (or to set a default state)
if (chrome.devtools && chrome.devtools.inspectedWindow) {
  chrome.devtools.inspectedWindow.eval("!!$0", (result) => { if(result) { chrome.devtools.panels.elements.onSelectionChanged.dispatch() }});
}

// Example: Accessing the inspected window (though more complex communication is needed for real interaction)
// chrome.devtools.inspectedWindow.eval("alert('Hello from the panel!');", function(result, isException) {
//   if (isException) {
//     console.log("eval error:", isException);
//   } else {
//     console.log("eval result:", result);
//   }
// }); 