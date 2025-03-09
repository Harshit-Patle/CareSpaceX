import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Weight, Ruler, Droplet, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import axios from "axios";
import Cookies from 'js-cookie';

const Profile = () => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({
    phone: '',
    weight: '',
    height: ''
  });
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let email = Cookies.get('email');
        const response = await axios.post(
          `${backendURL}/profile/user`,
          { email },
          { headers: { "Content-Type": "application/json", }, }
        );
        console.log(response);
        setUser(response.data[0]); // Assuming response.data is the user object
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Something went wrong!");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      setEditedValues({
        phone: user.phone || '',
        weight: user.weight || '',
        height: user.height || ''
      });
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedValues({
      phone: user.phone || '',
      weight: user.weight || '',
      height: user.height || ''
    });
  };

  const handleSave = () => {
    setUser(prev => ({
      ...prev,
      ...editedValues
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedValues({
      phone: user.phone || '',
      weight: user.weight || '',
      height: user.height || ''
    });
  };

  return (
    <div className="h-fit p-3 ">
      <Card className="w-full border border-purple-100 bg-[#a4def0]">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-3xl font-bold text-[#563393]">
            My Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="px-3 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto">
            {/* Info Cards */}
            {[
              { icon: Mail, label: 'Email', value: user?user.email : "N/A" },
              { icon: Phone, label: 'Phone', value: user?user.phone : "N/A", editable: true },
              { icon: User, label: 'Gender', value: user?user.gender : "N/A" },
              { icon: Calendar, label: 'Date of Birth', value: user?user.dob : "N/A" },
              { icon: Weight, label: 'Weight(KG)', value: `${user?user.weight : "N/A"} kg`, editable: true, field: 'weight' },
              { icon: Ruler, label: 'Height(CM)', value: `${user?user.height : "N/A"} cm`, editable: true, field: 'height' },
              { icon: Droplet, label: 'Blood Group', value: user?user.bloodGroup : "N/A" },
              { icon: MapPin, label: 'Location', value:`${user.city},${user.state},${user.country}`}
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-[#ffffff76] rounded-lg border border-purple-100 shadow-sm hover:border-[#563393] transition-colors">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <item.icon className="w-6 h-6 text-[#563393]" />
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="text-sm font-medium text-purple-400">{item.label}</p>
                  {isEditing && item.editable ? (
                    <input
                      required
                      type="text"
                      value={editedValues[item.field || item.label.toLowerCase()]}
                      onChange={(e) => setEditedValues(prev => ({
                        ...prev,
                        [item.field || item.label.toLowerCase()]: e.target.value
                      }))}
                      className="text-base font-medium text-[#563393] border border-purple-200 rounded px-2 py-1 w-full focus:outline-none focus:border-[#563393]"
                    />
                  ) : (
                    <p className="text-base font-medium text-[#563393]">{item.value || "N/A"}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Edit Controls */}
          <div className="flex justify-center mt-6 gap-4">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-[#563393] text-white rounded-lg hover:bg-[#4a2c7d] transition-colors"
              >
                Edit Details
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 bg-[#563393] text-white rounded-lg hover:bg-[#4a2c7d] transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-2 bg-white text-[#563393] border border-[#563393] rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;