import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { FaMobileAlt, FaDesktop, FaTabletAlt } from 'react-icons/fa';

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export default function MapCoverage() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h5 className="text-center text-lg font-semibold">Sales Report by Locations with Devices</h5>

      <div className="mt-6">
        <ComposableMap projectionConfig={{ scale: 200 }}>
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) => // define the type here
              geographies.map((geo: any) => (
                <Geography key={geo.rsmKey} geography={geo} className="fill-indigo-300" />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>

      <div className="mt-6">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 p-2 text-left">DEVICE</th>
              <th className="border border-gray-200 p-2">USA</th>
              <th className="border border-gray-200 p-2">INDIA</th>
              <th className="border border-gray-200 p-2">BAHRAIN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 p-2 flex items-center">
                <FaMobileAlt className="text-purple-500 mr-2" /> Mobiles
              </td>
              <td className="border border-gray-200 p-2 text-center">17%</td>
              <td className="border border-gray-200 p-2 text-center">22%</td>
              <td className="border border-gray-200 p-2 text-center">11%</td>
            </tr>
            <tr>
              <td className="border border-gray-200 p-2 flex items-center">
                <FaDesktop className="text-blue-400 mr-2" /> Desktops
              </td>
              <td className="border border-gray-200 p-2 text-center">34%</td>
              <td className="border border-gray-200 p-2 text-center">76%</td>
              <td className="border border-gray-200 p-2 text-center">58%</td>
            </tr>
            <tr>
              <td className="border border-gray-200 p-2 flex items-center">
                <FaTabletAlt className="text-pink-400 mr-2" /> Tablets
              </td>
              <td className="border border-gray-200 p-2 text-center">56%</td>
              <td className="border border-gray-200 p-2 text-center">83%</td>
              <td className="border border-gray-200 p-2 text-center">66%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
