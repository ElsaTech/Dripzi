import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getCurrentUser } from "@/lib/actions/auth"
import { Mail, Phone, MapPin } from "lucide-react"

export default async function ContactPage() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />

      <main className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-serif text-5xl font-bold text-black md:text-6xl">Contact Us</h1>
          <p className="text-xl text-gray-600">We'd love to hear from you</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="neumorphic space-y-6 rounded-3xl p-8">
            <h2 className="mb-6 font-serif text-2xl font-bold text-black">Get in Touch</h2>

            <div className="flex gap-4">
              <div className="neumorphic-sm flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl">
                <Mail className="h-5 w-5 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-black">Email</h3>
                <p className="text-gray-600">support@dripzi.store</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="neumorphic-sm flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl">
                <Phone className="h-5 w-5 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-black">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="neumorphic-sm flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl">
                <MapPin className="h-5 w-5 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-black">Address</h3>
                <p className="text-gray-600">123 Fashion Street, New York, NY 10001</p>
              </div>
            </div>
          </div>

          <div className="neumorphic rounded-3xl p-8">
            <h2 className="mb-6 font-serif text-2xl font-bold text-black">Business Hours</h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Monday - Friday</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Saturday</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
