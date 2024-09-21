import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const FamilyTreeComponent = () => {
  const treeRef = useRef(null);
  const familyTreeRef = useRef(null); 
  const [family, setFamily] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    birthDate: '',
    deathDate: '',
    gender: '',
    photo: '',
    fid: '',
    mid: '',
    pids: '',
    city: '',
    country: ''
  });
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://balkan.app/js/FamilyTree.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = async () => {
      // Create a new FamilyTree instance and store it in familyTreeRef
      const familyTree = new window.FamilyTree(treeRef.current, {
        mouseScrool: window.FamilyTree.action.none,
        scaleInitial: window.FamilyTree.match.boundary,
        enableSearch: true,
        nodeTreeMenu: true,
        template: "hugo",
        nodeBinding: {
          field_0: "name",
          field_1: "birthDate",
          img_0: "photo"
        },
        nodeMenu: {
          details: { text: "Details" },
          edit: { text: "Edit" }
        }
      });

      familyTreeRef.current = familyTree; 

      const response = await axios.get('http://localhost:3001/familyData');
      const familyData = response.data;      
      familyTree.load(familyData); 
      setFamily(familyData); 
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (newMember.name && newMember.birthDate) {
      const newId = family.length > 0 ? Math.max(...family.map(member => member.id)) + 1 : 1;
      const newFamilyMember = {
        id: newId,
        name: newMember.name,
        birthDate: newMember.birthDate,
        deathDate: newMember.deathDate,
        gender: newMember.gender,
        photo: newMember.photo || 'https://cdn.balkan.app/shared/m60/default.jpg',
        fid: parseInt(newMember.fid, 10) || null,
        mid: parseInt(newMember.mid, 10) || null,
        pids: parseInt(newMember.pids, 10) || null,
        city: newMember.city,
        country: newMember.country
      };

      // Fetch the current family data from the server
      await axios.post('http://localhost:3001/familyData', newFamilyMember);
      const updatedFamily = [...family, newFamilyMember];
      setFamily(updatedFamily);

      
      const familyTree = familyTreeRef.current;
      familyTree.add(newFamilyMember);
      familyTree.draw();

      // Clear the form
      setNewMember({
        name: '',
        birthDate: '',
        deathDate: '',
        gender: '',
        photo: '',
        fid: '',
        mid: '',
        pids: '',
        city: '',
        country: ''
      });
      setShowForm(false);
    }
  };

  return (
    <div>
      <div ref={treeRef} style={{ width: "100%", height: "100vh" }}/>

      <div className="member-action">
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>Add Member</button>
      </div>     

      {showForm && (
        <div className="modal">
          <div className="modal-inner">
            <div className="modal-header">
              <h2 className="modal-title">Add a New Member</h2>
            </div>
            <div className="modal-body">          
              <form onSubmit={handleAddMember}>                
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Name"
                    value={newMember.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-6 form-group">
                    <input
                      type="date"
                      name="birthDate"
                      className="form-control"
                      placeholder="Birth Date"
                      value={newMember.birthDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-6 form-group">
                    <input
                        type="date"
                        name="deathDate"
                        className="form-control"
                        placeholder="Death Date"
                        value={newMember.deathDate}
                        onChange={handleInputChange}
                      />
                  </div>
                  <div className="col-6 form-group">
                    <select name="gender" className="form-control" value={newMember.gender} onChange={handleInputChange}>
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="col-6 form-group">
                    <input
                      type="number"
                      name="fid"
                      className="form-control"
                      placeholder="Father ID"
                      value={newMember.fid}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <input
                      type="number"
                      name="mid"
                      className="form-control"
                      placeholder="Mother ID"
                      value={newMember.mid}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <input
                      type="number"
                      name="pids"
                      className="form-control"
                      placeholder="Partner ID"
                      value={newMember.pids}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="photo"
                    className="form-control"
                    placeholder="Photo URL"
                    value={newMember.photo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="row">
                  <div className="col-6 form-group">
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      placeholder="City Name"
                      value={newMember.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <input
                      type="text"
                      name="country"
                      className="form-control"
                      placeholder="Country Name"
                      value={newMember.country}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary mr10">Add Member</button>
                <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTreeComponent;
