const axios = require('axios');
const cheerio = require('cheerio');

module.exports = class Scraper {
  static scrape() {
    const url = 'https://webservices.runshaw.ac.uk/bus/busdepartures.aspx';

    return new Promise((resolve, reject) => {
      axios(url)
        .then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);
          const busData = [];

          // Add an object containing the bus number and location to busData for each bus
          $('td:even').each(function () {
            busData.push({
              number: $(this).text(),
              location: $(this).next().text(),
            });
          });

          // Return busData
          resolve(busData);
        })
        .catch((err) => reject(err));
    });
  }
};
