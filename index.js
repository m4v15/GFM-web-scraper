import puppeteer from "puppeteer";

let urls = [];

const getGFMData = async (url) => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  const data = await page.evaluate(() => {
    const titleClass = ".p-campaign-title";
    const titleDiv = document.querySelector(titleClass);
    const text = titleDiv.innerText;

    const imageClass = ".campaign-hero_image__J8h8b";
    const imageDiv = document.querySelector(imageClass);
    const imageURL = imageDiv.children[0].src;

    const progressClass = ".progress-meter_progressMeterHeading__A6Slt";
    const progressDiv = document.querySelector(progressClass);
    const progress = progressDiv.children[0].innerText;
    const target = progressDiv.children[1].innerText;

    return { text, imageURL, progress, target };
  });

  const donateUrl = `${url}/donate?source=btn_donate`;
  const fullData = { ...data, url, donateUrl };
  // Close the browser
  await browser.close();
  return fullData;
};

const getAllGFMData = (urls) => {
  Promise.all(urls.map(async (url) => await getGFMData(url))).then((data) =>
    console.log(data)
  );
};

// Start the scraping
// getAllGFMData(urls);
