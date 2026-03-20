const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function convertHundreds(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ones[n];
  if (n < 100) {
    return `${tens[Math.floor(n / 10)]}${n % 10 !== 0 ? ` ${ones[n % 10]}` : ""}`;
  }
  const rem = n % 100;
  return `${ones[Math.floor(n / 100)]} Hundred${rem !== 0 ? ` ${convertHundreds(rem)}` : ""}`;
}

export function numberToWords(amount: number): string {
  const n = Math.round(amount);
  if (n === 0) return "Zero";

  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = n % 1000;

  let result = "";
  if (crore > 0) result += `${convertHundreds(crore)} Crore `;
  if (lakh > 0) result += `${convertHundreds(lakh)} Lakh `;
  if (thousand > 0) result += `${convertHundreds(thousand)} Thousand `;
  if (hundred > 0) result += convertHundreds(hundred);

  return `Rupees ${result.trim()} Only.`;
}
