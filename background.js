// chrome.idle.onStateChanged((tabId, tab) => {
//     if (tab.url && tab.url.includes("youtube.com/watch")) {
//         const queryParameters = tab.url.split("?")[1];
//         const urlParameters = new URLSearchParams(queryParameters);

//         chrome.tabs.sendMessage(tabId, {
//             type: "NEW",
//             videoId: urlParameters.get("v"),
//         });
//     }
// });

// chrome.tabs.onUpdated.addListener((tabId, tab) => {
//     if (tab.url && tab.url.includes("solarisjapan.com")) {
//         const linkInfo = tab.url.split("com")[1];
//         let productType = linkInfo.split("/")[1];

//         if(linkInfo.includes('products')){
//             productType = 'products'
//         }

//         chrome.tabs.sendMessage(tabId, {
//             type: productType,
//             figureId: linkInfo.split("/")[2].split("?")[0],
//         });
//     }
// });