import { TR_CITIES } from "@/lib/constants/tr-cities";

/**
 * 81 ili öneren native <datalist>. Aynı sayfada birden fazla
 * <input list="tr-cities"> tarafından paylaşılır. Sayfa başına bir kez
 * render edilmelidir.
 */
export function TrCitiesDatalist() {
  return (
    <datalist id="tr-cities">
      {TR_CITIES.map((city) => (
        <option key={city.slug} value={city.name} />
      ))}
    </datalist>
  );
}
