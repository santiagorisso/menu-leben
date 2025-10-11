import Image from "next/image"

export default function BeerItem({
  name,
  ibu,
  abv,
  description,
  price,
  available = true,
}: {
  name: string
  ibu: string
  abv: string
  description: string
  price: string
  available?: boolean
}) {
  return (
    <div className="flex flex-col items-center text-center gap-2 relative">
      {!available && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Image src="/images/soldout.png" alt="Sold Out" width={200} height={100} className="opacity-90" />
        </div>
      )}
      <h3 className={`font-bold text-lg ${!available ? "opacity-40" : ""}`}>{name}</h3>
      <div className={`flex gap-4 text-sm text-muted-foreground ${!available ? "opacity-40" : ""}`}>
        <span>IBU: {ibu}</span>
        <span>ABV: {abv}</span>
      </div>
      <p className={`text-sm text-muted-foreground leading-relaxed italic ${!available ? "opacity-40" : ""}`}>
        {description}
      </p>
      <p className={`font-bold text-primary ${!available ? "opacity-40" : ""}`}>{price}</p>
    </div>
  )
}
