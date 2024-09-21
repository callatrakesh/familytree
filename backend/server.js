const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;  
app.use(cors());
app.use(bodyParser.json());

app.get('/familyData', (req, res) => {
  fs.readFile(path.join(__dirname, 'familyData.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading family data.');
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint to save updated family data
app.post('/familyData', (req, res) => {
  const newMember = req.body;
  fs.writeFile(path.join(__dirname, 'familyData.json'), JSON.stringify(newFamilyData, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error saving family data.');
    }
    familyData.push(newMember);
    res.status(201).json(newMember);
    res.send('Family data updated successfully!');
  });
});

// Update an existing family member
app.put('/familyData/:id', (req, res) => {
  const memberId = parseInt(req.params.id, 10);
  const updatedMember = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading family data.');
    }

    let familyData = JSON.parse(data);
    const memberIndex = familyData.findIndex(member => member.id === memberId);

    if (memberIndex === -1) {
      return res.status(404).send('Member not found.');
    }

    // Update the member data
    familyData[memberIndex] = { ...familyData[memberIndex], ...updatedMember };

    // Write updated family data back to the file
    fs.writeFile(filePath, JSON.stringify(familyData, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error updating family data.');
      }
      res.json(familyData[memberIndex]);
    });
  });
});

// Delete a family member
app.delete('/familyData/:id', (req, res) => {
  const memberId = parseInt(req.params.id, 10);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading family data.');
    }

    let familyData = JSON.parse(data);
    const newFamilyData = familyData.filter(member => member.id !== memberId);

    if (newFamilyData.length === familyData.length) {
      return res.status(404).send('Member not found.');
    }

    // Write updated family data back to the file
    fs.writeFile(filePath, JSON.stringify(newFamilyData, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error deleting family member.');
      }
      res.send('Member deleted successfully!');
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
