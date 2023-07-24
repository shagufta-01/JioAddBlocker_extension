// console.log("This is the background script");
// function get_rule(i, domain, type) {
//     if (type === 'url_filter') {
//       return {
//         id: i,
//         priority: 2,
//         action: { "type": "block" },
//         condition: {
//         urlFilter: domain,
//         resourceTypes: ["main_frame", "image","video"],
//         }
//       };
//     } else if (type === 'reg_filter') {
//       return {
//         id: i,
//         priority: 2,
//         action: { "type": "block" },
//         condition: {
//         regexFilter: domain,
//         resourceTypes: [ "main_frame", "image","video"],
//         }
//       };
//     }
//   }
   
//   async function add_updte_rules(active = true) {
//     console.log('changing rules');
//     let rules = [];
//     let c_i = 0;
//     for (let key in rules_list){
//         let type = key;
//         let r = rules_list[key];
//         for (var i = 0; i< r.length; i++) {
//           rules.push(get_rule(c_i+i+1,r[i],type));
//         }
//         c_i+=r.length;
//       }
//       chrome.runtime.onMessage.addListener((res)=>{
//         if(res.action==="blockAll"){
//             console.log("receiving request for blocking")
//         // rules.push(get_rule(c_i + 1, "*", 'url_filter'));
//         rules.push(get_rule(c_i + 1, "*mercury.akamaized.net*", 'url_filter'));
//         rules.push(get_rule(c_i + 2, "*doubleclick.net*", 'url_filter'));
//         }
//         if(res.action==="removeHeaders"){
//             console.log("receiving request for unblocking");
//             rules.push(
//                 {
//                   "id":c_i+1,
//                   "priority": 3,
//                   "action": {
//                     "type": "modifyHeaders",
//                     "responseHeaders": [
//                       { "header": "X-Frame-Options", "operation": "remove" },
//                       { "header": "Frame-Options", "operation": "remove" },
//                       { "header": "Content-Security-Policy", "operation": "remove" }
//                     ],
//                     "requestHeaders":[
//                       { "header": "sec-fetch-dest", "operation": "set", "value": "document" }
//                     ]
//                   },
//                   "condition": { "resourceTypes": ["main_frame","sub_frame","script"] }
//                 });
//         }
//       })


//       chrome.declarativeNetRequest.getDynamicRules(cb);
//       function cb(rule) {
//         let ids = rule.map(i => i.id);
//         let final = { removeRuleIds: ids };
//         if (active) final.addRules = rules;
//         chrome.declarativeNetRequest.updateDynamicRules(final);
//       }
//   }




console.log("This is the background script");
  function get_rule(i, domain, type) {
    if (type === 'url_filter') {
      return {
        id: i,
        priority: 2,
        action: { "type": "block" },
        condition: {
          urlFilter: domain,
          resourceTypes: ["main_frame", "image"],
        }
      };
    } else if (type === 'reg_filter') {
      return {
        id: i,
        priority: 2,
        action: { "type": "block" },
        condition: {
          regexFilter: domain,
          resourceTypes: ["main_frame", "image"],
        }
      };
    }
  }
  
  let rules_list = {
    // Your rules_list here (if any)
  };
  
  async function add_update_rules(active = true) {
    console.log('changing rules');
    let rules = [];
    let c_i = 0;
  
    for (let key in rules_list) {
      let type = key;
      let r = rules_list[key];
      for (let i = 0; i < r.length; i++) {
        rules.push(get_rule(c_i + i + 1, r[i], type));
      }
      c_i += r.length;
    }
  
    chrome.runtime.onMessage.addListener(function (res, sender, sendResponse) {
      if (res.action === "blockAll") {
        console.log("Receiving request for blocking");
        rules.push(get_rule(c_i + 1, "*mercury.akamaized.net*", 'url_filter'));
        rules.push(get_rule(c_i + 2, "*doubleclick.net*", 'url_filter'));
      }
  
      if (res.action === "removeHeaders") {
        console.log("Receiving request for unblocking");
        rules.push({
          "id": c_i + 1,
          "priority": 3,
          "action": {
            "type": "modifyHeaders",
            "responseHeaders": [
              { "header": "X-Frame-Options", "operation": "remove" },
              { "header": "Frame-Options", "operation": "remove" },
              { "header": "Content-Security-Policy", "operation": "remove" }
            ],
            "requestHeaders": [
              { "header": "sec-fetch-dest", "operation": "set", "value": "document" }
            ]
          },
          "condition": { "resourceTypes": ["main_frame", "image"] }
        });
      }
  
      // Update the dynamic rules when receiving the message
      updateDynamicRules(active, rules);
    });
  
    // Get the dynamic rules and update them when the script starts
    updateDynamicRules(active, rules);
  }
  
  function updateDynamicRules(active, rules) {
    chrome.declarativeNetRequest.getDynamicRules(function (rule) {
      let ids = rule.map(i => i.id);
      let final = { removeRuleIds: ids };
      if (active) final.addRules = rules;
      chrome.declarativeNetRequest.updateDynamicRules(final);
    });
  }
  
  // Call the add_update_rules function when the background script starts
  add_update_rules(true);
  
















console.log("This is the background script");

function get_rule(id, domain, type) {
  if (type === "url_filter") {
    return {
      id: id,
      priority: 2,
      action: { type: "block" },
      condition: {
        urlFilter: domain,
        resourceTypes: ["main_frame", "image"],
      },
    };
  } else if (type === "reg_filter") {
    return {
      id: id,
      priority: 2,
      action: { type: "allow" },
      condition: {
        regexFilter: domain,
        resourceTypes: ["main_frame", "image"],
      },
    };
  }
}

let rules_list = {
  // Your rules_list here (if any)
};

let currentId = 0; // Initialize a counter for generating unique rule IDs

async function add_update_rules(active = true) {
  console.log("changing rules");
  let rules = [];
  let c_i = 0;

  for (let key in rules_list) {
    let type = key;
    let r = rules_list[key];
    for (let i = 0; i < r.length; i++) {
      currentId++; // Increment the ID counter for each rule
      rules.push(get_rule(currentId, r[i], type));
    }
    c_i += r.length;
  }

  chrome.runtime.onMessage.addListener(function (res, sender, sendResponse) {
    if (res.action === "blockAll") {
      console.log("Receiving request for blocking");
      currentId++;
      rules.push(get_rule(currentId, "*mercury.akamaized.net*", "url_filter"));
      console.log(rules);
      currentId++;
      rules.push(get_rule(currentId, "*doubleclick.net*", "url_filter"));
      console.log(rules);
    } else if (res.action === "removeHeaders") {
      console.log("Receiving request for unblocking");
      // For blocking URLs containing "mercury.akamaized.net"
      currentId++;
      rules.push(
        get_rule(currentId, ".*mercury\\.akamaized\\.net.*", "reg_filter")
      );

      // For blocking URLs containing "doubleclick.net"
      currentId++;
      rules.push(get_rule(currentId, ".*doubleclick\\.net.*", "reg_filter"));

      rules.push({
        id: currentId,
        priority: 3,
        action: {
          type: "modifyHeaders",
          responseHeaders: [
            { header: "X-Frame-Options", operation: "remove" },
            { header: "Frame-Options", operation: "remove" },
            { header: "Content-Security-Policy", operation: "remove" },
          ],
          requestHeaders: [
            { header: "sec-fetch-dest", operation: "set", value: "document" },
          ],
        },
        condition: { resourceTypes: ["main_frame", "image"] },
      });
      console.log(rules);
    }

    // Update the dynamic rules when receiving the message
    updateDynamicRules(active, rules);
  });

  // Get the dynamic rules and update them when the script starts
  updateDynamicRules(active, rules);
}

function updateDynamicRules(active, rules) {
  chrome.declarativeNetRequest.getDynamicRules(function (rule) {
    let ids = rule.map((i) => i.id);
    let final = { removeRuleIds: ids };
    if (active) final.addRules = rules;
    chrome.declarativeNetRequest.updateDynamicRules(final);
  });
}

// Call the add_update_rules function when the background script starts
add_update_rules(true);