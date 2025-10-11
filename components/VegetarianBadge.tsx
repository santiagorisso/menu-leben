import Image from "next/image"

export default function VegetarianBadge() {
  return (
    <Image src="/images/veggie.png" alt="Vegetarian" width={15} height={15} className="inline-block flex-shrink-0" />
  )
}
