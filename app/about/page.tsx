import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getCurrentUser } from "@/lib/actions/auth"

export default async function AboutPage() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />

      <main className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-serif text-5xl font-bold text-black md:text-6xl">About Dripzi</h1>
          <p className="text-xl text-gray-600">Fashion With No Rules</p>
        </div>

        <div className="neumorphic space-y-8 rounded-3xl p-8 md:p-12">
          <div>
            <h2 className="mb-4 font-serif text-3xl font-bold text-black">Our Story</h2>
            <p className="leading-relaxed text-gray-700">
              Dripzi was born from a vision to redefine modern fashion. We believe in breaking boundaries and creating
              pieces that empower individuals to express their unique style without constraints.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-3xl font-bold text-black">Our Philosophy</h2>
            <p className="leading-relaxed text-gray-700">
              Experience the intersection of bold Bauhaus design principles and sophisticated neumorphic interfaces. We
              craft fashion that merges timeless aesthetics with contemporary innovation, creating pieces that stand the
              test of time.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-3xl font-bold text-black">Quality & Sustainability</h2>
            <p className="leading-relaxed text-gray-700">
              Every piece is crafted with premium materials and ethical manufacturing practices. We're committed to
              sustainability and ensuring that our fashion choices contribute positively to the world.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-3xl font-bold text-black">Join the Movement</h2>
            <p className="leading-relaxed text-gray-700">
              Dripzi is more than a brand—it's a community of individuals who dare to be different. Join us in
              redefining what fashion means in the modern era.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
