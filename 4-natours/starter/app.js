const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;

//Using this middleware to get the body method on the req
app.use(express.json());

const tourData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/tours', (req, res) => {
  res.status(200).json({
    status: 'Success',
    result: tourData.length,
    tourData,
  });
});

app.post('/api/tours', (req, res) => {
    const newId = tourData[tourData.length - 1].id + 1;
    const newTour = { id: newId, ...req.body };
    tourData.push(newTour)
    console.log(JSON.stringify(tourData))

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tourData), err => {
        if(err) console.log('File Not Found!!')
        res.status(201).json({
            "status": "success",
            "data": newTour
       })
   });
});





app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
