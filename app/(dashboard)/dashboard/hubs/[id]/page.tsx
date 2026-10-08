import type { Metadata } from "next"
import { HubDetail } from "@/components/hubs/hub-detail"

export const metadata: Metadata = { title: "Hub Details | CourierPro" }

interface Props {
    params: Promise<{ id: string }>
}

export default async function HubDetailPage({ params }: Props) {
    const { id } = await params
    return <HubDetail id={id} />
}
