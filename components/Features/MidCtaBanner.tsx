import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MidCtaBanner() {
  return (
    <section className="w-full py-12 md:py-16 bg-[#DC2626] text-white text-center">
      <div className="container px-4 md:px-6 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">Still not sure which car to pick?</h2>
        <p className="text-lg md:text-xl max-w-2xl">
          Let our experts help you find the perfect vehicle that matches your needs and budget.
        </p>
        <Link href="/contact">
          <Button
            variant="outline"
            className="bg-white text-[#DC2626] hover:bg-gray-100 hover:text-yellow-600 px-8 py-6 text-lg"
          >
            Explore Now
          </Button>
        </Link>
      </div>
    </section>
  )
}
