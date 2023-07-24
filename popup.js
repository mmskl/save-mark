// Function to remove a saved link
function removeLink(link) {
  // Fetch the saved links from local storage
  browser.storage.local.get({ messages: [] }, function (result) {
    const savedMessages = result.messages;
    // Remove the link from the saved messages array
    const updatedMessages = savedMessages.filter((messageLink) => messageLink !== link);
    // Save the updated array back to local storage
    browser.storage.local.set({ messages: updatedMessages }, function () {
      // After saving, update the displayed links in the popup
      displaySavedLinks(updatedMessages);
    });
  });
}

// Function to display saved links in the popup
function displaySavedLinks(links) {
  const savedLinksList = document.getElementById('savedLinks');
  savedLinksList.innerHTML = '';

  links.forEach((link) => {
    const listItem = document.createElement('li');
    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.textContent = link;
    listItem.appendChild(linkElement);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className = 'remove-link-button';
    removeButton.addEventListener('click', function () {
      // Remove the link when the remove button is clicked
      removeLink(link);
    });
    listItem.appendChild(removeButton);

    savedLinksList.appendChild(listItem);
  });
}

// Fetch saved links from local storage and display them in the popup
browser.storage.local.get({ messages: [] }, function (result) {
  displaySavedLinks(result.messages);
});
