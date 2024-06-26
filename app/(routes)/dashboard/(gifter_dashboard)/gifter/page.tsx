import { giftBoxData } from "@/constants/data";
import GiftBoxTableArea from "../components/table-area";

const GifterDashboard = async () => {

    return (<div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <GiftBoxTableArea data={giftBoxData} />
        </div>
    </div>);
}

export default GifterDashboard;