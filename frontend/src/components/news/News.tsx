import React from 'react';
import * as newsData from './newsData.json'; // Assuming you have a JSON file with your news data

// Define any interfaces or types needed for your data
interface NewsItem {
  title: string;
  content: string;
  // Add other properties as needed
}
/*
// Define any functions or classes needed for your page
function displayNews(newsItems: NewsItem[]): void {
  const newsItemsContainer = document.getElementById('news-items');

  newsItems.forEach(item => {
    const newsItemElement = document.createElement('div');
    newsItemElement.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.content}</p>
    `;
    newsItemsContainer.appendChild(newsItemElement);
  });
}

// Call any functions or initialize any variables needed for your page
displayNews(newsData);
*/
const News = () => {
	return (
		<div>
			<div className="container">
				<div className="error-page">
					<h1 className="error-code">404</h1>
					<p className="error-text">Page not found</p>
				</div>
			</div>
		</div>
	);
};

export default News;