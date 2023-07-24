document.addEventListener("DOMContentLoaded", function () {
  var button = document.getElementById("ads");
  var toggletext = document.getElementById("toggletext");
  chrome.storage.local.get("adsEnabled", function (result) {
    if (result.adsEnabled) {
      button.checked = true;
      toggletext.innerHTML = "Disable Adblocker";
      console.log("sending for blocking");
      chrome.runtime.sendMessage({ action: "blockAll" });
    } else {
      button.checked = false;
      toggletext.innerHTML = "Enable Adblocker";

      console.log("sending request for unblocking");
      chrome.runtime.sendMessage({ action: "removeHeaders" });
    }
  });

  function reloadExtensionAndPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  }

  button.addEventListener("change", function () {
    if (!this.checked) {
      console.log("sending request for unblocking");
      chrome.runtime.sendMessage({ action: "removeHeaders" });
      toggletext.innerHTML = "Enable Adblocker";
    } else {
      console.log("sending for blocking");
      chrome.runtime.sendMessage({ action: "blockAll" });
      toggletext.innerHTML = "Disable Adblocker";
    }

    chrome.storage.local.set({ adsEnabled: this.checked }, function () {
      console.log("Value saved to storage:", this.checked);
      reloadExtensionAndPage();
    });
  });
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url) {
      chrome.storage.local.get("adsEnabled", function (result) {
        if (result.adsEnabled) {
          chrome.runtime.sendMessage({ action: "blockAll" });
        }
      });
    }
  });
});
for (
  var u = document.querySelectorAll('[name="rating"]'),
    a = function () {
      var e = this.getAttribute("data-ratting");
      "4" == e || "5" == e
        ? chrome.tabs.create({
            url: "https://chrome.google.com/webstore/detail/lehcglgkjkamolcflammloedahjocbbg/reviews",
          })
        : (document.getElementById("rate-us").innerHTML =
            '<div style="\n    margin: auto;\n        width: 174%;\n    text-align: center;\n    padding: 15px 0;\n    font-size: 17px;\n">Thanks for your feedback</div>');
    },
    i = 0;
  i < u.length;
  i++
)
  u[i].addEventListener("click", a, !1);