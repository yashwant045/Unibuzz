import { useEffect, useState } from "react";
//import { getCertificates } from "@/services/eventService";

export default function Certificates() {

  const [certificates, setCertificates] = useState([]);

  useEffect(() => {

    const fetchCertificates = async () => {

      const data = await getCertificates();

      setCertificates(data);

    };

    fetchCertificates();

  }, []);

  return (

    <div>

      <h1 className="text-3xl font-bold mb-8">
        Certificates
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {certificates.map((cert) => (

          <div
            key={cert.id}
            className="bg-white p-6 rounded-xl shadow"
          >

            <h2 className="text-lg font-bold">
              {cert.eventName}
            </h2>

            <p className="text-gray-500 mb-4">
              {cert.issueDate}
            </p>

            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Download
            </button>

          </div>

        ))}

      </div>

    </div>

  );
}