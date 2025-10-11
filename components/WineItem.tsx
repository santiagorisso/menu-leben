import Image from "next/image"

export default function WineItem({
  name,
  style,
  wineType,
  glassPrice,
  bottlePrice,
  available = true,
}: {
  name: string
  style: string
  wineType: "red" | "white"
  glassPrice: string
  bottlePrice: string
  available?: boolean
}) {
  return (
    <div className="flex flex-col items-center text-center gap-2 relative">
      {!available && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Image src="/images/soldout.png" alt="Sold Out" width={200} height={100} className="opacity-90" />
        </div>
      )}
      <h3 className={`font-bold text-xl ${!available ? "opacity-40" : ""}`}>{name}</h3>
      <p className={`text-sm text-muted-foreground italic ${!available ? "opacity-40" : ""}`}>{style}</p>
      <p className={`text-sm font-bold uppercase ${!available ? "opacity-40" : ""}`}>
        {wineType === "red" ? "TINTO" : "BLANCO"}
      </p>
      <div className={`flex flex-col gap-1 mt-2 ${!available ? "opacity-40" : ""}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">copa</span>
          <span className="font-bold text-primary">{glassPrice}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">botella</span>
          <span className="font-bold text-primary">{bottlePrice}</span>
        </div>
      </div>
    </div>
  )
}
