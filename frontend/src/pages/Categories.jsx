import React from 'react';
import { Container, Typography, Card, CardActionArea, CardMedia, CardContent } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const hardcodedCategories = [
  {
    id: 1,
    name: 'Filmes',
    description: 'Explore o universo cinematográfico',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 2,
    name: 'Séries',
    description: 'Viaje por temporadas infinitas',
    image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 3,
    name: 'Documentários',
    description: 'Conheça histórias reais e inspiradoras',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 4,
    name: 'Animações',
    description: 'Diversão para todas as idades',
    image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 5,
    name: 'Esportes',
    description: 'Acompanhe os melhores eventos esportivos',
    image: 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=500&q=60',
  },
];

const Categories = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Categorias
      </Typography>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          320: { slidesPerView: 1 },
          600: { slidesPerView: 2 },
          900: { slidesPerView: 3 },
        }}
        style={{ paddingBottom: '40px' }}
      >
        {hardcodedCategories.map((category) => (
          <SwiperSlide key={category.id}>
            <Card>
              <CardActionArea href={`/categories/${category.id}`}>
                <CardMedia
                  component="img"
                  height="180"
                  image={category.image}
                  alt={category.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default Categories;
