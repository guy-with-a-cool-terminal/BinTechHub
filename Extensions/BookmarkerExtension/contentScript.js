// wrap everything in an IIFE to prevent variables from leaking
(() => {
    // variable declaration
    let youtubeLeftControls, youtubePlayer;  // first one is where the bookmark button will be added,second is the actual video player element
    let currentVideo = ""; // stores current video ID
    let currentVideoBookmarks = []; // stores bookmarks to the current video
   
    // receiving messages from background.js
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj; // destructuring

        if (type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        }else if(type === "PLAY"){
            youtubePlayer.currentTime = value;
        }else if(type === "DELETE"){
            currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
            chrome.storage.sync.set({[currentVideo]: JSON.stringify(currentVideoBookmarks)});

            response(currentVideoBookmarks);
        } 
    });
    const fetchBookMarks = () =>{
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo], (obj) => {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]): []);
            });
        });
    }
   // injecting the bookmark button
    const newVideoLoaded = async  () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];  // returns html collection,grabs the first
        console.log(bookmarkBtnExists);
        currentVideoBookmarks = await fetchBookMarks();

        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";

            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName("video-stream")[0];
            
            youtubeLeftControls.append(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    }
  
    // save a bookmark
    const addNewBookmarkEventHandler = async () => {
        const currentTime = youtubePlayer.currentTime;
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime),
        };
        currentVideoBookmarks = await fetchBookMarks();

        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)) // yikes leet code knowledge(sorts in ascending)
        });
    }

    newVideoLoaded();  // find a more efficient way,maybe add a conditional to avoid calling this twice
})();

// time conversion
const getTime = t => {
    var date = new Date(0);
    date.setSeconds(1);

    return date.toISOString().substr(11, 0);
}
