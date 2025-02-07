import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeFaculty() {
  const browser = await puppeteer.launch({ headless: false }); // Change to true to run without a UI
  const page = await browser.newPage();

  const baseUrl = 'https://www.champlain.edu/directory/?tab=people&filter-sp=';
  let currentPageUrl = baseUrl;
  const facultyList: any[] = [];

  // Function to scrape faculty data from a page
  const scrapeData = async () => {
    const data = await page.evaluate(() => {
      const facultyMembers: any[] = [];
      const facultyElements = document.querySelectorAll('div.people-listing');
      
      facultyElements.forEach((element) => {
        const name = (element.querySelector('.people-listing-name') as HTMLElement)?.textContent?.trim() || '';
        const title = (element.querySelector('.people-listing-title') as HTMLElement)?.textContent?.trim() || '';
        const departments = Array.from(element.querySelectorAll('.sm-type a')).map((el) => el.textContent?.trim() || '');
        const imageUrl = (element.querySelector('img') as HTMLImageElement)?.src || '';
        
        facultyMembers.push({ name, title, departments, imageUrl });
      });

      return facultyMembers;
    });

    return data;
  };

  // Function to load the next page using the "View More People" button
  const loadNextPage = async () => {
    try {

      const loadMoreButton = await page.$('a.btn.btn-lg.btn-primary.btn-left[data-load-more]');
      if (loadMoreButton) {
        const nextPageUrl = await page.evaluate((btn) => btn.getAttribute('href'), loadMoreButton);
        
        // Navigate to the next page
        if (nextPageUrl) {
          await page.goto(nextPageUrl, { waitUntil: 'domcontentloaded' });

          // Scrape the new page's data
          const newFacultyData = await scrapeData();
          facultyList.push(...newFacultyData);

          console.log(`Scraped ${facultyList.length} faculty members`);

          await loadNextPage();
        }
      } else {
        console.log('No more pages to load.');
      }
    } catch (error) {
      console.log('Error or no more faculty to load:', error);
    }
  };


  await page.goto(currentPageUrl, { waitUntil: 'domcontentloaded' });
  let initialFacultyData = await scrapeData();
  facultyList.push(...initialFacultyData);
  console.log(`Scraped ${facultyList.length} faculty members`);

  await loadNextPage();

  fs.writeFileSync('faculty.json', JSON.stringify(facultyList, null, 2));

  // Close the browser
  await browser.close();
}

scrapeFaculty();

