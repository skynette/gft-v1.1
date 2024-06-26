import { GiftBoxColumn } from "../components/columns";
import GiftBoxTableArea from "../components/table-area";

export const giftBoxData: GiftBoxColumn[] = [
  {
      id: "1",
      name: "Birthday Surprise",
      createdAt: "2023-06-01",
  },
  {
      id: "2",
      name: "Anniversary Delight",
      createdAt: "2023-05-15",
  },
  {
      id: "3",
      name: "Holiday Cheer",
      createdAt: "2023-12-24",
  },
  {
      id: "4",
      name: "Graduation Gift",
      createdAt: "2023-07-10",
  },
  {
      id: "5",
      name: "Wedding Bliss",
      createdAt: "2023-09-30",
  },
];


const GifterDashboard = async () => {

    return (<div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <GiftBoxTableArea data={giftBoxData} />
        </div>
    </div>);
}

export default GifterDashboard;