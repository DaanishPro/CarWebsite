import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"

interface CarComparisonData {
  id: string
  name: string
  imageSrc: string
  fuelType: string
  mileage: string
  transmission: string
  price: number
  discount?: number
}

interface ComparisonTableProps {
  carsToCompare: CarComparisonData[]
}

export default function ComparisonTable({ carsToCompare }: ComparisonTableProps) {
  if (carsToCompare.length < 2) {
    return <div className="text-center text-muted-foreground py-8">Select two cars to compare them side-by-side.</div>
  }

  const car1 = carsToCompare[0]
  const car2 = carsToCompare[1]

  const getDisplayPrice = (price: number, discount?: number) => {
    const discountedPrice = discount ? price - discount : price
    return `₹${discountedPrice.toLocaleString("en-IN")}`
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-yellow-500">Car Comparison</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Compare key specifications of your selected cars.
          </p>
        </div>
        <Card className="w-full overflow-x-auto">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]"></TableHead>
                  <TableHead className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Image
                        src={car1.imageSrc || "/placeholder.svg"}
                        alt={car1.name}
                        width={100}
                        height={60}
                        className="rounded-md object-cover"
                      />
                      <span className="font-semibold">{car1.name}</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Image
                        src={car2.imageSrc || "/placeholder.svg"}
                        alt={car2.name}
                        width={100}
                        height={60}
                        className="rounded-md object-cover"
                      />
                      <span className="font-semibold">{car2.name}</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Price</TableCell>
                  <TableCell className="text-center">{getDisplayPrice(car1.price, car1.discount)}</TableCell>
                  <TableCell className="text-center">{getDisplayPrice(car2.price, car2.discount)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Fuel Type</TableCell>
                  <TableCell className="text-center">{car1.fuelType}</TableCell>
                  <TableCell className="text-center">{car2.fuelType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Mileage</TableCell>
                  <TableCell className="text-center">{car1.mileage}</TableCell>
                  <TableCell className="text-center">{car2.mileage}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Transmission</TableCell>
                  <TableCell className="text-center">{car1.transmission}</TableCell>
                  <TableCell className="text-center">{car2.transmission}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
