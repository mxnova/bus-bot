const axios = require('axios');
const { load } = require('cheerio');

module.exports = () => {
  const url = 'https://webservices.runshaw.ac.uk/bus/busdepartures.aspx';

  return new Promise((resolve, reject) => {
    axios(url)
      .then((response) => {
        const html = response.data;
        const $ = load(html);
        const busData = [];

        // Add an object containing the bus number and location to busData for each bus
        $('td:even').each(function () {
          busData.push({
            number: $(this).text(),
            location: $(this).next().text(),
          });
        });

        if (busData.length === 0) {
          reject('Scrape Failed (table missing from website)');
        } else {
          resolve(busData);
        }
      })
      .catch((err) => reject(err));
  });
};
