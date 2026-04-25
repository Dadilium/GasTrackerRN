/**
 * io-ts codecs for runtime validation of API responses.
 * Keeps the boundary between untrusted external data and our domain airtight.
 */
import * as t from 'io-ts';

const FuelTypeCodec = t.union([
  t.literal('regular'),
  t.literal('midgrade'),
  t.literal('premium'),
  t.literal('diesel'),
]);

const CoordinatesCodec = t.type({
  latitude: t.number,
  longitude: t.number,
});

const FuelPriceCodec = t.type({
  fuelType: FuelTypeCodec,
  pricePerLitre: t.number,
  updatedAt: t.string,
});

export const GasStationCodec = t.type({
  id: t.string,
  name: t.string,
  brand: t.string,
  address: t.string,
  coordinates: CoordinatesCodec,
  prices: t.array(FuelPriceCodec),
  isOpen: t.boolean,
  distanceKm: t.number,
});

export const GasStationArrayCodec = t.array(GasStationCodec);
