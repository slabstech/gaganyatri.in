import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SpaceWalks {
  astronaut: string;
  date: string;
  duration: string;
  description: string;
}

const News: React.FC = () => {  
  const [newsData, setNewsData] = useState<SpaceWalks[]>([]);
  useEffect(() => {
    const fetchNewsData = async () => {
      const result = await axios.get<SpaceWalks[]>('https://gaganyatri-django-spaces.hf.space/api/v1/space_walks/api/space_walks/');
      setNewsData(result.data);
    };

    fetchNewsData();
  }, []);

   return (
    <div>
      {newsData.map((news, index) => (
        <div key={index}>
          <h2>Astronaut: {news.astronaut}</h2>
          <p>Date: {news.date}</p>
          <p>Duration: {news.duration}</p>
          <p>Description: {news.description}</p>
        </div>
      ))}
    </div>
  );
};

export default News;