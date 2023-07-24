class MessageSaver {
  constructor() {}

  saveMessageLink(link) {
    browser.storage.local.get({ messages: [] }, function (result) {
      const savedMessages = result.messages;
      savedMessages.push(link);
      browser.storage.local.set({ messages: savedMessages });
    });
  }
}

class MessageUI {
  constructor() {

    this.icon = `<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.8 39.6c-1.5 0-3.1-.6-4.2-1.8-2.3-2.3-2.3-6.1 0-8.5l17-17c3.1-3.1 8.2-3.1 11.3 0 3.1 3.1 3.1 8.2 0 11.3L25.1 36.4 23.7 35l12.7-12.7c2.3-2.3 2.3-6.1 0-8.5-2.3-2.3-6.1-2.3-8.5 0l-17 17c-.8.8-1.2 1.8-1.2 2.8 0 1.1.4 2.1 1.2 2.8 1.6 1.6 4.1 1.6 5.7 0l12.7-12.7c.8-.8.8-2 0-2.8-.8-.8-2-.8-2.8 0L18 29.3l-1.4-1.4 8.5-8.5c1.6-1.6 4.1-1.6 5.7 0 1.6 1.6 1.6 4.1 0 5.7L18 37.8c-1.1 1.2-2.7 1.8-4.2 1.8z" fill="currentColor"></path>
  </svg>`;

    this.buttonStyle = {
      display: "-webkit-box",
      display: "-ms-flexbox",
      display: "flex",
      webkitBoxAlign: "center",
      msFlexAlign: "center",
      alignItems: "center",
      webkitBoxPack: "center",
      msFlexPack: "center",
      justifyContent: "center",
      height: "24px",
      padding: "4px",
      minWidth: "24px",
      webkitBoxFlex: "0",
      msFlex: "0 0 auto",
      flex: "0 0 auto",
      color: "var(--interactive-normal)",
      cursor: "pointer",
      position: "relative",
    };

  }


  createSaveButton(link) {
    const addButton = document.createElement("div");
    addButton.textContent = "Save Mark";
    addButton.setAttribute("role", "button");
    addButton.setAttribute("tabindex", "0");
    addButton.ariaLabel = "Save Mark";
    addButton.className = "save-mark";
    addButton.innerHTML = this.icon;
    addButton.addEventListener("click", () => this.handleButtonClick(link));

    for (const name in this.buttonStyle) {
      addButton.style[name] = this.buttonStyle[name];
    }

    return addButton;
  }



  addButtonToMessages(messageContainer, link) {
    const addButton = this.createSaveButton(link);

    let buttonContainer = this.findButtonContainer(messageContainer);
    if (!buttonContainer.querySelector(".save-mark")) {
      const firstButton = buttonContainer.querySelector('[class^="button"]');
      buttonContainer.insertBefore(addButton, firstButton);
    }
  }

  findButtonContainer(messageContainer) {
    let buttonContainer;
    for (let i = 0; i <= 2; i++) {
      buttonContainer = messageContainer.querySelector(
        '[class^="buttonContainer"] [class^="wrapper-"]'
      );
      if (buttonContainer !== null) {
        break;
      } else {
        // handle clicking mediaAttachmentsContainer which 
        // is way too low in the DOM
        messageContainer = messageContainer.parentElement;
      }
    }
    return buttonContainer;
  }

  handleButtonClick(link) {
    const messageSaver = new MessageSaver();
    messageSaver.saveMessageLink(link);
    alert("Message link saved!");
    console.log("Message link saved!");
  }


  observeMutations() {
    const onMutation = () => {
      const element = document.querySelector('ol[data-list-id="chat-messages"]');
      if (element) {
        observer.disconnect();

        element.addEventListener("click", (e) => {
          const messageContainer = e.target.closest('[class^="message-"]');
          if (messageContainer) {
            const messageInfo = messageContainer.getAttribute("data-list-item-id");
            const msgId = messageInfo.split("-").slice(-1)[0];
            const baseChannelUrl = window.location.href.split("/").slice(0, 6).join("/");
            const link = `${baseChannelUrl}/${msgId}`;
            if (link) {
              this.addButtonToMessages(messageContainer, link);
            }
          }
        });
      }
    };

    const observer = new MutationObserver(onMutation);
    observer.observe(document.body, { childList: true, subtree: true });
  }

    attachClickListener() {
        this.observeMutations();
    }


}

// Initialize the MessageUI class
const messageUI = new MessageUI();
messageUI.attachClickListener();
