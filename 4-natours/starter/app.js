const { create } = require('domain');
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;

//Using this middleware to get the body method on the req
app.use(express.json());

const tourData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//Get tours data
const getTour = (req, res) => {
  res.status(200).json({
    status: 'Success',
    result: tourData.length,
    tourData,
  });
};

//Create new tour
const createTour = (req, res) => {
  const newId = tourData[tourData.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tourData.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tourData),
    (err) => {
      if (err) console.log('File Not Found!!');
      res.status(201).json({
        status: 'success',
        data: newTour,
      });
    }
  );
};

//Get tour by id
const getTourById = (req, res) => {
  const selectedId = req.params.id * 1;

  const tour = tourData.find((tour) => tour.id === selectedId);
  if (!tour) {
    res.status(404).send('No Tour Found');
  }
  res.status(200).json({
    status: 'Success',
    data: tour,
  });
};

//Update the tour
const updateTour = (req, res) => {
  const id = req.params.id * 1;
  const updatedTour = tourData.find((updatedEl) => updatedEl.id === id);
  const updatedData = { ...tourData[updatedTour], ...req.body };

  tourData[updatedTour] = updatedData;
  if (id > tourData.length) {
    res.status(401).json({
      message: 'ID not found',
    });
  }
  res.json({
    data: updatedData,
  });
};

//Delete tour
const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

app.route('/api/tours').get(getTour).post(createTour);

app
  .route('/api/tours/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
