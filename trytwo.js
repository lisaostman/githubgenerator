const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
const pdf = require('html-pdf');

const questions = [
    {
        type: "list",
        message: "What's your favorite color?",
        name: "color",
        choices: ['red', 'green', 'pink', 'blue', 'black']
    },
    {
        type: "input",
        name: "username",
        message: "What is your github username?"
    }
];

function promptUser() {
    return inquirer.prompt(questions);
}

promptUser()
    .then(function ({username, color}) {
        const queryUrl = `https://api.github.com/users/${username}`;
        axios
            .get(queryUrl)
            .then(function (res) 
            {
                info = {
                    color: color,
                    profilePic: res.data.avatar_url,
                    name: res.data.name,
                    location: res.data.location,
                    profileUrl: res.data.html_url,
                    blog: res.data.blog,
                    bio: res.data.bio,
                    company: res.data.company,
                    repos: res.data.public_repos,
                    followers: res.data.followers,
                    following: res.data.following,
                }

                const newQuery = `https://api.github.com/users/${username}/repos`;
                axios
                    .get(newQuery)
                    .then(function (response) {
                        let starAmount = 0;

                        let starArray = response.data.map(item => item.stargazers_count);
                        let starArrayCombined = starArray.reduce(function(a, b){
                            return a + b;
                        }, 0);
                        console.log(starArray);
                        console.log(starArrayCombined);
                        starAmount = starArrayCombined;

                        info.starAmount = starAmount;
                        
                        const webpage = generateHTML(info);

                        fs.writeFileSync(`${username}.html`, webpage);

                        var opt = { format: 'landscape' };
                        pdf.create(webpage, opt)
                        .toFile(`${username}.pdf`, function (err, res) {
                            if (err) return console.log(err);

                        })
                    })
            })
    })



const colors = {
    green: {
        wrapperBackground: "#E6E1C3",
        headerBackground: "#C1C72C",
        headerColor: "black",
        photoBorderColor: "#black"
      },
      blue: {
        wrapperBackground: "#5F64D3",
        headerBackground: "#26175A",
        headerColor: "white",
        photoBorderColor: "#73448C"
      },
      pink: {
        wrapperBackground: "#879CDF",
        headerBackground: "#FF8374",
        headerColor: "white",
        photoBorderColor: "#FEE24C"
      },
      red: {
        wrapperBackground: "#DE9967",
        headerBackground: "#870603",
        headerColor: "white",
        photoBorderColor: "white"
      },
    black: {
        wrapperBackground: "#000000",
        headerBackground: "#870603",
        color: "#ffffff",
        headerColor: "white",
        photoBorderColor: "white"
    }
};

function generateHTML(app) {
    
    return `
  <!DOCTYPE html>
  <html lang="en">
     <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
        <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
        <script src = "/bootstrap/js/bootstrap.min.js"></script>
        <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
        <title>Profile</title>
        <style>
          @page {
            margin: 0;
          }
         *,
         *::after,
         *::before {
         box-sizing: border-box;
         }
         html, body {
         padding: 0;
         margin: 0;
         }
         html, body, .wrapper {
         height: 100%;
         }
         .wrapper {
         background-color: ${colors[app.color].wrapperBackground};
         padding-top: 100px;
         padding-bottom: 100px;
         }
         body {
         background-color: white;
         -webkit-print-color-adjust: exact !important;
         font-family: 'Cabin', sans-serif;
         }
         .main {
         background-color: #E9EDEE;
         height: auto;
         padding-top: 30px;
         }
         h1, h2, h3, h4, h5, h6 {
         font-family: 'BioRhyme', serif;
         margin: 0;
         }
         h1 {
         font-size: 3em;
         }
         h2 {
         font-size: 2.5em;
         }
         h3 {
         font-size: 2em;
         }
         h4 {
         font-size: 1.5em;
         }
         h5 {
         font-size: 1.3em;
         }
         h6 {
         font-size: 1.2em;
         }
         .photo-header {
         position: relative;
         margin: 0 auto;
         margin-bottom: -50px;
         display: flex;
         justify-content: center;
         flex-wrap: wrap;
         background-color: ${colors[app.color].headerBackground};
         color: ${colors[app.color].headerColor};
         padding: 10px;
         width: 95%;
         border-radius: 6px;
         }
         .photo-header img {
         width: 250px;
         height: 250px;
         border-radius: 50%;
         object-fit: cover;
         margin-top: -75px;
         border: 6px solid ${colors[app.color].photoBorderColor};
         box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
         }
         .photo-header h1, .photo-header h2 {
         width: 100%;
         text-align: center;
         }
         .photo-header h1 {
         margin-top: 10px;
         }
         .links-nav {
         width: 100%;
         text-align: center;
         padding: 20px 0;
         font-size: 1.1em;
         }
         .nav-link {
         display: inline-block;
         margin: 5px 10px;
         }
         .workExp-date {
         font-style: italic;
         font-size: .7em;
         text-align: right;
         margin-top: 10px;
         }
         .container {
         padding: 50px;
         padding-left: 100px;
         padding-right: 100px;
         }

         .row {
           display: flex;
           flex-wrap: wrap;
           justify-content: space-between;
           margin-top: 20px;
           margin-bottom: 20px;
         }

         .card {
           padding: 20px;
           border-radius: 6px;
           background-color: ${colors[app.color].headerBackground};
           color: ${colors[app.color].headerColor};
           margin: 20px;
         }
         
         .col {
         flex: 1;
         text-align: center;
         }

         a, a:hover {
         text-decoration: none;
         color: inherit;
         font-weight: bold;
         }

         @media print { 
          body { 
            zoom: .75; 
          } 
         }
      </style>
     </head> 
     <body>
        <div class="wrapper">
             <div class="photo-header">
                <img src="${app.profilePic}" alt="${app.name}" />
                <h1>Hello!</h1>
                <h2>
                My name is ${app.name}!</h1>
                <h5>${app.company ? `Currently @ ${app.company}` : ""}</h5>
                <nav class="links-nav">
                   ${
          app.location
              ? `<a class="nav-link" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/place/${
                app.location
              }"><i class="fas fa-location-arrow"></i> ${
                app.location
              }</a>`
              : ""
          }
                   <a class="nav-link" target="_blank" rel="noopener noreferrer" href="${
                    app.profileUrl
          }"><i class="fab fa-github-alt"></i> GitHub</a>
                   ${
                    app.blog
              ? `<a class="nav-link" target="_blank" rel="noopener noreferrer" href="${
                app.blog
              }"><i class="fas fa-rss"></i> Blog</a>`
              : ""
          }
                </nav>
             </div>
             <div class="main">
                <div class="container">
                    <div class="row">
                        <div class="col">
                            <h3>${app.bio ? `${app.bio}` : ""}</h3>
                        </div>
                   </div>
                   <div class="row">
                        <div class="col">
                            <div class="card">
                                <h3>Public Repositories</h3>
                                <h4>${app.repos}</h4>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card">
                                <h3>Followers</h3>
                                <h4>${app.followers}</h4>
                            </div>
                        </div>
                    </div>
                    
                   
                    <div class="row">
                            <div class="col">
                                <div class="card">
                                    <h3>GitHub Stars</h3>
                                    <h4>${app.starAmount}</h4>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card">
                                    <h3>Following</h3>
                                    <h4>${app.following}</h4>
                                </div>
                            </div>
                    </div>
                </div>
                <div class="wrapper" style="height: 200px">
                </div>
             </div>
        </div>
  </body>
  </html>`;
}
