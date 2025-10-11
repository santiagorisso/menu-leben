import Image from "next/image"

export default function MenuItem({
  name,
  description,
  price,
  vegetarian,
  available = true,
}: {
  name: string
  description?: string
  price: string
  vegetarian?: boolean
  available?: boolean
}) {
  return (
    <div className="flex flex-col items-center text-center gap-2 relative">
      {!available && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Image src="/images/soldout.png" alt="Sold Out" width={200} height={100} className="opacity-90" />
        </div>
      )}
      <div className={`flex items-center justify-center gap-2 ${!available ? "opacity-40" : ""}`}>
        <h3 className="font-bold text-base leading-tight">{name}</h3>
        {vegetarian && (
          <Image
            src="/images/veggie.png"
            alt="Vegetarian"
            width={20}
            height={20}
            className="inline-block flex-shrink-0"
          />
        )}
      </div>
      {description && (
        <p className={`text-sm text-muted-foreground leading-relaxed italic ${!available ? "opacity-40" : ""}`}>
          {description}
        </p>
      )}
      <p className={`font-bold text-primary ${!available ? "opacity-40" : ""}`}>{price}</p>
    </div>
  )
}
