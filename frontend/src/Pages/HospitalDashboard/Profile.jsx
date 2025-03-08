import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, Stethoscope, Bed, LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from "axios";
import Cookies from 'js-cookie';

const Profile = () => {
  const [hospital, setHospital] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL;


  useEffect(() => {
    const fetchUser = async () => {
      try {
        let email = Cookies.get('email');
        const response = await axios.post(
          `${backendURL}/profile/hospital`,
          { email },
          { headers: { "Content-Type": "application/json", }, }
        );
        console.log(response);
        setHospital(response.data[0]);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Something went wrong!");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({
    phone: hospital.phone,
    website: hospital.website,
    bedCharges: hospital.bedCharges,
    specializations: hospital.specializations || [],
    location: hospital.location
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedValues({
      phone: hospital.phone,
      website: hospital.website,
      bedCharges: hospital.bedCharges,
      specializations: hospital.specializations.join(", "),
      location: hospital.location
    });
  };

  const handleSave = () => {
    setHospital(prev => ({
      ...prev,
      ...editedValues,
      specializations: editedValues.specializations.split(",")
        .map(spec => spec.trim()) // trim spaces around specializations
        .filter(spec => spec !== "") // remove empty entries
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedValues({
      phone: hospital.phone,
      website: hospital.website,
      bedCharges: hospital.bedCharges,
      specializations: hospital.specializations.join(", "),
      location: hospital.location
    });
  };

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
              { icon: Building2, label: 'Name', value: hospital.name },
              { icon: Mail, label: 'Email', value: hospital.email },
              { icon: Phone, label: 'Phone', value: hospital.phone, editable: true },
              // { icon: LinkIcon, label: 'Website', value: hospital.website, editable: true },
              { icon: Bed, label: 'Bed Charges (₹/day)', value: `₹${hospital.charges}`, editable: true, type: 'number', field: 'bedCharges' },
              { icon: Stethoscope, label: 'Specializations', value: (hospital.specialization || []).join(", "), editable: true, placeholder: "Enter specializations separated by commas" },
              { icon: MapPin, label: 'Location', value:`${hospital.city},${hospital.state}, ${hospital.country} `, editable: true }
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
                      value={item.label === 'Specializations' ? editedValues.specializations :
                        (item.field ? editedValues[item.field] : editedValues[item.label.toLowerCase()])}
                      onChange={(e) => setEditedValues(prev => ({
                        ...prev,
                        [item.label === 'Specializations' ? 'specializations' : (item.field || item.label.toLowerCase())]:
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