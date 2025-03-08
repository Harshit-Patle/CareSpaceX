import React, { useEffect } from 'react';

function MedicineOverview() {
    const url = import.meta.env.VITE_Medicine_Guidelines_Alternatives;

    return (
        <div className="relative w-full h-[87vh] overflow-hidden">
            <iframe
                className="absolute top-0 left-0 w-full h-full border-none"
                src={url}
                title="💊 Medicine Guidelines & Alternatives"
                sandbox="allow-scripts allow-same-origin"></iframe>
        </div>
    );
}

export default MedicineOverview;
