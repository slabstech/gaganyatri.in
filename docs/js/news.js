const data = [
    {
      "title": "News Title 1",
      "date": "October 1, 2023",
      "description": "Brief description of the news item."
    },
    {
      "title": "News Title 2",
      "date": "October 2, 2023",
      "description": "Brief description of the news item."
    }
    ];

    const itemsPerPage = 5; // Number of news items to display per page
    let currentPage = 1; // Current page number


    function displayNewsItems(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newsItems = data.slice(startIndex, endIndex);

    const newsItemsDiv = document.getElementById('news-items');
    newsItemsDiv.innerHTML = '';

  newsItems.forEach(item => {
      const newsItemDiv = document.createElement('div');
      newsItemDiv.className = 'news-item';

      const title = document.createElement('h3');
      title.textContent = item.title;

      const date = document.createElement('p');
      date.textContent = `Date: ${item.date}`;

      const description = document.createElement('p');
      description.textContent = item.description;

      newsItemDiv.appendChild(title);
      newsItemDiv.appendChild(date);
      newsItemDiv.appendChild(description);

      newsItemsDiv.appendChild(newsItemDiv);
  });
}

  function displayPagination() {
    const numPages = Math.ceil(data.length / itemsPerPage);
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    for (let i = 1; i <= numPages; i++) {
      const pageLink = document.createElement('a');
      pageLink.href = '#';
      pageLink.textContent = i;
      pageLink.addEventListener('click', () => {
        currentPage = i;
        displayNewsItems(currentPage);
        displayPagination();
      });

      paginationDiv.appendChild(pageLink);
    }
  }
  displayNewsItems(currentPage);
  displayPagination();
