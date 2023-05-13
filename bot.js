const Discord = require("discord.js");
const discordClient = new Discord.Client();
const { MongoClient } = require("mongodb");
var fs = require("fs");
var https = require("https");
var moment = require("moment");
discordClient.login(
  ""
);
const anyc = require("anychart-nodejs");
const JSDOM = require("jsdom").JSDOM;
var jsdom = new JSDOM('<body><div id="container"></div></body>', {
  runScripts: "dangerously",
});
const window = jsdom.window;
var Request = require("request");
const { GoogleSpreadsheet } = require("google-spreadsheet");

//initialize DB client globally
const uri =
  "URI OMITTED";
const client = new MongoClient(uri, { useUnifiedTopology: true });
//end client creation

//update with real channel IDs
const fmChannel = "704434005101248552";
const bfcChannel = "704434064282746940";
const mpChannel = "704434102455238706";
//end channel data

main();

async function main() {
  try {
    await client.connect();
    client.setMaxListeners(2000);
    //connect to discord
    discordClient.on("ready", () => {
      console.log("Logged in as admin");
    });
    discordClient.on("message", async (msg) => {
      if (msg.content.substring(0, 1) == "!") {
        var argument = msg.content.substring(1, msg.length);

        if (argument.startsWith("inb") || argument.startsWith("INB")) {
          var indexOfPrice = argument.search(/\d/);
          var itemName = argument.substring(4, indexOfPrice);
          itemName = itemName.trim();
          var price = argument.substring(indexOfPrice, argument.length);
          var num = price;

          if (price.includes("k")) {
            num = price.substring(0, price.length - 1);
            num = num * 1000;
          }

          if (price.includes("m")) {
            num = price.substring(0, price.length - 1);
            num = num * 1000000;
          }
          addData(itemName, "INB", num, msg.createdAt.toISOString());
          msg.reply("Added INB for " + itemName + " in the database!");
        }

        if (argument.startsWith("nib") || argument.startsWith("NIB")) {
          var indexOfPrice = argument.search(/\d/);
          var itemName = argument.substring(4, indexOfPrice);
          itemName = itemName.trim();
          var price = argument.substring(indexOfPrice, argument.length);
          var num = price;

          if (price.includes("k")) {
            num = price.substring(0, price.length - 1);
            num = num * 1000;
          }

          if (price.includes("m")) {
            num = price.substring(0, price.length - 1);
            num = num * 1000000;
          }
          addData(itemName, "NIB", num, msg.createdAt.toISOString());
          msg.reply("Added NIB for " + itemName + " in the database!");
        }

        if (argument.startsWith("nis") || argument.startsWith("NIS")) {
          var indexOfPrice = argument.search(/\d/);
          var itemName = argument.substring(4, indexOfPrice);
          itemName = itemName.trim();
          var price = argument.substring(indexOfPrice, argument.length);
          var num = price;

          if (price.includes("k")) {
            num = price.substring(0, price.length - 1);
            num = num * 1000;
          }

          if (price.includes("m")) {
            num = price.substring(0, price.length - 1);
            num = num * 1000000;
          }
          addData(itemName, "NIS", num, msg.createdAt.toISOString());
          msg.reply("Added NIS for " + itemName + " in the database!");
        }

        if (argument.startsWith("ins") || argument.startsWith("INS")) {
          var indexOfPrice = argument.search(/\d/);
          var itemName = argument.substring(4, indexOfPrice);
          itemName = itemName.trim();
          var price = argument.substring(indexOfPrice, argument.length);
          var num = price;

          if (price.includes("k")) {
            num = price.substring(0, price.length - 1);
            num = num * 1000;
          }

          if (price.includes("m")) {
            num = price.substring(0, price.length - 1);
            num = num * 1000000;
          }

          addData(itemName, "INS", num, msg.createdAt.toISOString());
          msg.reply("Added INS for " + itemName + " in the database!");
        }

        if (argument.startsWith("track")) {
          var itemName = argument.substring(6, argument.length);
          itemName = itemName.trim();
          var result = await createItem(itemName);
          msg.reply(result);
        }

        if (argument.startsWith("24h")) {
          var itemName = argument.substring(4, argument.length);
          itemName = itemName.trim();
          var exists = await doesExist(itemName);

          if (exists) {
            var inbArr = await grabLast24h(itemName, "INB");
            var insArr = await grabLast24h(itemName, "INS");
            //gets info in json object format for graph
            var inbChartData = getDataForChart(inbArr);
            var insChartData = getDataForChart(insArr);
            //creates chart if data exists
            await createChart(msg, itemName, inbChartData, insChartData);
          } else {
            msg.reply(
              itemName + " not found in database, try !track to begin tracking!"
            );
          }
        }
        if (argument.startsWith("6h")) {
          var itemName = argument.substring(3, argument.length);
          itemName = itemName.trim();
          var exists = await doesExist(itemName);

          if (exists) {
            var inbArr = await grabLast6h(itemName, "INB");
            var insArr = await grabLast6h(itemName, "INS");
            //gets info in json object format for graph
            var inbChartData = getDataForChart(inbArr);
            var insChartData = getDataForChart(insArr);
            //creates chart if data exists
            await create6hChart(msg, itemName, inbChartData, insChartData);
          } else {
            msg.reply(
              itemName + " not found in database, try !track to begin tracking!"
            );
          }
        }
        if (argument.startsWith("add")) {
          var indexOfPeriod = argument.indexOf(".");
          var itemName = argument.substring(3, indexOfPeriod);
          itemName = itemName.trim();
          var indexOfSlash = argument.indexOf("/");
          var indexOfSemi = argument.indexOf(";");
          var id = argument.substring(indexOfPeriod + 1, indexOfSlash);
          var type = argument.substring(indexOfSlash + 1, indexOfSemi);
          var permission = argument.substring(indexOfSemi + 1, argument.length);

          newID(itemName, id, type, permission);

          msg.reply(itemName + " created with id:" + id);
        }
        if (argument.startsWith("alt")) {
          var indexOfPeriod = argument.indexOf(".");
          var itemName = argument.substring(3, indexOfPeriod);
          itemName = itemName.trim();
          var altName = argument.substring(indexOfPeriod + 1, argument.length);
          altName = altName.trim();

          console.log(itemName + " " + altName);
          var itemID = await getItemID(itemName);

          var itemType = "alt";

          newID(altName, itemID, itemType);

          msg.reply("Added alt name: " + altName + "\n for: " + itemName);
        }
        if (argument.startsWith("pc")) {
          var itemName = argument.substring(2, argument.length);
          itemName = itemName.trim();
          ttt.test();

          if (await doesExist(itemName)) {
            var itemID = await getItemID(itemName);

            await getGEData(msg, itemID, itemName);
          } else {
            msg.reply("Item not found in database, check your spelling.");
          }
        }
        if (argument.startsWith("help")) {
          msg.reply(
            "\n!pc itemname\n!!add itemName.itemID/type(probably main);permissionlevel\n!6h itemname\n!24h itemname\n!track itemname\n!inb itemname amount\n!ins itemname amount\n!nib itemname amount\n!nis itemname amount"
          );
        }
      }
    });
  } catch (e) {
    console.error(e);
  } finally {
    // await client.close();
  }
}

async function getSpreadsheet() {
  const doc = new GoogleSpreadsheet(
    "1jASEb0Q8pD-sHoETNcYaLbZJUnAypSbEyG2EZG-vrcU"
  );
  await doc.useServiceAccountAuth(require("./creds.json"));
  await doc.loadInfo();

  //FLIP MASTERY DATA
  const fm = await doc.sheetsByIndex[1];
  await fm.loadCells();
  var rowCount = await fm.rowCount;
  var fmArr = new Array(rowCount);
  for (var i = 0; i < rowCount; i++) {
    var test = await fm.getCell(i, 2);
    var margin = await fm.getCell(i, 4);
    //new vars
    var waitTime = await fm.getCell(i, 5);
    var update = await fm.getCell(i, 6);
    var buyLimit = await fm.getCell(i, 7);
    var risk = await fm.getCell(i, 8);
    var ovnRisk = await fm.getCell(i, 9);
    //end new vars

    var newObj = {
      name: test.formattedValue,
      row: test._row,
      sheetID: 1,
      margin: margin.formattedValue,
      wait: waitTime.formattedValue,
      update: update.formattedValue,
      buyLimit: buyLimit.formattedValue,
      risk: risk.formattedValue,
      ovnRisk: ovnRisk.formattedValue,
    };
    fmArr[i] = newObj;
  }
  //END FLIP MASTERY DATA

  //BILLIONAIRE FLIP CLUB DATA
  const bfc = await doc.sheetsByIndex[2];
  await bfc.loadCells();
  var bfcRows = await bfc.rowCount;
  var bfcArr = new Array(bfcRows);
  for (var i = 0; i < bfcRows; i++) {
    var bfcTemp = await bfc.getCell(i, 2);
    var bfcMargin = await bfc.getCell(i, 4);
    //new vars
    var bfcWaitTime = await bfc.getCell(i, 5);
    var bfcUpdate = await bfc.getCell(i, 6);
    var bfcBuyLimit = await bfc.getCell(i, 7);
    var bfcRisk = await bfc.getCell(i, 8);
    var bfcOvnRisk = await bfc.getCell(i, 9);
    //end new vars
    var bfcObj = {
      name: bfcTemp.formattedValue,
      row: bfcTemp._row,
      sheetID: 2,
      margin: bfcMargin.formattedValue,
      wait: bfcWaitTime.formattedValue,
      update: bfcUpdate.formattedValue,
      buyLimit: bfcBuyLimit.formattedValue,
      risk: bfcRisk.formattedValue,
      ovnRisk: bfcOvnRisk.formattedValue,
    };
    bfcArr[i] = bfcObj;
  }
  //END BILLIONAIRE FLIP CLUB DATA

  //MASTER PASS DATA
  const mp = await doc.sheetsByIndex[3];
  await mp.loadCells();
  var mpRows = await mp.rowCount;
  var mpArr = new Array(mpRows);
  for (var i = 0; i < mpRows; i++) {
    var mpTemp = await mp.getCell(i, 2);
    var mpMargin = await mp.getCell(i, 4);
    //new vars
    var mpWaitTime = await mp.getCell(i, 5);
    var mpUpdate = await mp.getCell(i, 6);
    var mpBuyLimit = await mp.getCell(i, 7);
    var mpRisk = await mp.getCell(i, 8);
    var mpOvnRisk = await mp.getCell(i, 9);
    //end new vars
    var mpObj = {
      name: mpTemp.formattedValue,
      row: mpTemp._row,
      sheetID: 3,
      margin: mpMargin.formattedValue,
      wait: mpWaitTime.formattedValue,
      update: mpUpdate.formattedValue,
      buyLimit: mpBuyLimit.formattedValue,
      risk: mpRisk.formattedValue,
      ovnRisk: mpOvnRisk.formattedValue,
    };
    mpArr[i] = mpObj;
  }
  //END MASTER PASS DATA

  //Combine all data together to make things easier
  var fullArr = fmArr.concat(bfcArr);
  fullArr = fullArr.concat(mpArr);
  return fullArr;
}

async function getGEData(msg, itemID, itemName) {
  var url =
    "http://services.runescape.com/m=itemdb_rs/api/catalogue/detail.json?item=" +
    itemID;
  var thumbUrl =
    "http://services.runescape.com/m=itemdb_rs/1590564983665_obj_big.gif?id=" +
    itemID;
  var iconUrl =
    "http://services.runescape.com/m=itemdb_rs/1590564983665_obj_sprite.gif?id=" +
    itemID;

  await Request.get(url, async (error, response, body) => {
    if (error) {
      return console.dir(error);
    }

    var jsonObj = await JSON.parse(body);

    var price = await jsonObj.item.current.price;
    var today = await jsonObj.item.today.price;
    var day30 = await jsonObj.item.day30.change;
    var day90 = await jsonObj.item.day90.change;
    var item = await jsonObj.item.name;

    function capitalizeWords(str) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
    item = capitalizeWords(item);

    var newObj = {
      name: itemName,
      price: price,
      today: today,
      day30: day30,
      day90: day90,
    };

    var price = newObj.price;
    var today = newObj.today;
    var day30 = newObj.day30;
    var day90 = newObj.day90;

    const cursor = await client.db("itemIDs").collection(itemName).find();
    var result = await cursor.toArray();
    const permission = result[0].perm;
    const currChannel = msg.channel.id;
    //get current channel permissions
    var tempPerm = "";
    if (currChannel === fmChannel) {
      tempPerm = "fm";
    }
    if (currChannel === bfcChannel) {
      tempPerm = "bfc";
    }
    if (currChannel === mpChannel) {
      tempPerm = "mp";
    }
    //end getting channel perms
    if (
      permission === tempPerm ||
      tempPerm === "mp" ||
      (tempPerm === "bfc" && permission === "fm")
    ) {
      var nibArray = await grabArrayOfType(itemName, "NIB");
      var nisArray = await grabArrayOfType(itemName, "NIS");

      var tempRep = "";
      if (nibArray.length != 0 && nisArray.length != 0) {
        var recentNIB = nibArray[nibArray.length - 1];
        var time2 = moment(new Date(recentNIB.time)).fromNow();
        var price2 = recentNIB.price;
        var nibReply = "**NIB: **" + price2 + " (" + time2 + ")";

        var recentNIS = nisArray[nisArray.length - 1];
        var time3 = moment(new Date(recentNIS.time)).fromNow();
        var price3 = recentNIS.price;
        var nisReply = "\n" + "**NIS: **" + price3 + " (" + time3 + ")";
      } else {
        nibReply = "None found!\n";
        nisReply = "None found!";
      }

      var inbArray = await grabArrayOfType(itemName, "INB");
      var insArray = await grabArrayOfType(itemName, "INS");

      var tempReply = "";
      if (inbArray.length != 0 && insArray.length != 0) {
        var recentINB = inbArray[inbArray.length - 1];
        var time = moment(new Date(recentINB.time)).fromNow();
        var price5 = recentINB.price;
        var inbReply = "**INB: **" + price5 + " (" + time + ")";

        var recentINS = insArray[insArray.length - 1];
        var time1 = moment(new Date(recentINS.time)).fromNow();
        var price1 = recentINS.price;
        var insReply = "\n" + "**INS: **" + price1 + " (" + time1 + ")";
      } else {
        inbReply = "None found!\n";
        insReply = "None found!";
      }
    } else {
      var recentNIB,
        time2,
        price2,
        nibReply,
        recentNIS,
        time3,
        price3,
        nisReply,
        recentINB,
        time,
        price5,
        inbReply,
        recentINS,
        time1,
        price1,
        insReply;
      inbReply = "Data is not available in this channel";
      insReply = " ";
      nibReply = "Data is not available in this channel";
      nisReply = " ";
    }

    //GET SPREADSHEET DATA

    var margin, waitTime, update, updateAmount, buyLimit, risk, ovnRisk;

    var fullArray = await getSpreadsheet();

    for (var i = 0; i < fullArray.length; i++) {
      if (fullArray[i].name === itemName) {
        margin = fullArray[i].margin;
        waitTime = fullArray[i].wait;
        update = fullArray[i].update;
        buyLimit = fullArray[i].buyLimit;
        risk = fullArray[i].risk;
        ovnRisk = fullArray[i].ovnRisk;
      }
    }

    //END SPREADSHEET DATA

    const data = {
      embed: {
        color: 1211326,
        footer: {
          text: "Created by @djl220#5648",
        },
        thumbnail: {
          url: thumbUrl,
        },
        author: {
          name: item,
          icon_url: iconUrl,
        },
        fields: [
          {
            name: "Grand Exchange Information:",
            value:
              "**Price: **" +
              price +
              "\n**Today: **" +
              today +
              "\n**30 Days: **" +
              day30 +
              "\n**3 Months: **" +
              day90,
            inline: true,
          },
          {
            name: "Spreadsheet Information:",
            value:
              "**Margin: **" +
              margin +
              "\n**Update: **" +
              update +
              " every " +
              waitTime +
              "\n**Buy Limit: **" +
              buyLimit +
              "\n**Risk / Overnight Risk: **" +
              risk +
              " / " +
              ovnRisk,
            inline: true,
          },
          {
            name: "‎ ‎",
            value: "**Manatee Gaming Community Data:‎**",
            inline: false,
          },
          {
            name: "Most Recent INB/INS:",
            value: inbReply + insReply,
            inline: true,
          },
          {
            name: "Most Recent NIB/NIS:",
            value: nibReply + nisReply,
            inline: true,
          },
        ],
      },
    };
    msg.reply(data);
  });
}

//this function will take in prices and times and map a chart, then save it to local and send it in the message (24 hours)
async function create6hChart(msg, itemName, inbChartData, insChartData) {
  const anychart = require("anychart")(window);
  const anychartExport = require("anychart-nodejs")(anychart);

  var dataSet = anychart.data.set();
  var dataSet2 = anychart.data.set();

  dataSet.data(inbChartData);
  dataSet2.data(insChartData);

  const chart = anychart.scatter();

  var dateScale = anychart.scales.dateTime();

  var dateTimeScale = anychart.scales.dateTime();

  var dateTimeTicks = dateTimeScale.ticks();
  dateTimeTicks.interval(0, 0, 0, 1);
  var minorTicks = dateTimeScale.minorTicks();
  // minorTicks.interval(0, 0, 0, 0, 1);

  var oldDate = moment().subtract(7, "hours").toDate();
  var newDate = moment().add(1, "hours").toDate();
  //day before
  dateTimeScale.minimum(oldDate);
  //an hour after
  dateTimeScale.maximum(newDate);

  chart.background().fill({
    keys: ["#36393f"],
  });

  chart.xAxis({
    ticks: true,
    labels: true,
    minorTicks: true,
    minorLabels: false,
  });

  chart.yGrid().enabled(true);
  chart.yGrid().stroke({
    // set stroke color
    color: "#ffffff",
    // set dashes and gaps length
    dash: "3 5",
  });
  chart.yGrid().palette(["#4f535c 0.25", "#36393f 0.25"]);

  chart.xScale(dateTimeScale);

  var seriesData_1 = dataSet.mapAs({ x: "x", value: "y" });
  var seriesData_2 = dataSet2.mapAs({ x: "x", value: "y" });

  var yTitle = chart.yAxis().title();
  yTitle.text("Price");
  yTitle.fontColor("#ffffff");
  yTitle.enabled(true);
  var xTitle = chart.xAxis().title();
  xTitle.text("Time");
  xTitle.fontColor("#ffffff");
  xTitle.enabled(true);

  var series1 = chart.line(seriesData_1);
  var series2 = chart.line(seriesData_2);

  series1.name("INB");
  series2.name("INS");

  var labels = chart.xAxis().labels();
  labels.hAlign("center");
  labels.width(60);
  labels.format(function (value) {
    var date = new Date(value["tickValue"]);
    var options = {
      hour: "numeric",
      minute: "numeric",
    };
    var time = date.toUTCString();
    var indOfSpace = time.indexOf(":");
    time = time.substring(indOfSpace - 2, time.length);
    time = time.trim();
    return time;
  });

  series1.labels(true);
  series1.stroke("#856fde");
  series1.labels().fontSize(11);
  var background = series1.labels().background();
  background.enabled(true);
  background.fill("#000000 0.8");
  background.stroke("#856fde");
  background.cornerType("round");
  background.corners(5);

  series2.labels(true);
  series2.stroke("#dbb32e");
  series2.labels().fontSize(11);
  var background2 = series2.labels().background();
  background2.enabled(true);
  background2.fill("#000000 0.8");
  background2.stroke("#dbb32e");
  background2.cornerType("round");
  background2.corners(5);

  chart
    .legend()
    .enabled(true)
    .fontColor("#ffffff")
    .fontSize(13)
    .padding([0, 0, 10, 0]);

  chart.xAxis().labels().rotation(-90);
  chart.xAxis().labels().fontColor("#ffffff");
  chart.yAxis().labels().fontColor("#ffffff");
  chart.bounds(0, 0, 800, 600);
  chart.container("container");
  chart.draw();

  // generate JPG image and save it to a file
  /* eslint-disable no-console */
  var author = msg.author;
  //name file after author so that if multiple people create charts they don't get mixed up
  var fileName = "./image/temp-" + author + ".jpg";
  await anychartExport.exportTo(chart, "jpg").then(
    (image) => {
      fs.writeFile(fileName, image, (fsWriteError) => {
        console.log(fsWriteError || "Complete");
      });
    },
    (generationError) => {
      console.log(generationError);
    }
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await msg.reply("Last 6 hours of " + itemName, {
    files: [fileName],
  });
  //delete file after image is sent
  fs.unlink(fileName, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}
//end create inb/ins graph

async function createChart(msg, itemName, inbChartData, insChartData) {
  const anychart = require("anychart")(window);
  const anychartExport = require("anychart-nodejs")(anychart);
  var dataSet = anychart.data.set();
  var dataSet2 = anychart.data.set();

  console.log(inbChartData);
  dataSet.data(inbChartData);
  dataSet2.data(insChartData);

  const chart = anychart.scatter();

  var dateScale = anychart.scales.dateTime();

  var dateTimeScale = anychart.scales.dateTime();

  var dateTimeTicks = dateTimeScale.ticks();
  dateTimeTicks.interval(0, 0, 0, 1);
  var minorTicks = dateTimeScale.minorTicks();
  minorTicks.interval(0, 0, 0, 0, 1);

  chart.background().fill({
    keys: ["#454444"],
  });

  chart.xAxis({
    ticks: true,
    labels: true,
    minorTicks: false,
    minorLabels: false,
  });

  chart.yGrid().enabled(true);
  chart.yGrid().stroke({
    // set stroke color
    color: "#ffffff",
    // set dashes and gaps length
    dash: "3 5",
  });

  chart.yGrid().palette(["#4f535c 0.25", "#454444 0.25"]);

  var oldDate = moment().subtract(1, "days").subtract(1, "hours").toDate();
  var newDate = moment().add(1, "hours").toDate();
  //day before
  dateTimeScale.minimum(oldDate);
  //an hour after
  dateTimeScale.maximum(newDate);

  chart.xScale(dateTimeScale);

  var seriesData_1 = dataSet.mapAs({ x: "x", value: "y" });
  var seriesData_2 = dataSet2.mapAs({ x: "x", value: "y" });

  var yTitle = chart.yAxis().title();
  yTitle.text("Price");
  yTitle.fontColor("#ffffff");
  yTitle.enabled(true);
  var xTitle = chart.xAxis().title();
  xTitle.text("Time");
  xTitle.fontColor("#ffffff");
  xTitle.enabled(true);

  var series1 = chart.line(seriesData_1);
  var series2 = chart.line(seriesData_2);

  series1.name("INB");
  series2.name("INS");

  //messing with labels
  series1.labels(true);
  series1.stroke("#856fde");
  series1.labels().fontSize(11);
  var background = series1.labels().background();
  background.enabled(true);
  background.fill("#000000 0.8");
  background.stroke("#856fde");
  background.cornerType("round");
  background.corners(5);

  series2.labels(true);
  series2.stroke("#dbb32e");
  series2.labels().fontSize(11);
  var background2 = series2.labels().background();
  background2.enabled(true);
  background2.fill("#000000 0.8");
  background2.stroke("#dbb32e");
  background2.cornerType("round");
  background2.corners(5);

  var labels = chart.xAxis().labels();
  labels.hAlign("center");
  labels.width(60);
  labels.format(function (value) {
    var date = new Date(value["tickValue"]);
    var options = {
      hour: "numeric",
      minute: "numeric",
    };
    var time = date.toUTCString();
    var indOfSpace = time.indexOf(":");
    time = time.substring(indOfSpace - 2, time.length);
    time = time.trim();
    return time;
  });

  chart
    .legend()
    .enabled(true)
    .fontSize(13)
    .fontColor("#ffffff")
    .padding([0, 0, 10, 0]);

  chart.xAxis().labels().rotation(-90);
  chart.xAxis().labels().fontColor("#ffffff");
  chart.yAxis().labels().fontColor("#ffffff");
  chart.bounds(0, 0, 800, 600);
  chart.container("container");
  chart.draw();

  // generate JPG image and save it to a file
  /* eslint-disable no-console */
  var author = msg.author;
  //name file after author so that if multiple people create charts they don't get mixed up
  var fileName = "./image/temp-" + author + ".jpg";
  await anychartExport.exportTo(chart, "jpg").then(
    (image) => {
      fs.writeFile(fileName, image, (fsWriteError) => {
        console.log(fsWriteError || "Complete");
      });
    },
    (generationError) => {
      console.log(generationError);
    }
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await msg.reply("Last 24 hours of " + itemName, {
    files: [fileName],
  });
  //delete file after image is sent
  fs.unlink(fileName, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

async function getItemID(itemName) {
  const cursor = await client.db("itemIDs").collection(itemName).find();
  var test = await cursor.toArray();
  var currID = test[0].id;
  return currID;
}

//this function will return an array of JSON object of a given array
function getDataForChart(grabbedArray) {
  if (grabbedArray !== undefined) {
    var newArr = new Array(grabbedArray.length);
    for (var i = 0; i < grabbedArray.length; i++) {
      var currPrice = grabbedArray[i].price;
      var currTime = grabbedArray[i].time;
      //change date into something
      var tempDate = new Date(currTime);
      var currType = grabbedArray[i].type;
      var newObj = { type: currType, x: new Date(currTime), y: currPrice };
      newArr[i] = newObj;
    }
    return newArr;
  } else {
    return 0;
  }
}
//function complete

//this will grab the last 24 hours of data
async function grabLast24h(itemName, dataType) {
  //this gets the full array of an item's type
  var typeArray = await grabArrayOfType(itemName, dataType);
  //this sets a new array equal to the amount of items we're returning
  var newArr = new Array(typeArray.length);
  var count = 0;

  for (var i = 0; i < typeArray.length; i++) {
    var tempPrice = typeArray[i].price;
    var tempDate = typeArray[i].time;
    var tempObj = { type: dataType, price: tempPrice, time: tempDate };
    var hours = moment().diff(moment(tempDate), "hours");
    if (hours < 24 && hours >= 0) {
      newArr[count] = tempObj;
      count++;
    }

    var newArray = newArr.filter((value) => Object.keys(value).length !== 0);
  }
  return newArray;
}
//grab last 6h of data
async function grabLast6h(itemName, dataType) {
  //this gets the full array of an item's type
  var typeArray = await grabArrayOfType(itemName, dataType);
  //this sets a new array equal to the amount of items we're returning
  var newArr = new Array(typeArray.length);
  var count = 0;

  for (var i = 0; i < typeArray.length; i++) {
    var tempPrice = typeArray[i].price;
    var tempDate = typeArray[i].time;
    var tempObj = { type: dataType, price: tempPrice, time: tempDate };
    var hours = moment().diff(moment(tempDate), "hours");
    if (hours < 7 && hours >= 0) {
      newArr[count] = tempObj;
      count++;
    }

    var newArray = newArr.filter((value) => Object.keys(value).length !== 0);
  }
  return newArray;
}

//this function returns an array of the last x entries of a given type for a given item
async function grabLastX(itemName, dataType, toGrab) {
  //this gets the full array of an item's type
  var typeArray = await grabArrayOfType(itemName, dataType);
  //this sets a new array equal to the amount of items we're returning
  var newArr = new Array(toGrab);
  var count = 0;
  //this calculates how to grab each item and populates our new array
  var numToCount = typeArray.length - toGrab;
  for (var i = typeArray.length - 1; i >= numToCount; i--) {
    newArr[count] = typeArray[i];
    count = count + 1;
  }
  return newArr;
}
//function complete

//this method returns an array of the type specified
async function grabArrayOfType(itemName, dataType) {
  const cursor = await client
    .db("itemList")
    .collection(itemName)
    .find({ type: dataType });
  var result = await cursor.toArray();
  return result;
}
//function complete

//this method inserts data into the correct collection
async function addData(collection, dataType, dataValue, timeStamp) {
  //check if item exists
  var exists = await doesExist(collection);

  if (exists) {
    //case for inb
    if (dataType === "inb" || dataType === "INB") {
      var newObj = { type: "INB", price: dataValue, time: timeStamp };
      await client.db("itemList").collection(collection).insertOne(newObj);
    }
    //case for ins
    if (dataType === "ins" || dataType === "INS") {
      var newObj = { type: "INS", price: dataValue, time: timeStamp };
      await client.db("itemList").collection(collection).insertOne(newObj);
    }
    //case for nib
    if (dataType === "NIB" || dataType === "nib") {
      var newObj = { type: "NIB", price: dataValue, time: timeStamp };
      await client.db("itemList").collection(collection).insertOne(newObj);
    }
    //case for nis
    if (dataType === "NIS" || dataType === "nis") {
      var newObj = { type: "NIS", price: dataValue, time: timeStamp };
      await client.db("itemList").collection(collection).insertOne(newObj);
    }
  } //for if exists
  else {
    console.log("does not exist");
  }
}
//FUNCTION COMPLETE

async function newID(itemName, itemID, type, permission) {
  var database = client.db("itemIDs");
  try {
    await database.createCollection(itemName);

    var newObj = { name: itemName, id: itemID, type: type, perm: permission };

    await client.db("itemIDs").collection(itemName).insertOne(newObj);
  } catch (e) {
    console.error(e);
  }
}

//call this if i add stuff to item ids, this will automatically add it to the other db
async function addToDatabase() {
  var oldDB = client.db("itemIDs");
  var newDB = client.db("itemList");

  var list = await client.db("itemIDs").listCollections().toArray();

  for (var i = 0; i < list.length; i++) {
    await newDB.createCollection(list[i].name);
  }
}

//this function takes in the client and name of an item, and creates it in the database
async function createItem(itemName) {
  var exists = await doesExist(itemName);
  var ret = "";
  if (!exists) {
    var database = client.db("itemList");
    try {
      await database.createCollection(itemName);
      ret = "created entry for " + itemName + "!";
      return ret;
    } catch (e) {
      console.error(e);
    }
  } else {
    ret = itemName + " already exists in the database!";
    return ret;
  }
}
//FUNCTION COMPLETE

//this function takes in the client and an item name and checks if it exists in the database
async function doesExist(itemName) {
  //puts itemlist collections into an array
  var test = await client.db("itemIDs").listCollections().toArray();
  //iterates over each and checks if the name is there
  for (var i = 0; i < test.length; i++) {
    //if the name exists, returns true
    if (test[i].name === itemName) {
      return true;
    }
  }
  //else returns false
  return false;
}
//FUCNTION COMPLETE
