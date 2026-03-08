import ContentOrders from "@/components/dashboard/contetOrders";
import { getToken } from "@/lib/auth";

export default async function Dashboard() {
    const token = await getToken();
    return <ContentOrders token={token!} />
}