import "./style.css";
import axios from "axios";
import _ from "lodash";

let container = document.querySelector(".container");
let load = document.getElementById("btn");

showNews();

async function showNews() {
  let newsItem = await axios.get("https://hacker-news.firebaseio.com/v0/newstories.json");
  let newsId = 0;
  createElement(newsItem.data, newsId);

  load.addEventListener("click", function () {
    newsId += 10;
    createElement(newsItem.data, newsId); 
  });
}

function createElement(array, index) {
  Promise.all(array.slice(index, index + 10).map((item) => 
    axios.get(`https://hacker-news.firebaseio.com/v0/item/${item}.json`)))
    .then(( res => { 
      res.forEach(news => {
        container.insertAdjacentHTML("beforeend",

                               `<div class ="news">
                                  <p>Title:</p><br>
                                  <a href = ${_.get(news, "data.url", location.href)} target =_blanck>
                                    ${_.get(news, "data.title", "title")} 
                                  </a>
                                  <span class = "news-by">
                                    Author: ${_.get(news, "data.by", "author")} 
                                  </span>
                                  <span class = "news-time">
                                    ${timeDifference(Date.now(), news.data.time * 1000)} ago
                                  </span> 
                                <div>`
        );
      });     
    })).catch(error => {
         container.insertAdjacentHTML("beforeend",
         
                                `<div class="err">
                                   Sorry an error was detected.<br>  
                                   <span>${error}</span>
                                 </div>`   
         );
       });       
}      

function timeDifference(timeNow, timeNews) {
  let minute = 60 * 1000;
  let hour = minute * 60;
  let day = hour * 24;

  let timeAgo = timeNow - timeNews;

  if (timeAgo < minute) {
    return Math.round(timeAgo / 1000) + " sec";
  } else if (timeAgo < hour) {
    return Math.round(timeAgo / minute) + " min";
  } else if (timeAgo < day) {
    return Math.round(timeAgo / hour) + " hours";
  }
}

