import type { Listing } from "@/types/listing";
import { EvDevriCard } from "./EvDevriCard";
import { EsyaDevriCard } from "./EsyaDevriCard";
import { NakliyeAriyorumCard } from "./NakliyeAriyorumCard";
import { NakliyeciAracCard } from "./NakliyeciAracCard";
import { HizmetVerenlerCard } from "./HizmetVerenlerCard";
import { SehirSorusuCard } from "./SehirSorusuCard";

export function ListingCardRouter({ listing }: { listing: Listing }) {
  switch (listing.category) {
    case "ev-devri":
      return <EvDevriCard listing={listing} />;
    case "esya-devri":
      return <EsyaDevriCard listing={listing} />;
    case "nakliye-ariyorum":
      return <NakliyeAriyorumCard listing={listing} />;
    case "nakliyeci-arac-ilani":
      return <NakliyeciAracCard listing={listing} />;
    case "sehir-sorusu":
      return <SehirSorusuCard listing={listing} />;
    case "hizmet-verenler":
      return <HizmetVerenlerCard listing={listing} />;
  }
}
