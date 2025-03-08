import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Languages, Stethoscope, Coins, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Cookies from 'js-cookie';
import axios from 'axios';

const Profile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({});

  useEffect(() => {
    const fetchDoctorData = async () => {
      // window.location.reload();
      const email = Cookies.get('email');
      try {
        const response = await axios.post(
          "http://localhost:3000/profile/doctor",
          { email },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log(response);
        setDoctor(response.data[0]);
        setEditedValues({
          phone: response.data[0].phone,
          consultationFee: response.data[0].charges,
          hospital: response.data[0].hospital,
          location: response.data[0].location,
          languages: response.data[0].languages.join(", ")
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch doctor. Please try again later.");
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setDoctor(prev => ({
      ...prev,
      ...editedValues,
      languages: editedValues.languages.split(",  ").map(lang => lang.trim()) 
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedValues({
      phone: doctor.phone,
      consultationFee: doctor.consultationFee,
      hospital: doctor.hospital,
      location: doctor.location,
      languages: doctor.languages.join(", ")
    });
  };

  if (loading) return <div>Loading hospitals...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="h-fit p-3">
      <Card className="w-full border border-purple-100">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-3xl font-bold text-[#563393]">
            My Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="px-3 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto">
            {[
              { icon: User, label: 'Name', value: doctor.name },
              { icon: Mail, label: 'Email', value: doctor.email },
              { icon: Phone, label: 'Phone', value: doctor.phone, editable: true },
              { icon: User, label: 'Gender', value: doctor.gender },
              { icon: Stethoscope, label: 'Specialization', value: doctor.specialization },
              { icon: Languages, label: 'Languages', value: doctor.languages, editable: true, placeholder: "Enter languages separated by commas" },
              { icon: Coins, label: 'Consultation Fee (₹)', value: `₹${doctor.charges}`, editable: true, type: 'number', field: 'consultationFee' },
              { icon: Building2, label: 'Hospital/Clinic', value: doctor.hospital, editable: true },
              { icon: MapPin, label: 'Location', value:`${doctor.city},${doctor.state},${doctor.country}`, editable: true }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-purple-100 shadow-sm hover:border-[#563393] transition-colors">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <item.icon className="w-6 h-6 text-[#563393]" />
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="text-sm font-medium text-purple-400">{item.label}</p>
                  {isEditing && item.editable ? (
                    <input
                      required
                      type={item.type || 'text'}
                      value={item.label === 'Languages' ? editedValues.languages : (item.field ? editedValues[item.field] : editedValues[item.label.toLowerCase()])}
                      onChange={(e) => setEditedValues(prev => ({
                        ...prev,
                        [item.label === 'Languages' ? 'languages' : (item.field || item.label.toLowerCase())]:
                          item.type === 'number' ? parseFloat(e.target.value) : e.target.value
                      }))}
                      placeholder={item.placeholder}
                      className="text-base font-medium text-[#563393] border border-purple-200 rounded px-2 py-1 w-full focus:outline-none focus:border-[#563393]"
                    />
                  ) : (
                    <p className="text-base font-medium text-[#563393]">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

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
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-2 bg-white text-[#563393] border border-[#563393] rounded-lg hover:bg-purple-50 transition-colors"
                >
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