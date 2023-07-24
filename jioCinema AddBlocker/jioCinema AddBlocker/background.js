console.log("This is the background script");

let globalCounter = 0;

function getNewId(type) {
  globalCounter++;
  return globalCounter;
}

  function get_rule(id, domain, type) {
    if (type === "url_filter") {
      return {
        id: id,
        priority: 2,
        action: { type: "block" },
        condition: {
          urlFilter: domain,
          resourceTypes: ["script","main_frame","sub_frame","image","object","xmlhttprequest","ping","csp_report","media","websocket","other"],
        },
      };
    } else if (type === "reg_filter") {
      return {
        id: id,
        priority: 2,
        action: { type: "allow" },
        condition: {
          regexFilter: domain,
          resourceTypes: ["script","main_frame","sub_frame","image","object","xmlhttprequest","ping","csp_report","media","websocket","other"],
        },
      };
    }
  }
    let currentId = 0;
    let rules_list = {
     url_filter: ["*mercury.akamaized.net*", "*doubleclick.net*"],

    };
    
    async function add_update_rules(active = true) {
      let rules = [];
      for (let key in rules_list) {
          let type = key;
          let r = rules_list[key];
          for (let i = 0; i < r.length; i++) {
            if (type === "url_filter") {
              currentId = getNewId();
            } 
            rules.push(get_rule(currentId, r[i], type));
          }
        }
        chrome.runtime.onMessage.addListener(function (res, sender, sendResponse) {
            if (res.action === "blockAll") {
                rules=[];
              console.log("receiving request for blocking")  
              currentId = getNewId("url_filter");
              rules.push(get_rule(currentId, "*mercury.akamaized.net*", "url_filter"));
              currentId = getNewId("url_filter");
              rules.push(get_rule(currentId, "*doubleclick.net*", "url_filter"));
               console.log(rules)
            } else if (res.action === "removeHeaders") {
              console.log("receiving request for unblocking")  
              currentId = getNewId("url_filter");
              rules=[];
            //   rules.push({
            //     id: currentId,
            //     priority: 3,
            //     action: {
            //       type: "modifyHeaders",
            //       responseHeaders: [
            //         { header: "X-Frame-Options", operation: "remove" },
            //         { header: "Frame-Options", operation: "remove" },
            //         { header: "Content-Security-Policy", operation: "remove" },
            //       ],
            //       requestHeaders: [
            //         { header: "sec-fetch-dest", operation: "set", value: "document" },
            //       ],
            //     },
            //     condition: { resourceTypes: ["script","main_frame","sub_frame","image","object","xmlhttprequest","ping","csp_report","media","websocket","other"] },
            // });
             console.log(rules)
          }
      
          updateDynamicRules(active, rules);
        });
      
        updateDynamicRules(active, rules);
      }
      
      function updateDynamicRules(active, rules) {
        chrome.declarativeNetRequest.getDynamicRules(function (rule) {
          let ids = rule.map((i) => i.id);
          let final = { removeRuleIds: ids };
          if (active) final.addRules = rules;
          chrome.declarativeNetRequest.updateDynamicRules(final, function () {
            console.log("Dynamic rules updated!");
          });
        });
      }
      add_update_rules(true);  
    
      





//     console.log("This is the background script");

// let globalCounter = 0;

// function getNewId(type) {
//   globalCounter++;
//   return globalCounter;
// }

// function get_rule(id, domain, type) {
//   // Same as before...
// }

// let currentId = 0;
// let rules_list = {
//   url_filter: ["*mercury.akamaized.net*", "*doubleclick.net*"],
// };

// function add_update_rules(active = true) {
//   // Same as before...
// }

// function updateDynamicRules(active, rules) {
//   // Same as before...
// }

// // Message Listener in the Background Script
// chrome.runtime.onMessage.addListener(function (res, sender, sendResponse) {
//   if (res.action === "blockAll") {
//     console.log("Receiving request for blocking");
//     currentId = getNewId("url_filter");
//     rules_list.url_filter.forEach((domain) => {
//       rules.push(get_rule(currentId, domain, "url_filter"));
//       currentId++;
//     });
//     console.log(rules);
//   } else if (res.action === "removeHeaders") {
//     console.log("Receiving request for unblocking");
//     currentId = getNewId("reg_filter");
//     rules.push({
//       id: currentId,
//       priority: 3,
//       action: {
//         type: "modifyHeaders",
//         responseHeaders: [
//           { header: "X-Frame-Options", operation: "remove" },
//           { header: "Frame-Options", operation: "remove" },
//           { header: "Content-Security-Policy", operation: "remove" },
//         ],
//         requestHeaders: [
//           { header: "sec-fetch-dest", operation: "set", value: "document" },
//         ],
//       },
//       condition: {
//         resourceTypes: ["script", "main_frame", "sub_frame", "image", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "other"],
//       },
//     });
//     console.log(rules);
//   }

//   updateDynamicRules(active, rules);
// });

// add_update_rules(true);
