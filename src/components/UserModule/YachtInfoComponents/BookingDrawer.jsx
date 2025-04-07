import React from 'react';
import { Card, CardContent, Typography, Divider, Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import styled from 'styled-components';
import { BookingSelection } from './BookingSelection';


const Price = styled.div`
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: bold;
`;
const BookButton = styled.button`
  background-color: #0f4f98;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;

  &:hover {
    background-color: #022a59;
  }
`;
const DrawerContent = () => {
  return (
    <Box p={2}>
        <Typography>Starting From</Typography>
      <Price>$50 / hour</Price>
      <Typography variant="subtitle1" component="div" gutterBottom>
        Captain is included
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        A captain is provided by the listing owner to host and operate.
      </Typography>
      <BookingSelection/>

      {/* Departure Options */}
      <Card sx={{ width: "100%", borderRadius: '8px', boxShadow: 3, border: "1px solid gray", marginTop: "20px" }}>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6" component="div" gutterBottom>
                Wed 18 Sep
              </Typography>
              <Typography variant="h6" component="div" gutterBottom>
                .  4 hours
              </Typography>
            </div>
            <Typography variant="h6" gutterBottom>
              $250
            </Typography>
          </div>

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" component="div" gutterBottom>
            Available departure options:
          </Typography>
        {/* <Details> */}
       
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Button variant="outlined">1 pm</Button>
              </Grid>
              <Grid item xs={4}>
                <Button variant="outlined">2 pm</Button>
              </Grid>
              <Grid item xs={4}>
                <Button variant="outlined">3 pm</Button>
              </Grid>
            </Grid>
          </Box>

        </CardContent>
      </Card>
      <br>
      </br>
      <br></br>
      <BookButton>Book Now</BookButton>

    </Box>
  );
};

export default DrawerContent;
