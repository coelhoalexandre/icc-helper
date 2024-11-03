import { NumberingSystemsMethods } from "../../../enums/NumberingSystemsMethods";
import MethodsProps from "../../../types/MethodsProps";

export default function TFNComponent({ knownBase }: MethodsProps) {
  if (knownBase.id !== NumberingSystemsMethods.TFN)
    throw new Error("The Known Base does not match that of the TFN Component");
  return (
    <>
      <p>
        {knownBase.parcels.map((parcel, index) => {
          const signal = knownBase.parcels.length !== index + 1 ? "+" : "=";
          return (
            <>
              {" "}
              <strong key={index}>
                {parcel.digit} x {parcel.base}
                <sup>{parcel.exponent}</sup>
              </strong>{" "}
              {signal}
            </>
          );
        })}
      </p>
      <p>
        {knownBase.products.join(" + ").replace(".", ",")} ={" "}
        <strong>{knownBase.convertedNumber}</strong>
      </p>
    </>
  );
}
