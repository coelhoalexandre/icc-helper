export default function checkNum(num: string) {
  if (num.at(num.length - 1) === ",") return (num += 0);

  return num;
}
