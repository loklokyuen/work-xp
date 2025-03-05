import Listing from "@/components/listing";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function EditListing() {
    const { availability, description, jobRole, id } = useLocalSearchParams<OpportunityCardProps>();

    return <Listing listingId={id} />;
}
