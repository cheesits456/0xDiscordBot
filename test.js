const puppeteer = require("puppeteer");

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto("https://0x.org/zrx/staking");
	const statsElements = await page.$$eval("#app > main:first-of-type > div:nth-of-type(2) > div:first-of-type > div", stats => stats.map(stat => stat.innerHTML));
	await browser.close();
})();
