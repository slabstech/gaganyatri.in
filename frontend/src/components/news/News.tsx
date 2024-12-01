import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Container } from '@mui/material';

interface SpaceWalks {
  astronaut: string;
  date: string;
  duration: string;
  description: string;
}

const News: React.FC = () => {
  const [newsData, setNewsData] = useState<SpaceWalks[]>([]);

  const onlineUrl  = import.meta.env.VITE_GAGANYATRI_BACKEND_APP_API_URL;
  const spaceUrl = onlineUrl + 'space_walks/api/space_walks/';

  useEffect(() => {
    const fetchNewsData = async () => {
      const result = await axios.get<SpaceWalks[]>(spaceUrl);
      setNewsData(result.data);
    };

    fetchNewsData();
  }, []);

  return (
    <Container maxWidth="md">
      {newsData.map((news, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Astronaut: {news.astronaut}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Date: {news.date}
            </Typography>
            <Typography variant="body2">
              Duration: {news.duration}
            </Typography>
            <Typography variant="body2">
              Description: {news.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default News;
