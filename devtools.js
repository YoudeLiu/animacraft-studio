// Create a new sidebar pane in the Elements panel
chrome.devtools.panels.elements.createSidebarPane(
  "AnimaCraft Studio", // Sidebar title
  function (sidebar) {
    // Set the HTML page for the sidebar's content
    sidebar.setPage("panel.html"); 
    // sidebar.setHeight("calc(100vh - 48px)"); // Optional: set height if needed

    console.log("AnimaCraft Studio sidebar created.");

    // All logic related to element selection should now be handled within panel.js
    // after it is loaded by sidebar.setPage("panel.html").
  }
); 