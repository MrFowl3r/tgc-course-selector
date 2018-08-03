const {app, BrowserWindow} = require('electron')
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
  
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win;
  let courseData = [];

  let scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://tgctours.com/Course/TGC2Listings?Grid-sort=DateCreated-desc&Grid-page=1&Grid-pageSize=50');
    await page.waitFor(1000);

    // Scrape
    const result = await page.evaluate(() => {
        let data = [];
        let tableBody = document.querySelector('#Grid > table > tbody');
        let rows = tableBody.querySelectorAll('tr');
        for(var aRow of rows) {
          let courseName = aRow.childNodes[2].innerText;
          let link = aRow.childNodes[2].firstChild['href'];
          data.push({ courseName, link });
        }
        return data;
    });
  
    browser.close();
    return result;
  
  };

  function init() {

    scrape().then((value) => {
      courseData = value;
      console.log(value); // Success!
    });

    createWindow();
  }
  
  function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600, autoHideMenuBar: true})
  
    // and load the index.html of the app.
    win.loadFile('index.html')

    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })
  }
  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', init)
  
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })
  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
  function saveFile() {
    //let filePath = app.getAppPath();
    //let fileName = path.join(filePath, 'data.txt');
    fs.writeFileSync('data.txt', 'test data');
  }